/**
 * ECEF座標系関連の関数
 */

import { R } from "@mobily/ts-belt";
import { EARTH_RADIUS_M } from "../../types/constants";
import type { Vec3 } from "../../types/input";
import type { GeodeticCoord } from "../../types/state";
import * as Vec from "./vector";

/**
 * ECEF座標から地理座標（緯度経度高度）への変換
 * 球近似を使用
 */
export const ecefToGeodetic = (r_ecef: Vec3): R.Result<GeodeticCoord, Error> => {
	const [x, y, z] = r_ecef;
	const r = Vec.magnitude(r_ecef);

	if (r === 0) {
		return R.Error(new Error("ECEF座標の大きさがゼロです"));
	}

	// 緯度（球近似）
	const lat = Math.asin(z / r);

	// 経度
	const lon = Math.atan2(y, x);

	// 高度
	const alt_m = r - EARTH_RADIUS_M;

	return R.Ok({
		lat,
		lon,
		alt_m,
	});
};

/**
 * 地理座標からECEF座標への変換
 * 球近似を使用
 */
export const geodeticToEcef = (coord: GeodeticCoord): R.Result<Vec3, Error> => {
	const { lat, lon, alt_m } = coord;

	const r = EARTH_RADIUS_M + alt_m;

	const x = r * Math.cos(lat) * Math.cos(lon);
	const y = r * Math.cos(lat) * Math.sin(lon);
	const z = r * Math.sin(lat);

	return R.Ok([x, y, z]);
};
