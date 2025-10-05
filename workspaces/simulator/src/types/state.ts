/**
 * シミュレーション内部状態の型定義
 */

import type { Vec3 } from "./input";

/** 運動状態（位置・速度・質量） */
export interface DynamicState {
	/** 位置 ECEF [m] */
	readonly r: Vec3;
	/** 速度 ECEF [m/s] */
	readonly v: Vec3;
	/** 質量 [kg] */
	readonly m: number;
}

/** 運動状態の時間微分 */
export interface DynamicStateDerivative {
	/** 速度 dr/dt [m/s] */
	readonly dr_dt: Vec3;
	/** 加速度 dv/dt [m/s²] */
	readonly dv_dt: Vec3;
	/** 質量変化率 dm/dt [kg/s] */
	readonly dm_dt: number;
}

/** シミュレーションパラメータ（内部計算用） */
export interface SimulationParams {
	/** 抗力係数 */
	readonly Cd: number;
	/** 断面積 [m²] */
	readonly area_m2: number;
	/** 海面大気密度 [kg/m³] */
	readonly rho0_kg_m3: number;
	/** スケールハイト [m] */
	readonly scale_height_m: number;
	/** 重力加速度 [m/s²] */
	readonly gravity_m_s2: number;
	/** アブレーション係数（省略可） */
	readonly ablation_coeff?: number;
	/** 強度 [Pa] */
	readonly strength_pa: number;
	/** 地表タイプ */
	readonly surface: "land" | "water";
	/** 隕石密度 [kg/m³] */
	readonly density_kg_m3: number;
	/** 地震効率 */
	readonly seismic_efficiency: number;
	/** 爆風しきい値 [kPa] */
	readonly blast_thresholds_kpa: readonly number[];
	/** escape検出後の継続時間 [s] */
	readonly escape_continue_time_s: number;
}

/** 地理座標 */
export interface GeodeticCoord {
	/** 緯度 [rad] */
	readonly lat: number;
	/** 経度 [rad] */
	readonly lon: number;
	/** 高度 [m] */
	readonly alt_m: number;
}
