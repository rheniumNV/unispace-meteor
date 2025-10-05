/**
 * 物理定数
 */

/** 地球の赤道半径 [m] */
export const EARTH_RADIUS_M = 6_371_000;

/** 地球の重力定数 μ = GM [m³/s²] */
export const EARTH_MU_M3_S2 = 3.986004418e14;

/** 地球の自転角速度 [rad/s] */
export const EARTH_ROTATION_RAD_S = 7.2921159e-5;

/** 標準重力加速度 [m/s²] */
export const STANDARD_GRAVITY_M_S2 = 9.81;

/** 海面大気密度（標準） [kg/m³] */
export const SEA_LEVEL_DENSITY_KG_M3 = 1.225;

/** 大気スケールハイト [m] */
export const ATMOSPHERE_SCALE_HEIGHT_M = 8000;

/** 標準抗力係数 */
export const STANDARD_DRAG_COEFFICIENT = 1.0;

/** 地震効率（デフォルト） */
export const DEFAULT_SEISMIC_EFFICIENCY = 0.001;

/** TNT換算係数 [J/kg] */
export const TNT_ENERGY_J_PER_KG = 4.184e6;

/** 1メガトンTNTのエネルギー [J] */
export const MEGATON_TNT_JOULE = 4.184e15;

/** デフォルトの爆風過圧しきい値 [kPa] */
export const DEFAULT_BLAST_THRESHOLDS_KPA = [1, 3.5, 10, 20] as const;

/** デフォルトの隕石強度 [MPa] (石質小惑星の典型値) */
export const DEFAULT_STRENGTH_MPA = 5;

/** escape検出後の継続時間 [s] (デフォルト: 1時間) */
export const DEFAULT_ESCAPE_CONTINUE_TIME_S = 3600;
