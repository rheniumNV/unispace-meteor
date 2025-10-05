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
 * @param terminationReason シミュレーション終了理由
 * @param strength_mpa 強度 [MPa]
 * @returns 空中爆発情報（なければNone）
 */
export const detectAirburst = (
	samples: readonly TrajectoryPoint[],
	terminationReason: "ground" | "breakup" | "burnout" | "max_time" | "escape",
	_strength_mpa: number,
): R.Result<AirburstInfo, Error> => {
	if (A.isEmpty(samples)) {
		return R.Error(new Error("軌道サンプルが空です"));
	}

	// 最後のサンプル点を確認
	const lastSample = A.last(samples);
	if (lastSample === undefined || lastSample === null) {
		return R.Error(new Error("軌道サンプルが空です"));
	}

	// 空中爆発は breakup の場合のみ発生
	// escape, burnout, ground, max_time の場合は空中爆発なし
	if (terminationReason !== "breakup") {
		return R.Ok({
			isOccurrence: false,
		});
	}

	// breakup の場合：動圧が強度を超えて破砕した場合
	// 爆発高度 = 最後のサンプルの高度
	const burst_altitude_m = lastSample.alt_m;

	// 爆発時の運動エネルギー E = (1/2) * m * v²
	const v_mag = Vec.magnitude(lastSample.v_ecef);
	const burst_energy_joule = 0.5 * lastSample.mass_kg * v_mag * v_mag;

	return R.Ok({
		isOccurrence: true,
		burst_altitude_m,
		burst_energy_joule,
	});
};
