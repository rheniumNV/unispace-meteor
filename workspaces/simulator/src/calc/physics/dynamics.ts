/**
 * 運動方程式の統合
 */

import { R } from "@mobily/ts-belt";
import type { DynamicState, DynamicStateDerivative, SimulationParams } from "../../types/state";
import * as Atmos from "../atmosphere/density";
import * as Coord from "../coordinates/ecef";
import * as Vec from "../coordinates/vector";
import * as Drag from "./drag";
import * as Grav from "./gravity";

/**
 * 運動方程式の右辺を計算
 * d/dt(r, v, m) を返す
 *
 * @param t 時刻 [s]
 * @param state 現在の状態
 * @param params シミュレーションパラメータ
 * @returns 状態の時間微分
 */
export const rhsState = (
	_t: number,
	state: DynamicState,
	params: SimulationParams,
): R.Result<DynamicStateDerivative, Error> => {
	const { r, v, m } = state;
	const { Cd, area_m2, rho0_kg_m3, scale_height_m, ablation_coeff } = params;

	// 高度を取得
	const geodResult = Coord.ecefToGeodetic(r);
	if (R.isError(geodResult)) {
		return geodResult;
	}
	const geod = R.getExn(geodResult);
	const { alt_m } = geod;

	// 大気密度
	const rhoResult = Atmos.atmosphericDensity(alt_m, rho0_kg_m3, scale_height_m);
	if (R.isError(rhoResult)) {
		return rhoResult;
	}
	const rho = R.getExn(rhoResult);

	// 相対速度（大気との相対速度、地球自転を考慮）
	// v_rel = v - Ω × r
	const omega_vector: [number, number, number] = [0, 0, 7.2921159e-5];
	const omega_cross_r = Vec.cross(omega_vector, r);
	const v_rel = Vec.subtract(v, omega_cross_r);
	const v_rel_mag = Vec.magnitude(v_rel);

	// 各加速度成分を計算
	const gravResult = Grav.gravityAcceleration(r);
	if (R.isError(gravResult)) {
		return gravResult;
	}
	const a_grav = R.getExn(gravResult);

	const dragResult = Drag.dragAcceleration(v_rel, rho, Cd, area_m2, m);
	if (R.isError(dragResult)) {
		return dragResult;
	}
	const a_drag = R.getExn(dragResult);

	// 全加速度（コリオリ力・遠心力は宇宙空間では過剰なので除外）
	const a_total = Vec.add(a_grav, a_drag);

	// 質量変化率（アブレーション）
	// dm/dt = -σ * A * ρ * v³ / 2 (σはアブレーション係数)
	let dm_dt = 0;
	if (ablation_coeff !== undefined && rho > 0 && v_rel_mag > 0) {
		dm_dt = -(ablation_coeff * area_m2 * rho * v_rel_mag * v_rel_mag * v_rel_mag) / 2;
		// 質量が負にならないようにする
		if (m + dm_dt * 0.01 < 0) {
			dm_dt = 0;
		}
	}

	return R.Ok({
		dr_dt: v,
		dv_dt: a_total,
		dm_dt,
	});
};
