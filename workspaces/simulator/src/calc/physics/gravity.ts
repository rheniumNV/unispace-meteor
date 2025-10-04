/**
 * 重力計算
 */

import { R } from "@mobily/ts-belt";
import { EARTH_MU_M3_S2 } from "../../types/constants";
import type { Vec3 } from "../../types/input";
import * as Vec from "../coordinates/vector";

/**
 * 重力加速度ベクトルを計算
 * g = -μ * r / ||r||³
 *
 * @param r_ecef ECEF座標 [m]
 * @returns 重力加速度ベクトル [m/s²]
 */
export const gravityAcceleration = (r_ecef: Vec3): R.Result<Vec3, Error> => {
	const r_mag = Vec.magnitude(r_ecef);

	if (r_mag === 0) {
		return R.Error(new Error("位置ベクトルの大きさがゼロです"));
	}

	const factor = -EARTH_MU_M3_S2 / (r_mag * r_mag * r_mag);
	const g = Vec.scale(r_ecef, factor);

	return R.Ok(g);
};
