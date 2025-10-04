/**
 * Runge-Kutta法による数値積分
 */

import { R } from "@mobily/ts-belt";
import { EARTH_MU_M3_S2 } from "../../types/constants";
import type { Vec3 } from "../../types/input";
import type { TrajectoryPoint } from "../../types/output";
import type { DynamicState, SimulationParams } from "../../types/state";
import * as Atmos from "../atmosphere/density";
import * as Coord from "../coordinates/ecef";
import * as Vec from "../coordinates/vector";
import * as Physics from "../physics";
import * as Drag from "../physics/drag";

/** 軌道積分の結果 */
export interface TrajectoryResult {
	/** サンプル点の配列 */
	readonly samples: readonly TrajectoryPoint[];
	/** 終了理由 */
	readonly terminationReason: "ground" | "breakup" | "burnout" | "max_time" | "escape";
}

/**
 * 1ステップのRunge-Kutta積分を実行
 */
const rk4Step = (
	t: number,
	state: DynamicState,
	dt: number,
	params: SimulationParams,
): R.Result<DynamicState, Error> => {
	// k1 = f(t, y)
	const k1Result = Physics.rhsState(t, state, params);
	if (R.isError(k1Result)) return k1Result;
	const k1 = R.getExn(k1Result);

	// k2 = f(t + dt/2, y + k1*dt/2)
	const state2: DynamicState = {
		r: Vec.add(state.r, Vec.scale(k1.dr_dt, dt / 2)),
		v: Vec.add(state.v, Vec.scale(k1.dv_dt, dt / 2)),
		m: state.m + k1.dm_dt * (dt / 2),
	};
	const k2Result = Physics.rhsState(t + dt / 2, state2, params);
	if (R.isError(k2Result)) return k2Result;
	const k2 = R.getExn(k2Result);

	// k3 = f(t + dt/2, y + k2*dt/2)
	const state3: DynamicState = {
		r: Vec.add(state.r, Vec.scale(k2.dr_dt, dt / 2)),
		v: Vec.add(state.v, Vec.scale(k2.dv_dt, dt / 2)),
		m: state.m + k2.dm_dt * (dt / 2),
	};
	const k3Result = Physics.rhsState(t + dt / 2, state3, params);
	if (R.isError(k3Result)) return k3Result;
	const k3 = R.getExn(k3Result);

	// k4 = f(t + dt, y + k3*dt)
	const state4: DynamicState = {
		r: Vec.add(state.r, Vec.scale(k3.dr_dt, dt)),
		v: Vec.add(state.v, Vec.scale(k3.dv_dt, dt)),
		m: state.m + k3.dm_dt * dt,
	};
	const k4Result = Physics.rhsState(t + dt, state4, params);
	if (R.isError(k4Result)) return k4Result;
	const k4 = R.getExn(k4Result);

	// 次の状態を計算: y_{n+1} = y_n + (k1 + 2*k2 + 2*k3 + k4) * dt / 6
	const dr = Vec.scale(
		Vec.add(Vec.add(Vec.add(k1.dr_dt, Vec.scale(k2.dr_dt, 2)), Vec.scale(k3.dr_dt, 2)), k4.dr_dt),
		dt / 6,
	);
	const dv = Vec.scale(
		Vec.add(Vec.add(Vec.add(k1.dv_dt, Vec.scale(k2.dv_dt, 2)), Vec.scale(k3.dv_dt, 2)), k4.dv_dt),
		dt / 6,
	);
	const dm = (k1.dm_dt + 2 * k2.dm_dt + 2 * k3.dm_dt + k4.dm_dt) * (dt / 6);

	const newState: DynamicState = {
		r: Vec.add(state.r, dr),
		v: Vec.add(state.v, dv),
		m: Math.max(state.m + dm, 0), // 質量が負にならないようにする
	};

	return R.Ok(newState);
};

/**
 * 軌道を積分して時系列データを生成
 *
 * @param r0 初期位置 ECEF [m]
 * @param v0 初期速度 ECEF [m/s]
 * @param m0 初期質量 [kg]
 * @param params シミュレーションパラメータ
 * @param dt 時間ステップ [s]
 * @param max_time 最大シミュレーション時間 [s]
 * @returns 軌道結果
 */
