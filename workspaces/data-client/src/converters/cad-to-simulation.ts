/**
 * CAD APIデータからシミュレーション入力への変換
 */

import type { SimulationInput, Vec3 } from "../../../simulator/src/types/input";
import type { CloseApproachData } from "../types/cad-api";

/** 物理定数 */
const AU_TO_M = 1.496e11; // 1 AU = 1.496×10¹¹ m
const KM_TO_M = 1000; // 1 km = 1000 m
const DEFAULT_DENSITY_KG_M3 = 2500; // 石質小惑石の典型的な密度 [kg/m³]
const DEFAULT_ALBEDO = 0.14; // C型小惑星の典型的なアルベド

/**
 * H-D関係式を使って絶対等級から直径を推定
 * D(km) = 1329 / sqrt(p_v) × 10^(-0.2 × H)
 * @param absoluteMagnitude 絶対等級 [mag]
 * @param albedo アルベド（デフォルト: 0.14）
 * @returns 推定直径 [km]
 */
const estimateDiameterFromH = (
	absoluteMagnitude: number,
	albedo: number = DEFAULT_ALBEDO,
): number => {
	return (1329 / Math.sqrt(albedo)) * 10 ** (-0.2 * absoluteMagnitude);
};

/**
 * 直径と密度から質量を計算
 * @param diameterM 直径 [m]
 * @param densityKgM3 密度 [kg/m³]
 * @returns 質量 [kg]
 */
const calculateMass = (diameterM: number, densityKgM3: number = DEFAULT_DENSITY_KG_M3): number => {
	const radiusM = diameterM / 2;
	const volumeM3 = (4 / 3) * Math.PI * radiusM ** 3;
	return densityKgM3 * volumeM3;
};

/**
 * 接近距離からECEF座標を計算
 * z軸正方向（北極方向）から赤道面に向かって配置
 * @param distanceAu 接近距離 [AU]
 * @returns ECEF座標 [m]
 */
const calculatePositionEcef = (distanceAu: number): Vec3 => {
	const distanceM = distanceAu * AU_TO_M;
	return [0, 0, distanceM] as const;
};

/**
 * 位置と相対速度から速度ベクトルを計算
 * 地球中心に向かう方向と仮定
 * @param positionEcef ECEF座標 [m]
 * @param relativeVelocityKmS 相対速度 [km/s]
 * @returns 速度ベクトル ECEF [m/s]
 */
const calculateVelocityEcef = (positionEcef: Vec3, relativeVelocityKmS: number): Vec3 => {
	const relativeVelocityMS = relativeVelocityKmS * KM_TO_M;

	// 位置ベクトルの大きさ
	const [x, y, z] = positionEcef;
	const magnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

	// 地球中心に向かう単位ベクトル（位置ベクトルと逆向き）
	const unitX = -x / magnitude;
	const unitY = -y / magnitude;
	const unitZ = -z / magnitude;

	// 速度ベクトル = 単位ベクトル × 速度の大きさ
	return [
		unitX * relativeVelocityMS,
		unitY * relativeVelocityMS,
		unitZ * relativeVelocityMS,
	] as const;
};

/**
 * カレンダー日時をDateオブジェクトに変換
 * 形式: "2028-Jun-26 05:23"
 */
const parseCalendarDate = (calendarDate: string): Date => {
	// "2028-Jun-26 05:23" -> "2028 Jun 26 05:23" に変換して Date にパース
	const normalized = calendarDate.replace(/-/g, " ");
	const date = new Date(normalized);

	if (Number.isNaN(date.getTime())) {
		throw new Error(`日付のパースに失敗: ${calendarDate}`);
	}

	return date;
};

/**
 * CloseApproachDataをSimulationInputに変換
 * @param data CAD APIから取得した接近データ
 * @param densityKgM3 隕石の密度（デフォルト: 2500 kg/m³）
 * @param albedo アルベド（直径が不明な場合に使用、デフォルト: 0.14）
 * @returns SimulationInput
 */
export const convertToSimulationInput = (
	data: CloseApproachData,
	densityKgM3: number = DEFAULT_DENSITY_KG_M3,
	albedo: number = DEFAULT_ALBEDO,
): SimulationInput => {
	// 日付のパース
	const t0 = parseCalendarDate(data.calendarDate);

	// 直径の取得または推定
	const diameterKm = data.diameterKm ?? estimateDiameterFromH(data.absoluteMagnitude, albedo);
	const diameterM = diameterKm * KM_TO_M;

	// 質量の計算
	const massKg = calculateMass(diameterM, densityKgM3);

	// 座標と速度の計算
	const r0Ecef = calculatePositionEcef(data.distanceAu);
	const velocityEcef = calculateVelocityEcef(r0Ecef, data.relativeVelocityKmS);

	const input: SimulationInput = {
		discovery: {
			t0,
			r0_ecef: r0Ecef,
			velocity_ecef: velocityEcef,
		},
		meteoroid: {
			diameter_m: diameterM,
			mass_kg: massKg,
		},
		environment: {
			surface: "land", // デフォルトは陸地
		},
	};

	return input;
};

/**
 * 複数のCloseApproachDataをSimulationInputに変換
 */
export const convertMultipleToSimulationInput = (
	dataList: readonly CloseApproachData[],
	densityKgM3: number = DEFAULT_DENSITY_KG_M3,
	albedo: number = DEFAULT_ALBEDO,
): { name: string; input: SimulationInput }[] => {
	return dataList.map((data) => ({
		name: data.fullname,
		input: convertToSimulationInput(data, densityKgM3, albedo),
	}));
};
