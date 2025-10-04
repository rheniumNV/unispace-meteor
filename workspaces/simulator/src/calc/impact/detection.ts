/**
 * 衝突検出
 */

import { A, R } from "@mobily/ts-belt";
import type { Vec3 } from "../../types/input";
import type { TrajectoryPoint } from "../../types/output";

/** 衝突状態 */
export type ImpactState =
	| {
			/** 衝突したか */
			readonly impacted: true;
			/** 衝突時刻 [s] */
			readonly t: number;
			/** 衝突位置 ECEF [m] */
			readonly r_ecef: Vec3;
			/** 衝突速度 ECEF [m/s] */
			readonly v_ecef: Vec3;
			/** 緯度 [度] */
			readonly lat: number;
			/** 経度 [度] */
			readonly lon: number;
	  }
	| {
			/** 衝突したか */
			readonly impacted: false;
	  };

/**
 * 軌道データから衝突を検出
 *
 * @param samples 軌道サンプル点
 * @returns 衝突状態
 */
export const detectImpact = (samples: readonly TrajectoryPoint[]): R.Result<ImpactState, Error> => {
	if (A.isEmpty(samples)) {
		return R.Error(new Error("軌道サンプルが空です"));
	}

	const lastSample = A.last(samples);
	if (lastSample === undefined || lastSample === null) {
		return R.Error(new Error("軌道サンプルが空です"));
	}

	// 高度が0以下なら衝突
	if (lastSample.alt_m <= 0) {
		return R.Ok({
			impacted: true,
			t: lastSample.t,
			r_ecef: lastSample.r_ecef,
			v_ecef: lastSample.v_ecef,
			lat: lastSample.lat,
			lon: lastSample.lon,
		});
	}

	// 衝突していない
	return R.Ok({ impacted: false });
};