export const integrateTrajectory = (
	r0: Vec3,
	v0: Vec3,
	m0: number,
	params: SimulationParams,
	dt = 1, // 1秒
	max_time = 60 * 60 * 24 * 30 * 3, // 90日 = 7,776,000秒
): R.Result<TrajectoryResult, Error> => {
	const samples: TrajectoryPoint[] = [];
	let state: DynamicState = { r: r0, v: v0, m: m0 };
	let t = 0;

	// 初期状態を記録
	const initialGeodResult = Coord.ecefToGeodetic(r0);
	if (R.isError(initialGeodResult)) {
		return initialGeodResult;
	}
	const initialGeod = R.getExn(initialGeodResult);

	samples.push({
		t: 0,
		r_ecef: r0,
		v_ecef: v0,
		mass_kg: m0,
		alt_m: initialGeod.alt_m,
		lat: (initialGeod.lat * 180) / Math.PI,
		lon: (initialGeod.lon * 180) / Math.PI,
	});

	let terminationReason: "ground" | "breakup" | "burnout" | "max_time" | "escape" = "max_time";

	// 質量が初期質量の1%未満になったら燃え尽きたと判定
	const burnout_threshold = m0 * 0.01;

	// 適応的サンプリング用の前回値
	let lastSampleV = Vec.magnitude(v0);
	let lastSampleVDir = Vec.normalize(v0);
	let lastSampleT = 0;

	// 積分ループ
	while (t < max_time) {
		// 1ステップ積分
		const nextStateResult = rk4Step(t, state, dt, params);
		if (R.isError(nextStateResult)) {
			return nextStateResult;
		}
		state = R.getExn(nextStateResult);
		t += dt;

		// 位置情報を取得
		const geodResult = Coord.ecefToGeodetic(state.r);
		if (R.isError(geodResult)) {
			return geodResult;
		}
		const geod = R.getExn(geodResult);

		// 破砕判定
		const rhoResult = Atmos.atmosphericDensity(
			geod.alt_m,
			params.rho0_kg_m3,
			params.scale_height_m,
		);
		if (R.isError(rhoResult)) {
			return rhoResult;
		}
		const rho = R.getExn(rhoResult);

		// 適応的サンプリング: 速度の大きさ・向きが大きく変化した時のみ記録
		const v_mag = Vec.magnitude(state.v);
		const qResult = Drag.dynamicPressure(v_mag, rho);
		if (R.isError(qResult)) {
			return qResult;
		}
		const q = R.getExn(qResult);

		if (q >= params.strength_pa) {
			terminationReason = "breakup";
		}

		// 脱出判定: 大気圏外でエネルギーが正かつ遠ざかっている
		if (geod.alt_m > 100000) {
			// 100km以上
			const r_mag = Vec.magnitude(state.r);
			const v_mag_escape = Vec.magnitude(state.v);
			const E = (v_mag_escape * v_mag_escape) / 2 - EARTH_MU_M3_S2 / r_mag;
			const r_dot_v = Vec.dot(state.r, state.v);

			if (E > 0 && r_dot_v > 0) {
				terminationReason = "escape";
			}
		}

		const v_dir = Vec.normalize(state.v);
		const v_mag_change = Math.abs(v_mag - lastSampleV) / lastSampleV;
		const angle_change = Math.acos(Math.max(-1, Math.min(1, Vec.dot(lastSampleVDir, v_dir))));
		const time_since_last_sample = t - lastSampleT;

		// 以下のいずれかの条件を満たす場合にサンプル点を追加
		// 1. 速度の大きさが5%以上変化
		// 2. 速度の向きが5度以上変化
		// 3. 最後のサンプルから60秒以上経過
		const should_sample =
			v_mag_change > 0.05 || angle_change > (5 * Math.PI) / 180 || time_since_last_sample >= 600;

		if (should_sample) {
			samples.push({
				t,
				r_ecef: state.r,
				v_ecef: state.v,
				mass_kg: state.m,
				alt_m: geod.alt_m,
				lat: (geod.lat * 180) / Math.PI,
				lon: (geod.lon * 180) / Math.PI,
			});
			lastSampleV = v_mag;
			lastSampleVDir = v_dir;
			lastSampleT = t;
		}

		// 地表到達判定
		if (geod.alt_m <= 0) {
			terminationReason = "ground";
			// 最後の点を必ず記録
			if (!should_sample) {
				samples.push({
					t,
					r_ecef: state.r,
					v_ecef: state.v,
					mass_kg: state.m,
					alt_m: geod.alt_m,
					lat: (geod.lat * 180) / Math.PI,
					lon: (geod.lon * 180) / Math.PI,
				});
			}
			break;
		}

		// 破砕で停止
		if (terminationReason === "breakup") {
			// 最後の点を必ず記録
			if (!should_sample) {
				samples.push({
					t,
					r_ecef: state.r,
					v_ecef: state.v,
					mass_kg: state.m,
					alt_m: geod.alt_m,
					lat: (geod.lat * 180) / Math.PI,
					lon: (geod.lon * 180) / Math.PI,
				});
			}
			break;
		}

		// 脱出で停止
		if (terminationReason === "escape") {
			// 最後の点を必ず記録
			if (!should_sample) {
				samples.push({
					t,
					r_ecef: state.r,
					v_ecef: state.v,
					mass_kg: state.m,
					alt_m: geod.alt_m,
					lat: (geod.lat * 180) / Math.PI,
					lon: (geod.lon * 180) / Math.PI,
				});
			}
			break;
		}

		// 燃え尽き判定
		if (state.m < burnout_threshold) {
			terminationReason = "burnout";
			// 最後の点を必ず記録
			if (!should_sample) {
				samples.push({
					t,
					r_ecef: state.r,
					v_ecef: state.v,
					mass_kg: state.m,
					alt_m: geod.alt_m,
					lat: (geod.lat * 180) / Math.PI,
					lon: (geod.lon * 180) / Math.PI,
				});
			}
			break;
		}
	}

	// max_timeでタイムアウトした場合も最後の点を記録
	if (terminationReason === "max_time" && samples.length > 0) {
		const lastRecorded = samples[samples.length - 1];
		if (lastRecorded && lastRecorded.t !== t) {
			const geodResult = Coord.ecefToGeodetic(state.r);
			if (R.isOk(geodResult)) {
				const geod = R.getExn(geodResult);
				samples.push({
					t,
					r_ecef: state.r,
					v_ecef: state.v,
					mass_kg: state.m,
					alt_m: geod.alt_m,
					lat: (geod.lat * 180) / Math.PI,
					lon: (geod.lon * 180) / Math.PI,
				});
			}
		}
	}

	return R.Ok({
		samples,
		terminationReason,
	});
};
