/**
 * シミュレーション出力結果の型定義
 */

import type { Vec3 } from "./input";

/** 軌道上の1点のデータ */
export interface TrajectoryPoint {
	/** 経過時間 [s] (t0からの相対時間) */
	readonly t: number;
	/** ECEF座標 [m] */
	readonly r_ecef: Vec3;
	/** ECEF速度 [m/s] */
	readonly v_ecef: Vec3;
	/** 質量 [kg] */
	readonly mass_kg: number;
	/** 高度 [m] */
	readonly alt_m: number;
	/** 緯度 [度] */
	readonly lat: number;
	/** 経度 [度] */
	readonly lon: number;
}

/** エネルギー情報 */
export interface EnergyInfo {
	/** エネルギー [J] */
	readonly joule: number;
	/** TNT換算 [Mt] */
	readonly mt_tnt: number;
}

/** 空中爆発情報 */
export type AirburstInfo =
	| {
			/** 発生したか */
			readonly isOccurrence: true;
			/** 爆発高度 [m] */
			readonly burst_altitude_m: number;
			/** 爆発時のエネルギー [J] */
			readonly burst_energy_joule: number;
	  }
	| {
			readonly isOccurrence: false;
	  };

/** クレーター情報 */
export type CraterInfo =
	| {
			/** クレーターが形成されるか */
			readonly hasCrater: true;
			/** 一時クレーター直径 [m] */
			readonly transient_diameter_m: number;
			/** 最終クレーター直径 [m] */
			readonly final_diameter_m: number;
			/** 深さ [m] */
			readonly depth_m: number;
	  }
	| {
			readonly hasCrater: false;
	  };

/** 爆風影響情報 */
export interface BlastInfo {
	/** 各過圧しきい値での被害半径 [km] */
	readonly damage_radii_km: Record<string, number>;
}

/** 地震情報 */
export interface SeismicInfo {
	/** モーメントマグニチュード */
	readonly moment_magnitude_M: number;
}

/** シミュレーション結果全体 */
export interface SimulationResult {
	/** 弾道データ */
	readonly trajectory: readonly TrajectoryPoint[];
	/** 終了理由 */
	readonly terminationReason: "ground" | "breakup" | "burnout" | "max_time" | "escape";
	/** 衝突までの時間 [s] */
	readonly time_to_impact_s: number;
	/** エネルギー情報 */
	readonly energy: EnergyInfo;
	/** 空中爆発情報（発生した場合） */
	readonly airburst: AirburstInfo;
	/** クレーター情報（地表衝突の場合） */
	readonly crater: CraterInfo;
	/** 爆風影響範囲 */
	readonly blast: BlastInfo;
	/** 地震規模 */
	readonly seismic: SeismicInfo;
}
