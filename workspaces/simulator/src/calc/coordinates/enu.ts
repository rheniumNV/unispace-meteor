/**
 * ENU座標系関連の関数
 */

import { R } from "@mobily/ts-belt";
import type { Vec3 } from "../../types/input";

/** ENU基底ベクトル */
export interface EnuBasis {
	/** 東方向単位ベクトル */
	readonly E: Vec3;
	/** 北方向単位ベクトル */
	readonly N: Vec3;
	/** 上方向単位ベクトル */
	readonly U: Vec3;
}

/**
 * 緯度経度からENU基底ベクトルを生成
 * @param lat 緯度 [rad]
 * @param lon 経度 [rad]
 */
export const enuBasisAt = (lat: number, lon: number): R.Result<EnuBasis, Error> => {
	// East: [-sin(lon), cos(lon), 0]
	const E: Vec3 = [-Math.sin(lon), Math.cos(lon), 0];

	// North: [-sin(lat)*cos(lon), -sin(lat)*sin(lon), cos(lat)]
	const N: Vec3 = [-Math.sin(lat) * Math.cos(lon), -Math.sin(lat) * Math.sin(lon), Math.cos(lat)];

	// Up: [cos(lat)*cos(lon), cos(lat)*sin(lon), sin(lat)]
	const U: Vec3 = [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];

	return R.Ok({ E, N, U });
};

/**
 * 方位角と入射角からECEF速度ベクトルを生成
 * @param v0_mag 速度の大きさ [m/s]
 * @param azimuth_deg 方位角 [度] (北から時計回り)
 * @param entry_angle_deg 入射角 [度] (水平面からの角度、下向きが正)
 * @param basis ENU基底ベクトル
 */
export const velocityFromAzimuthEntry = (
	v0_mag: number,
	azimuth_deg: number,
	entry_angle_deg: number,
	basis: EnuBasis,
): R.Result<Vec3, Error> => {
	if (v0_mag < 0) {
		return R.Error(new Error("速度の大きさは正の値である必要があります"));
	}

	// 度をラジアンに変換
	const az_rad = (azimuth_deg * Math.PI) / 180;
	const gamma_rad = (entry_angle_deg * Math.PI) / 180;

	// ENU座標系での速度成分
	// 水平成分
	const v_horizontal = v0_mag * Math.cos(gamma_rad);
	const v_east = v_horizontal * Math.sin(az_rad);
	const v_north = v_horizontal * Math.cos(az_rad);

	// 鉛直成分（下向きが正なので符号に注意）
	const v_down = -v0_mag * Math.sin(gamma_rad);

	// ECEF座標系に変換
	const { E, N, U } = basis;
	const v_ecef: Vec3 = [
		v_east * E[0] + v_north * N[0] + v_down * U[0],
		v_east * E[1] + v_north * N[1] + v_down * U[1],
		v_east * E[2] + v_north * N[2] + v_down * U[2],
	];

	return R.Ok(v_ecef);
};
