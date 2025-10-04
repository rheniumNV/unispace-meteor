/**
 * 地震規模の計算
 */

import { R } from "@mobily/ts-belt";

/**
 * モーメントマグニチュードを計算
 *
 * 地震エネルギー: E_s = η * E (ηは地震効率)
 * モーメントマグニチュード: M_w ≈ (2/3) * log10(E_s) - 3.2
 *
 * @param energy_joule 衝突エネルギー [J]
 * @param seismic_efficiency 地震効率（デフォルト: 0.001）
 * @returns モーメントマグニチュード
 */
export const calculateSeismicMagnitude = (
	energy_joule: number,
	seismic_efficiency = 0.001,
): R.Result<number, Error> => {
	if (energy_joule <= 0) {
		return R.Error(new Error("エネルギーは正の値である必要があります"));
	}

	if (seismic_efficiency <= 0 || seismic_efficiency > 1) {
		return R.Error(new Error("地震効率は0より大きく1以下である必要があります"));
	}

	// 地震エネルギー
	const E_seismic = seismic_efficiency * energy_joule;

	// モーメントマグニチュード
	// M_w = (2/3) * log10(E_s) - 3.2
	const M_w = (2 / 3) * Math.log10(E_seismic) - 3.2;

	return R.Ok(M_w);
};
