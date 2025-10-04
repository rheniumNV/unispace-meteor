import { R } from "@mobily/ts-belt";
import { describe, expect, it } from "vitest";
import { EARTH_MU_M3_S2, EARTH_RADIUS_M } from "../../types/constants";
import type { Vec3 } from "../../types/input";
import * as Vec from "../coordinates/vector";
import * as Grav from "./gravity";

describe("重力計算", () => {
	describe("gravityAcceleration", () => {
		it("地表での重力加速度は約9.8m/s²", () => {
			const r_ecef: Vec3 = [EARTH_RADIUS_M, 0, 0];
			const result = Grav.gravityAcceleration(r_ecef);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const g = R.getExn(result);
				const g_mag = Vec.magnitude(g);
				const expected = EARTH_MU_M3_S2 / (EARTH_RADIUS_M * EARTH_RADIUS_M);
				expect(g_mag).toBeCloseTo(expected, 5);
				expect(g_mag).toBeCloseTo(9.82, 1); // 約9.8m/s²
			}
		});

		it("重力は中心方向を向く", () => {
			const r_ecef: Vec3 = [EARTH_RADIUS_M, 0, 0];
			const result = Grav.gravityAcceleration(r_ecef);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const g = R.getExn(result);
				const r_normalized = Vec.normalize(r_ecef);
				const g_normalized = Vec.normalize(g);

				// 重力は位置ベクトルと反対方向
				expect(g_normalized[0]).toBeCloseTo(-r_normalized[0], 10);
				expect(g_normalized[1]).toBeCloseTo(-r_normalized[1], 10);
				expect(g_normalized[2]).toBeCloseTo(-r_normalized[2], 10);
			}
		});

		it("高度が2倍になると重力は約1/4", () => {
			const r1: Vec3 = [EARTH_RADIUS_M, 0, 0];
			const r2: Vec3 = [2 * EARTH_RADIUS_M, 0, 0];

			const g1Result = Grav.gravityAcceleration(r1);
			const g2Result = Grav.gravityAcceleration(r2);

			expect(R.isOk(g1Result)).toBe(true);
			expect(R.isOk(g2Result)).toBe(true);

			if (R.isOk(g1Result) && R.isOk(g2Result)) {
				const g1_mag = Vec.magnitude(R.getExn(g1Result));
				const g2_mag = Vec.magnitude(R.getExn(g2Result));

				expect(g2_mag).toBeCloseTo(g1_mag / 4, 10);
			}
		});

		it("ゼロベクトルはエラー", () => {
			const r_ecef: Vec3 = [0, 0, 0];
			const result = Grav.gravityAcceleration(r_ecef);

			expect(R.isError(result)).toBe(true);
		});
	});
});
