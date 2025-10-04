/**
 * 抗力計算
 */

import { R } from "@mobily/ts-belt";
import type { Vec3 } from "../../types/input";
import * as Vec from "../coordinates/vector";

/**
 * 抗力加速度ベクトルを計算
 * F_drag = -(Cd * A * ρ / 2m) * ||v_rel|| * v_rel
 *
 * @param v_rel 相対速度ベクトル [m/s]
 * @param rho 大気密度 [kg/m³]
 * @param Cd 抗力係数
 * @param area_m2 断面積 [m²]
 * @param mass_kg 質量 [kg]
 * @returns 抗力加速度ベクトル [m/s²]
 */
export const dragAcceleration = (
	v_rel: Vec3,
	rho: number,
	Cd: number,
	area_m2: number,
	mass_kg: number,
): R.Result<Vec3, Error> => {
	if (mass_kg <= 0) {
		return R.Error(new Error("質量は正の値である必要があります"));
	}

	if (rho < 0) {
		return R.Error(new Error("大気密度は非負である必要があります"));
	}

	if (area_m2 < 0) {
		return R.Error(new Error("断面積は非負である必要があります"));
	}

	const v_mag = Vec.magnitude(v_rel);

	// 速度がゼロの場合は抗力もゼロ
	if (v_mag === 0) {
		return R.Ok([0, 0, 0]);
	}

	const factor = -(Cd * area_m2 * rho * v_mag) / (2 * mass_kg);
	const drag = Vec.scale(v_rel, factor);

	return R.Ok(drag);
};

/**
 * 動圧を計算
 * q = ρ * v² / 2
 *
 * @param v_rel_mag 相対速度の大きさ [m/s]
 * @param rho 大気密度 [kg/m³]
 * @returns 動圧 [Pa]
 */
export const dynamicPressure = (v_rel_mag: number, rho: number): R.Result<number, Error> => {
	if (rho < 0) {
		return R.Error(new Error("大気密度は非負である必要があります"));
	}

	if (v_rel_mag < 0) {
		return R.Error(new Error("速度の大きさは非負である必要があります"));
	}

	const q = (rho * v_rel_mag * v_rel_mag) / 2;

	return R.Ok(q);
};
