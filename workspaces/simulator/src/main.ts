/**
 * @unispace-meteor/simulator
 * 隕石衝突シミュレーション計算ライブラリ
 */

// ユーティリティ関数（爆風半径計算）
export { calculateBlastRadii, calculateBlastRadius } from "./calc/blast/radius";

// ユーティリティ関数（座標変換）
export { ecefToGeodetic, geodeticToEcef } from "./calc/coordinates/ecef";

// ユーティリティ関数（クレーター計算）
export { calculateCrater } from "./calc/impact/crater";
// ユーティリティ関数（地震規模計算）
export { calculateSeismicMagnitude } from "./calc/seismic/magnitude";
// メインシミュレーション関数
export { simulateMeteorImpact } from "./simulation";
// 定数のエクスポート
export {
	ATMOSPHERE_SCALE_HEIGHT_M,
	DEFAULT_BLAST_THRESHOLDS_KPA,
	DEFAULT_SEISMIC_EFFICIENCY,
	DEFAULT_STRENGTH_MPA,
	EARTH_MU_M3_S2,
	EARTH_RADIUS_M,
	EARTH_ROTATION_RAD_S,
	MEGATON_TNT_JOULE,
	SEA_LEVEL_DENSITY_KG_M3,
	STANDARD_DRAG_COEFFICIENT,
	STANDARD_GRAVITY_M_S2,
	TNT_ENERGY_J_PER_KG,
} from "./types/constants";
// 型定義のエクスポート
export type {
	DiscoveryInput,
	EnvironmentParams,
	MeteoroidProperties,
	ModelParams,
	SimulationInput,
	Vec3,
} from "./types/input";
export type {
	AirburstInfo,
	BlastInfo,
	CraterInfo,
	EnergyInfo,
	SeismicInfo,
	SimulationResult,
	TrajectoryPoint,
} from "./types/output";
export type { GeodeticCoord } from "./types/state";
