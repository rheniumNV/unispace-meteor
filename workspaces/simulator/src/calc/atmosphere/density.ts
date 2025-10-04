/**
 * 大気密度モデル
 */

import { R } from "@mobily/ts-belt";

/**
 * 指数減衰モデルによる大気密度計算
 * ρ(h) = ρ0 * exp(-h/H)
 *
 * @param altitude_m 高度 [m]
 * @param rho0_kg_m3 海面大気密度 [kg/m³]
 * @param scale_height_m スケールハイト [m]
 * @returns 大気密度 [kg/m³]
 */
export const atmosphericDensity = (
	altitude_m: number,
	rho0_kg_m3: number,
	scale_height_m: number,
): R.Result<number, Error> => {
	if (rho0_kg_m3 < 0) {
		return R.Error(new Error("海面大気密度は正の値である必要があります"));
	}

	if (scale_height_m <= 0) {
		return R.Error(new Error("スケールハイトは正の値である必要があります"));
	}

	// 高度が負の場合は海面密度を返す
	if (altitude_m < 0) {
		return R.Ok(rho0_kg_m3);
	}

	const rho = rho0_kg_m3 * Math.exp(-altitude_m / scale_height_m);

	return R.Ok(rho);
};
