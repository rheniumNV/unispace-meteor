/**
 * Runge-Kutta法による数値積分
 */

import { R } from "@mobily/ts-belt";
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
	readonly terminationReason: "ground" | "breakup" | "burnout" | "max_time";
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
	dt = 60 * 60, // 1時間 = 3,600秒
	max_time = 60 * 60 * 24 * 30 * 3, // 30日 = 2,592,000秒
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

	let terminationReason: "ground" | "breakup" | "burnout" | "max_time" = "max_time";

	// 質量が初期質量の1%未満になったら燃え尽きたと判定
	const burnout_threshold = m0 * 0.01;

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

		const v_mag = Vec.magnitude(state.v);
		const qResult = Drag.dynamicPressure(v_mag, rho);
		if (R.isError(qResult)) {
			return qResult;
		}
		const q = R.getExn(qResult);

		if (q >= params.strength_pa) {
			terminationReason = "breakup";
		}

		// サンプル点を追加
		samples.push({
			t,
			r_ecef: state.r,
			v_ecef: state.v,
			mass_kg: state.m,
			alt_m: geod.alt_m,
			lat: (geod.lat * 180) / Math.PI,
			lon: (geod.lon * 180) / Math.PI,
		});

		// 地表到達判定
		if (geod.alt_m <= 0) {
			terminationReason = "ground";
			break;
		}

		// 破砕で停止
		if (terminationReason === "breakup") {
			break;
		}

		// 燃え尽き判定
		if (state.m < burnout_threshold) {
			terminationReason = "burnout";
			break;
		}
	}

	return R.Ok({
		samples,
		terminationReason,
	});
};
