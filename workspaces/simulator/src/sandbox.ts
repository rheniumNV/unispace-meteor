import { R } from "@mobily/ts-belt";
import { simulateMeteorImpact } from "./simulation";
import type { SimulationInput } from "./types/input";

// const r0_ecef: Vec3 = [EARTH_RADIUS_M + 10000, 0, 0]; // 上空10km
// const velocity_ecef: Vec3 = [-10606.6, 0, 10606.6];
// const input: SimulationInput = {
// 	discovery: {
// 		t0: new Date("2024-01-01T00:00:00Z"),
// 		r0_ecef,
// 		velocity_ecef,
// 	},
// 	meteoroid: {
// 		diameter_m: 1, // 1m径
// 		density_kg_m3: 3000,
// 		strength_mpa: 5,
// 	},
// 	environment: {
// 		surface: "land",
// 	},
// };

// const input: SimulationInput = {
// 	discovery: {
// 		t0: new Date("2025-10-04T12:01:39.570Z"),
// 		r0_ecef: [20000000, 0, 0],
// 		velocity_ecef: [-53626.920000000006, -20375.442999999996, 43964.434],
// 	},
// 	meteoroid: {
// 		diameter_m: 2,
// 		density_kg_m3: 4,
// 		strength_mpa: 100,
// 	},
// 	environment: {
// 		surface: "land",
// 	},
// 	model: {
// 		time_step_s: 60,
// 	},
// };

const input: SimulationInput = {
	discovery: {
		// ハッカソン本番日の例
		t0: new Date("2025-10-04T00:00:00Z"),

		// 初期位置: ECEF（半径 15,000 km、緯度 ~20°, 経度 ~150° 相当）
		// r = [x, y, z] [m]
		r0_ecef: [
			-12_206_965, // x [m]
			+7_048_123, // y [m]
			+5_130_302, // z [m]
		],

		// 初期速度: 地球向きに約1.5 km/s（衝突確実）
		velocity_ecef: [
			+800, // vx [m/s]
			+1200, // vy [m/s]
			-200, // vz [m/s]
		],
	},

	meteoroid: {
		// 大型隕石（大クレーター狙い）
		diameter_m: 250, // 直径 [m]
		density_kg_m3: 3500, // 密度 [kg/m^3]（stony-iron想定：岩石より重い）
		strength_mpa: 50, // 強度 [MPa]（空中破砕を抑えて地表まで持たせる）
	},

	environment: {
		surface: "land", // 陸上インパクトを想定（大クレーター化を確実に）
		rho0_kg_m3: 1.225, // 海面大気密度 [kg/m^3]
		scale_height_m: 8000, // 大気スケールハイト [m]
		gravity_m_s2: 9.80665, // g [m/s^2]
	},

	model: {
		drag_coefficient: 1.0, // Cd ~1（鈍頭体の近似）
		// ablation_coeff は簡略化のため未設定（=アブレーション無効/弱め）
		seismic_efficiency: 0.001, // 地震効率 ~10^-3
		blast_thresholds_kpa: [1, 3.5, 10, 20], // 可視化用の典型しきい値
		time_step_s: 1, // 1秒刻み（最高精度でテスト）
		max_time_s: 60 * 60 * 24 * 10, // 10日間でテスト
	},
};

const result = simulateMeteorImpact(input);
console.log(R.getExn(result));
