/**
 * @unispace-meteor/data-client
 * 外部データ取得・変換ライブラリ
 */

export type {
	DiscoveryInput,
	EnvironmentParams,
	MeteoroidProperties,
	ModelParams,
	SimulationInput,
	Vec3,
} from "../../simulator/src/types/input";
// APIクライアントのエクスポート
export { fetchCloseApproaches } from "./api/cad-client";
// 変換関数のエクスポート
export {
	convertMultipleToSimulationInput,
	convertToSimulationInput,
} from "./converters/cad-to-simulation";
// 型のエクスポート
export type {
	CADQueryParams,
	CADResponse,
	CloseApproachData,
} from "./types/cad-api";

import type { SimulationInput } from "../../simulator/src/types/input";
// 便利関数
import { fetchCloseApproaches } from "./api/cad-client";
import { convertMultipleToSimulationInput } from "./converters/cad-to-simulation";
import type { CADQueryParams } from "./types/cad-api";

/**
 * 地球に接近する小惑星データを取得して、シミュレーション入力に変換
 *
 * @param params CAD APIクエリパラメータ（デフォルト: neo=true, body="Earth", distMax=0.05, fullname=true）
 * @param densityKgM3 隕石の密度（デフォルト: 2500 kg/m³）
 * @param albedo アルベド（直径が不明な場合に使用、デフォルト: 0.14）
 * @returns 小惑星名とシミュレーション入力のリスト
 *
 * @example
 * ```typescript
 * import { fetchAndConvertCloseApproaches } from '@unispace-meteor/data-client';
 *
 * const result = await fetchAndConvertCloseApproaches();
 * for (const { name, input } of result) {
 *   console.log(`${name}:`, input);
 * }
 * ```
 */
export const fetchAndConvertCloseApproaches = async (
	params: CADQueryParams = {},
	densityKgM3: number = 2500,
	albedo: number = 0.14,
): Promise<{ name: string; input: SimulationInput }[]> => {
	// CAD APIからデータを取得
	const data = await fetchCloseApproaches(params);

	// シミュレーション入力に変換
	return convertMultipleToSimulationInput(data, densityKgM3, albedo);
};
