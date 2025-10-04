/**
 * 空中爆発の検出
 */

import { A, R } from "@mobily/ts-belt";
import type { AirburstInfo, TrajectoryPoint } from "../../types/output";
import * as Vec from "../coordinates/vector";

/**
 * 軌道データから空中爆発を検出
 *
 * @param samples 軌道サンプル点
 * @param strength_mpa 強度 [MPa]
 * @returns 空中爆発情報（なければnull）
 */
export const detectAirburst = (
	samples: readonly TrajectoryPoint[],
	_strength_mpa: number,
): R.Result<AirburstInfo | null, Error> => {
	if (A.isEmpty(samples)) {
		return R.Error(new Error("軌道サンプルが空です"));
	}

	// 最後のサンプル点を確認
	const lastSample = A.last(samples);
	if (lastSample === undefined) {
		return R.Error(new Error("軌道サンプルが空です"));
	}

	// 地表到達（高度0以下）の場合は空中爆発なし
	if (lastSample.alt_m <= 0) {
		return R.Ok(null);
	}

	// 空中で停止した場合は空中爆発と判定
	// 爆発高度 = 最後のサンプルの高度
	const burst_altitude_m = lastSample.alt_m;

	// 爆発時の運動エネルギー E = (1/2) * m * v²
	// 質量は軌道データから直接取得できないので、
	// ここでは速度ベクトルから運動エネルギーを推定
	// （完全な実装では質量情報も軌道データに含めるべき）
	const v_mag = Vec.magnitude(lastSample.v_ecef);

	// 暫定的に、動的圧力から推定したエネルギーを返す
	// より正確には質量情報が必要
	const burst_energy_joule = v_mag * v_mag * 1000; // 仮の計算

	return R.Ok({
		burst_altitude_m,
		burst_energy_joule,
	});
};
