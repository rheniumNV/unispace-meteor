/**
 * コリオリ力と遠心力の計算
 */

import { R } from "@mobily/ts-belt";
import { EARTH_ROTATION_RAD_S } from "../../types/constants";
import type { Vec3 } from "../../types/input";
import * as Vec from "../coordinates/vector";

/** 地球の自転角速度ベクトル（Z軸方向） */
const OMEGA_VECTOR: Vec3 = [0, 0, EARTH_ROTATION_RAD_S];

/**
 * コリオリ加速度を計算
 * a_coriolis = -2Ω × v
 *
 * @param v_ecef ECEF座標系での速度ベクトル [m/s]
 * @returns コリオリ加速度ベクトル [m/s²]
 */
export const coriolisAcceleration = (v_ecef: Vec3): R.Result<Vec3, Error> => {
	const omega_cross_v = Vec.cross(OMEGA_VECTOR, v_ecef);
	const a_coriolis = Vec.scale(omega_cross_v, -2);

	return R.Ok(a_coriolis);
};

/**
 * 遠心加速度を計算
 * a_centrifugal = -Ω × (Ω × r)
 *
 * @param r_ecef ECEF座標 [m]
 * @returns 遠心加速度ベクトル [m/s²]
 */
export const centrifugalAcceleration = (r_ecef: Vec3): R.Result<Vec3, Error> => {
	const omega_cross_r = Vec.cross(OMEGA_VECTOR, r_ecef);
	const omega_cross_omega_cross_r = Vec.cross(OMEGA_VECTOR, omega_cross_r);
	const a_centrifugal = Vec.scale(omega_cross_omega_cross_r, -1);

	return R.Ok(a_centrifugal);
};
