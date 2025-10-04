/**
 * メインシミュレーション実行関数
 */

import { R } from "@mobily/ts-belt";
import * as Blast from "../calc/blast";
import * as Breakup from "../calc/breakup";
import * as Coord from "../calc/coordinates";
import * as Vec from "../calc/coordinates/vector";
import * as Impact from "../calc/impact";
import * as Integration from "../calc/integration";
import * as Seismic from "../calc/seismic";
import {
	ATMOSPHERE_SCALE_HEIGHT_M,
	DEFAULT_BLAST_THRESHOLDS_KPA,
	DEFAULT_SEISMIC_EFFICIENCY,
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

	// 断面積を計算
	const radius_m = meteoroid.diameter_m / 2;
	const area_m2 = Math.PI * radius_m * radius_m;

	// 初期質量を計算
	const volume_m3 = (4 / 3) * Math.PI * radius_m * radius_m * radius_m;
	const m0_kg = meteoroid.density_kg_m3 * volume_m3;

	// 強度をPaに変換
	const strength_pa = meteoroid.strength_mpa * 1e6;

	// 地表密度（簡易的に）
	const target_density_kg_m3 = environment.surface === "water" ? 1000 : 2500;

	// 初期位置・速度の準備
	const r0_ecef = discovery.r0_ecef;

	// 位置から緯度経度を取得してENU基底を作成
	const geodResult = Coord.ecefToGeodetic(r0_ecef);
	if (R.isError(geodResult)) {
		return geodResult;
	}
	const geod = R.getExn(geodResult);
	const { lat: lat_rad, lon: lon_rad } = geod;

	const basisResult = Coord.enuBasisAt(lat_rad, lon_rad);
	if (R.isError(basisResult)) {
		return basisResult;
	}
	const basis = R.getExn(basisResult);

	// 初期速度ベクトルを計算
	const v0Result = Coord.velocityFromAzimuthEntry(
		discovery.velocity.magnitude_m_s,
		discovery.velocity.azimuth_deg,
		discovery.velocity.entry_angle_deg,
		basis,
	);
	if (R.isError(v0Result)) {
		return v0Result;
	}
	const v0_ecef = R.getExn(v0Result);

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
	};

	// 軌道積分を実行
	const trajectoryResult = Integration.integrateTrajectory(r0_ecef, v0_ecef, m0_kg, params);
	if (R.isError(trajectoryResult)) {
		return trajectoryResult;
	}
	const trajectory = R.getExn(trajectoryResult);
	const { samples } = trajectory;

	// 衝突までの時間
	const time_to_impact_s = samples[samples.length - 1].t;

	// 最終速度からエネルギーを計算
	const final_sample = samples[samples.length - 1];
	const v_final_mag = Vec.magnitude(final_sample.v_ecef);
	// 最終質量は初期質量と同じと仮定（アブレーション未実装の場合）
	const E_joule = 0.5 * m0_kg * v_final_mag * v_final_mag;
	const E_mt_tnt = E_joule / MEGATON_TNT_JOULE;

	// 空中爆発の検出
	const airburstResult = Breakup.detectAirburst(samples, meteoroid.strength_mpa);
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
	let crater = null;
	if (impactState !== null) {
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

	// 爆風影響範囲
	const burst_alt = airburst?.burst_altitude_m ?? 0;
	const blastRadiiResult = Blast.calculateBlastRadii(E_joule, blast_thresholds_kpa, burst_alt);
	if (R.isError(blastRadiiResult)) {
		return blastRadiiResult;
	}
	const damage_radii_km = R.getExn(blastRadiiResult);

	// 地震規模
	const magnitudeResult = Seismic.calculateSeismicMagnitude(E_joule, seismic_efficiency);
	if (R.isError(magnitudeResult)) {
		return magnitudeResult;
	}
	const moment_magnitude_M = R.getExn(magnitudeResult);

	// 結果をまとめる
	const result: SimulationResult = {
		trajectory: samples,
		time_to_impact_s,
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
