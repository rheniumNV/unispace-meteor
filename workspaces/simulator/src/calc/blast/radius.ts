/**
 * 爆風影響半径の計算
 * Glasstone & Dolan の核爆風スケーリング則を使用
 */

import { R } from "@mobily/ts-belt";
import { MEGATON_TNT_JOULE } from "../../types/constants";

/** 過圧-スケールド距離の関係データ（経験式の近似点） */
const OVERPRESSURE_SCALING_DATA: ReadonlyArray<{ z: number; p_kpa: number }> = [
	{ z: 0.05, p_kpa: 200 },
	{ z: 0.1, p_kpa: 100 },
	{ z: 0.15, p_kpa: 60 },
	{ z: 0.2, p_kpa: 40 },
	{ z: 0.3, p_kpa: 20 },
	{ z: 0.4, p_kpa: 10 },
	{ z: 0.6, p_kpa: 5 },
	{ z: 0.8, p_kpa: 3.5 },
	{ z: 1.0, p_kpa: 2.5 },
	{ z: 1.5, p_kpa: 1.5 },
	{ z: 2.0, p_kpa: 1.0 },
	{ z: 3.0, p_kpa: 0.5 },
	{ z: 4.0, p_kpa: 0.3 },
	{ z: 5.0, p_kpa: 0.2 },
];

/**
 * 過圧からスケールド距離を逆算（ログ補間）
 */
const overpressureToScaledDistance = (p_kpa: number): number => {
	// データ範囲外の場合は外挿
	const firstData = OVERPRESSURE_SCALING_DATA[0];
	if (firstData === undefined) {
		throw new Error("OVERPRESSURE_SCALING_DATA is empty");
	}
	if (p_kpa >= firstData.p_kpa) {
		return firstData.z;
	}
	const lastData = OVERPRESSURE_SCALING_DATA[OVERPRESSURE_SCALING_DATA.length - 1];
	if (lastData === undefined) {
		throw new Error("OVERPRESSURE_SCALING_DATA is empty");
	}
	if (p_kpa <= lastData.p_kpa) {
		return lastData.z;
	}

	// ログ補間で逆算
	for (let i = 0; i < OVERPRESSURE_SCALING_DATA.length - 1; i++) {
		const data1 = OVERPRESSURE_SCALING_DATA[i];
		const data2 = OVERPRESSURE_SCALING_DATA[i + 1];
		if (data1 === undefined || data2 === undefined) {
			continue;
		}

		const p1 = data1.p_kpa;
		const p2 = data2.p_kpa;

		if (p_kpa <= p1 && p_kpa >= p2) {
			const z1 = data1.z;
			const z2 = data2.z;

			// ログスケールで補間
			const log_p = Math.log(p_kpa);
			const log_p1 = Math.log(p1);
			const log_p2 = Math.log(p2);

			const t = (log_p - log_p1) / (log_p2 - log_p1);
			return z1 + t * (z2 - z1);
		}
	}

	// 見つからない場合は最も近い値を返す
	return firstData.z;
};

/**
 * 爆風影響半径を計算
 *
 * スケーリング則: Z = R / W^(1/3)
 * Z: スケールド距離 [m/kt^(1/3)]
 * R: 距離 [m]
 * W: 爆発エネルギー [kt TNT]
 *
 * @param energy_joule エネルギー [J]
 * @param overpressure_kpa 過圧しきい値 [kPa]
 * @param burst_altitude_m 爆発高度 [m] (省略時は0、地表)
 * @returns 影響半径 [km]
 */
export const calculateBlastRadius = (
	energy_joule: number,
	overpressure_kpa: number,
	burst_altitude_m = 0,
): R.Result<number, Error> => {
	if (energy_joule <= 0) {
		return R.Error(new Error("エネルギーは正の値である必要があります"));
	}

	if (overpressure_kpa <= 0) {
		return R.Error(new Error("過圧は正の値である必要があります"));
	}

	// エネルギーをメガトンTNTに変換
	const W_mt = energy_joule / MEGATON_TNT_JOULE;

	// キロトンに変換
	const W_kt = W_mt * 1000;

	// 過圧からスケールド距離を取得
	const Z = overpressureToScaledDistance(overpressure_kpa);

	// 距離を計算: R = Z * W^(1/3)
	const R_m = Z * W_kt ** (1 / 3) * 1000; // Z は m/kt^(1/3) 単位なので1000倍

	// 空中爆発の場合、地表での影響半径を計算
	// 簡易的に、爆発高度を考慮した地表距離を計算
	let ground_radius_m = R_m;
	if (burst_altitude_m > 0) {
		// ピタゴラスの定理: ground_radius = sqrt(R² - h²)
		const R_sq = R_m * R_m;
		const h_sq = burst_altitude_m * burst_altitude_m;
		if (R_sq > h_sq) {
			ground_radius_m = Math.sqrt(R_sq - h_sq);
		} else {
			ground_radius_m = 0;
		}
	}

	// kmに変換
	const radius_km = ground_radius_m / 1000;

	return R.Ok(radius_km);
};

/**
 * 複数の過圧しきい値に対する影響半径を計算
 *
 * @param energy_joule エネルギー [J]
 * @param thresholds_kpa 過圧しきい値の配列 [kPa]
 * @param burst_altitude_m 爆発高度 [m]
 * @returns 各しきい値での影響半径 [km]
 */
export const calculateBlastRadii = (
	energy_joule: number,
	thresholds_kpa: readonly number[],
	burst_altitude_m = 0,
): R.Result<Record<string, number>, Error> => {
	const radii: Record<string, number> = {};

	for (const threshold of thresholds_kpa) {
		const radiusResult = calculateBlastRadius(energy_joule, threshold, burst_altitude_m);
		if (R.isError(radiusResult)) {
			return radiusResult;
		}
		radii[`${threshold}kPa`] = R.getExn(radiusResult);
	}

	return R.Ok(radii);
};
