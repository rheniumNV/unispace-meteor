/**
 * シミュレーション入力パラメータの型定義
 */

/** 3次元ベクトル [x, y, z] */
export type Vec3 = readonly [number, number, number];

/** 発見時点の情報 */
export interface DiscoveryInput {
	/** 発見時刻（UTC） */
	readonly t0: Date;
	/** 発見時のECEF座標 [m] */
	readonly r0_ecef: Vec3;
	/** 速度ベクトル ECEF [m/s] */
	readonly velocity_ecef: Vec3;
}

/** 隕石の物性 */
export interface MeteoroidProperties {
	/** 直径 [m] */
	readonly diameter_m: number;
	/** 質量 [kg] */
	readonly mass_kg: number;
	/** 強度 [MPa] (省略可、デフォルト: 5 MPa) */
	readonly strength_mpa?: number;
}

/** 環境パラメータ */
export interface EnvironmentParams {
	/** 地表タイプ */
	readonly surface: "land" | "water";
	/** 海面大気密度 [kg/m³] */
	readonly rho0_kg_m3?: number;
	/** 大気スケールハイト [m] */
	readonly scale_height_m?: number;
	/** 重力加速度 [m/s²] */
	readonly gravity_m_s2?: number;
}

/** モデルパラメータ */
export interface ModelParams {
	/** 抗力係数 */
	readonly drag_coefficient?: number;
	/** アブレーション係数 [s²/km²] (省略可) */
	readonly ablation_coeff?: number;
	/** 地震効率 */
	readonly seismic_efficiency?: number;
	/** 爆風過圧しきい値 [kPa] */
	readonly blast_thresholds_kpa?: readonly number[];
	/** タイムステップ [s] */
	readonly time_step_s?: number;
	/** 最大シミュレーション時間 [s] */
	readonly max_time_s?: number;
}

/** シミュレーション入力全体 */
export interface SimulationInput {
	/** 発見時点の情報 */
	readonly discovery: DiscoveryInput;
	/** 隕石の物性 */
	readonly meteoroid: MeteoroidProperties;
	/** 環境パラメータ */
	readonly environment: EnvironmentParams;
	/** モデルパラメータ */
	readonly model?: ModelParams;
}
