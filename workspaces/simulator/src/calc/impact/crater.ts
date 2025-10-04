/**
 * クレータースケーリング則
 * Collins, Melosh, Marcus (2005) の重力領域スケーリング則を使用
 */

import { R } from "@mobily/ts-belt";
import type { CraterInfo } from "../../types/output";

/**
 * クレーター直径と深さを計算
 *
 * スケーリング則:
 * D_tc ∝ (ρ_i/ρ_t)^(1/3) * d^0.78 * v^0.44 * g^(-0.22) * sin^(1/3)(θ)
 *
 * @param diameter_m 隕石直径 [m]
 * @param density_impactor_kg_m3 隕石密度 [kg/m³]
 * @param velocity_m_s 衝突速度 [m/s]
 * @param impact_angle_deg 衝突角度 [度] (水平面からの角度)
 * @param density_target_kg_m3 地表密度 [kg/m³]
 * @param gravity_m_s2 重力加速度 [m/s²]
 * @returns クレーター情報
 */
export const calculateCrater = (
	diameter_m: number,
	density_impactor_kg_m3: number,
	velocity_m_s: number,
	impact_angle_deg: number,
	density_target_kg_m3: number,
	gravity_m_s2: number,
): R.Result<CraterInfo, Error> => {
	if (diameter_m <= 0) {
		return R.Error(new Error("直径は正の値である必要があります"));
	}

	if (density_impactor_kg_m3 <= 0 || density_target_kg_m3 <= 0) {
		return R.Error(new Error("密度は正の値である必要があります"));
	}

	if (velocity_m_s <= 0) {
		return R.Error(new Error("速度は正の値である必要があります"));
	}

	if (gravity_m_s2 <= 0) {
		return R.Error(new Error("重力加速度は正の値である必要があります"));
	}

	// 衝突角度をラジアンに変換
	const theta_rad = (impact_angle_deg * Math.PI) / 180;
	const sin_theta = Math.sin(theta_rad);

	if (sin_theta <= 0) {
		return R.Error(new Error("衝突角度は0度より大きい必要があります"));
	}

	// 一時クレーター直径のスケーリング係数
	const K_tc = 1.16; // 経験的係数

	// D_tc = K * (ρ_i/ρ_t)^(1/3) * d^0.78 * v^0.44 * g^(-0.22) * sin^(1/3)(θ)
	const D_transient =
		K_tc *
		(density_impactor_kg_m3 / density_target_kg_m3) ** (1 / 3) *
		diameter_m ** 0.78 *
		velocity_m_s ** 0.44 *
		gravity_m_s2 ** -0.22 *
		sin_theta ** (1 / 3);

	// 最終クレーター直径（一時クレーターの約1.3倍）
	const D_final = D_transient * 1.3;

	// クレーター深さ（直径の約0.2倍）
	const depth = D_final * 0.2;

	// 小さすぎるクレーターは形成されないと判定
	// クレーター直径が隕石直径の4倍未満の場合
	if (D_final < 4 * diameter_m) {
		return R.Ok({
			hasCrater: false,
		});
	}

	return R.Ok({
		hasCrater: true,
		transient_diameter_m: D_transient,
		final_diameter_m: D_final,
		depth_m: depth,
	});
};
