/**
 * メインシミュレーション実行関数
 */

import { R } from "@mobily/ts-belt";
import * as Blast from "../calc/blast";
import * as Breakup from "../calc/breakup";
import * as Vec from "../calc/coordinates/vector";
import * as Impact from "../calc/impact";
import * as Integration from "../calc/integration";
import * as Seismic from "../calc/seismic";
import {
	ATMOSPHERE_SCALE_HEIGHT_M,
	DEFAULT_BLAST_THRESHOLDS_KPA,
	DEFAULT_ESCAPE_CONTINUE_TIME_S,
	DEFAULT_SEISMIC_EFFICIENCY,
	DEFAULT_STRENGTH_MPA,
	MEGATON_TNT_JOULE,
	SEA_LEVEL_DENSITY_KG_M3,
	STANDARD_DRAG_COEFFICIENT,
	STANDARD_GRAVITY_M_S2,
} from "../types/constants";
import type { SimulationInput } from "../types/input";
import type { SimulationResult } from "../types/output";
import type { SimulationParams } from "../types/state";

/**
 * 隕石衝突シミュレーションを実行
 */
export const simulateMeteorImpact = (input: SimulationInput): R.Result<SimulationResult, Error> => {
	const { discovery, meteoroid, environment, model } = input;

	// パラメータの準備
	const rho0_kg_m3 = environment.rho0_kg_m3 ?? SEA_LEVEL_DENSITY_KG_M3;
	const scale_height_m = environment.scale_height_m ?? ATMOSPHERE_SCALE_HEIGHT_M;
	const gravity_m_s2 = environment.gravity_m_s2 ?? STANDARD_GRAVITY_M_S2;
	const Cd = model?.drag_coefficient ?? STANDARD_DRAG_COEFFICIENT;
	const seismic_efficiency = model?.seismic_efficiency ?? DEFAULT_SEISMIC_EFFICIENCY;
	const blast_thresholds_kpa = model?.blast_thresholds_kpa ?? DEFAULT_BLAST_THRESHOLDS_KPA;
	const escape_continue_time_s = model?.escape_continue_time_s ?? DEFAULT_ESCAPE_CONTINUE_TIME_S;
	const dt = model?.time_step_s ?? 1; // 1秒
	const max_time = model?.max_time_s ?? 60 * 60 * 24 * 30 * 3; // 90日 = 7,776,000秒

	// 断面積を計算
	const radius_m = meteoroid.diameter_m / 2;
	const area_m2 = Math.PI * radius_m * radius_m;

	// 初期質量を計算
	const volume_m3 = (4 / 3) * Math.PI * radius_m * radius_m * radius_m;
	const m0_kg = meteoroid.density_kg_m3 * volume_m3;

	// 強度をPaに変換（デフォルト: 5 MPa）
	const strength_pa = (meteoroid.strength_mpa ?? DEFAULT_STRENGTH_MPA) * 1e6;

	// 地表密度（簡易的に）
	const target_density_kg_m3 = environment.surface === "water" ? 1000 : 2500;

	// 初期位置・速度の準備
	const r0_ecef = discovery.r0_ecef;
	const v0_ecef = discovery.velocity_ecef;

	// シミュレーションパラメータ
	const params: SimulationParams = {
		Cd,
		area_m2,
		rho0_kg_m3,
		scale_height_m,
		gravity_m_s2,
		ablation_coeff: model?.ablation_coeff,
		strength_pa,
		surface: environment.surface,
		density_kg_m3: meteoroid.density_kg_m3,
		seismic_efficiency,
		blast_thresholds_kpa: [...blast_thresholds_kpa],
		escape_continue_time_s,
	};

	// 軌道積分を実行
	const trajectoryResult = Integration.integrateTrajectory(
		r0_ecef,
		v0_ecef,
		m0_kg,
		params,
		dt,
		max_time,
	);
	if (R.isError(trajectoryResult)) {
		return trajectoryResult;
	}
	const trajectory = R.getExn(trajectoryResult);
	const { samples } = trajectory;

	// シミュレーション終了時刻
	const final_sample = samples[samples.length - 1];
	if (final_sample === undefined) {
		return R.Error(new Error("軌道サンプルが空です"));
	}
	const end_time_s = final_sample.t;

	// エネルギー計算
	// ground または breakup の場合のみ地球にエネルギーが預託される
	// escape, burnout, max_time の場合は地球への影響なし
	let E_joule = 0;
	let E_mt_tnt = 0;

	if (trajectory.terminationReason === "ground" || trajectory.terminationReason === "breakup") {
		const v_final_mag = Vec.magnitude(final_sample.v_ecef);
		// 最終質量は最終サンプルの質量を使用
		E_joule = 0.5 * final_sample.mass_kg * v_final_mag * v_final_mag;
		E_mt_tnt = E_joule / MEGATON_TNT_JOULE;
	}

	// 空中爆発の検出（terminationReasonを渡す）
	const airburstResult = Breakup.detectAirburst(samples, trajectory.terminationReason);
	if (R.isError(airburstResult)) {
		return airburstResult;
	}
	const airburst = R.getExn(airburstResult);

	// 衝突検出
	const impactResult = Impact.detectImpact(samples);
	if (R.isError(impactResult)) {
		return impactResult;
	}
	const impactState = R.getExn(impactResult);

	// クレーター計算（地表衝突の場合）
	let crater: SimulationResult["crater"] = { hasCrater: false };
	if (impactState.impacted) {
		// 水面衝突の場合はクレーターを形成しない
		if (environment.surface === "water") {
			crater = { hasCrater: false };
		} else {
			// 衝突角度を計算（速度ベクトルと地表法線のなす角）
			const impact_v_mag = Vec.magnitude(impactState.v_ecef);

			// 地表法線ベクトル（簡易的に位置ベクトルの正規化）
			const normal = Vec.normalize(impactState.r_ecef);
			const v_normalized = Vec.normalize(impactState.v_ecef);

			// 衝突角度（内積から計算、90度から引く）
			const cos_angle = -Vec.dot(normal, v_normalized);
			const impact_angle_rad = Math.acos(Math.max(-1, Math.min(1, cos_angle)));
			const impact_angle_deg = (impact_angle_rad * 180) / Math.PI;

			const craterResult = Impact.calculateCrater(
				meteoroid.diameter_m,
				meteoroid.density_kg_m3,
				impact_v_mag,
				impact_angle_deg,
				target_density_kg_m3,
				gravity_m_s2,
			);
			if (R.isError(craterResult)) {
				return craterResult;
			}
			crater = R.getExn(craterResult);
		}
	}

	// 爆風影響範囲
	// ground または breakup の場合のみ爆風が発生
	let damage_radii_km: Record<string, number> = {};
	if (
		(trajectory.terminationReason === "ground" || trajectory.terminationReason === "breakup") &&
		E_joule > 0
	) {
		const burst_alt = airburst.isOccurrence ? airburst.burst_altitude_m : 0;
		const blastRadiiResult = Blast.calculateBlastRadii(E_joule, blast_thresholds_kpa, burst_alt);
		if (R.isError(blastRadiiResult)) {
			return blastRadiiResult;
		}
		damage_radii_km = R.getExn(blastRadiiResult);
	}

	// 地震規模
	// ground（地表衝突）の場合のみ地震が発生
	let moment_magnitude_M = 0;
	if (trajectory.terminationReason === "ground" && E_joule > 0) {
		const magnitudeResult = Seismic.calculateSeismicMagnitude(E_joule, seismic_efficiency);
		if (R.isError(magnitudeResult)) {
			return magnitudeResult;
		}
		moment_magnitude_M = R.getExn(magnitudeResult);
	}

	// 結果をまとめる
	const result: SimulationResult = {
		trajectory: samples,
		terminationReason: trajectory.terminationReason,
		end_time_s,
		energy: {
			joule: E_joule,
			mt_tnt: E_mt_tnt,
		},
		airburst,
		crater,
		blast: {
			damage_radii_km,
		},
		seismic: {
			moment_magnitude_M,
		},
	};

	return R.Ok(result);
};
