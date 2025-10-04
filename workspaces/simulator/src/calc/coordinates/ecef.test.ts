import { R } from "@mobily/ts-belt";
import { describe, expect, it } from "vitest";
import { EARTH_RADIUS_M } from "../../types/constants";
import type { Vec3 } from "../../types/input";
import * as Coord from "./ecef";

describe("ECEF座標変換", () => {
	describe("ecefToGeodetic", () => {
		it("赤道上の点（経度0度）", () => {
			const r_ecef: Vec3 = [EARTH_RADIUS_M, 0, 0];
			const result = Coord.ecefToGeodetic(r_ecef);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const geod = R.getExn(result);
				expect(geod.lat).toBeCloseTo(0, 9);
				expect(geod.lon).toBeCloseTo(0, 9);
				expect(geod.alt_m).toBeCloseTo(0, 9);
			}
		});

		it("赤道上の点（経度90度）", () => {
			const r_ecef: Vec3 = [0, EARTH_RADIUS_M, 0];
			const result = Coord.ecefToGeodetic(r_ecef);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const geod = R.getExn(result);
				expect(geod.lat).toBeCloseTo(0, 9);
				expect(geod.lon).toBeCloseTo(Math.PI / 2, 10);
				expect(geod.alt_m).toBeCloseTo(0, 9);
			}
		});

		it("北極点", () => {
			const r_ecef: Vec3 = [0, 0, EARTH_RADIUS_M];
			const result = Coord.ecefToGeodetic(r_ecef);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const geod = R.getExn(result);
				expect(geod.lat).toBeCloseTo(Math.PI / 2, 10);
				expect(geod.alt_m).toBeCloseTo(0, 9);
			}
		});

		it("高度1000mの点", () => {
			const altitude = 1000;
			const r_ecef: Vec3 = [EARTH_RADIUS_M + altitude, 0, 0];
			const result = Coord.ecefToGeodetic(r_ecef);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const geod = R.getExn(result);
				expect(geod.alt_m).toBeCloseTo(altitude, 1);
			}
		});

		it("ゼロベクトルはエラー", () => {
			const r_ecef: Vec3 = [0, 0, 0];
			const result = Coord.ecefToGeodetic(r_ecef);

			expect(R.isError(result)).toBe(true);
		});
	});

	describe("geodeticToEcef", () => {
		it("赤道上の点（経度0度）", () => {
			const geod = { lat: 0, lon: 0, alt_m: 0 };
			const result = Coord.geodeticToEcef(geod);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const r_ecef = R.getExn(result);
				expect(r_ecef[0]).toBeCloseTo(EARTH_RADIUS_M, 1);
				expect(r_ecef[1]).toBeCloseTo(0, 9);
				expect(r_ecef[2]).toBeCloseTo(0, 9);
			}
		});

		it("赤道上の点（経度90度）", () => {
			const geod = { lat: 0, lon: Math.PI / 2, alt_m: 0 };
			const result = Coord.geodeticToEcef(geod);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const r_ecef = R.getExn(result);
				expect(r_ecef[0]).toBeCloseTo(0, 9);
				expect(r_ecef[1]).toBeCloseTo(EARTH_RADIUS_M, 1);
				expect(r_ecef[2]).toBeCloseTo(0, 9);
			}
		});

		it("北極点", () => {
			const geod = { lat: Math.PI / 2, lon: 0, alt_m: 0 };
			const result = Coord.geodeticToEcef(geod);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const r_ecef = R.getExn(result);
				expect(r_ecef[0]).toBeCloseTo(0, 9);
				expect(r_ecef[1]).toBeCloseTo(0, 9);
				expect(r_ecef[2]).toBeCloseTo(EARTH_RADIUS_M, 1);
			}
		});

		it("高度1000mの点", () => {
			const altitude = 1000;
			const geod = { lat: 0, lon: 0, alt_m: altitude };
			const result = Coord.geodeticToEcef(geod);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const r_ecef = R.getExn(result);
				expect(r_ecef[0]).toBeCloseTo(EARTH_RADIUS_M + altitude, 1);
			}
		});
	});

	describe("往復変換", () => {
		it("ECEF → Geodetic → ECEF が元に戻る", () => {
			const original: Vec3 = [EARTH_RADIUS_M + 1000, 0, 0];
			const geodResult = Coord.ecefToGeodetic(original);

			expect(R.isOk(geodResult)).toBe(true);
			if (R.isOk(geodResult)) {
				const geod = R.getExn(geodResult);
				const ecefResult = Coord.geodeticToEcef(geod);

				expect(R.isOk(ecefResult)).toBe(true);
				if (R.isOk(ecefResult)) {
					const restored = R.getExn(ecefResult);
					expect(restored[0]).toBeCloseTo(original[0], 1);
					expect(restored[1]).toBeCloseTo(original[1], 1);
					expect(restored[2]).toBeCloseTo(original[2], 1);
				}
			}
		});
	});
});
