import { R } from "@mobily/ts-belt";
import { describe, expect, it } from "vitest";
import { EARTH_ROTATION_RAD_S } from "../../types/constants";
import type { Vec3 } from "../../types/input";
import * as Vec from "../coordinates/vector";
import * as Coriolis from "./coriolis";

describe("コリオリ力と遠心力", () => {
	describe("coriolisAcceleration", () => {
		it("速度ゼロではコリオリ力もゼロ", () => {
			const v_ecef: Vec3 = [0, 0, 0];
			const result = Coriolis.coriolisAcceleration(v_ecef);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const a = R.getExn(result);
				expect(Vec.magnitude(a)).toBe(0);
			}
		});

		it("Z軸方向の速度ではコリオリ力はゼロ", () => {
			// Z軸 = 回転軸なのでコリオリ力なし
			const v_ecef: Vec3 = [0, 0, 1000];
			const result = Coriolis.coriolisAcceleration(v_ecef);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const a = R.getExn(result);
				expect(Vec.magnitude(a)).toBeCloseTo(0, 10);
			}
		});

		it("X軸方向の速度にはY軸方向のコリオリ力", () => {
			const v_ecef: Vec3 = [1000, 0, 0];
			const result = Coriolis.coriolisAcceleration(v_ecef);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const a = R.getExn(result);

				// a = -2Ω × v
				// Ω = [0, 0, Ω_z]
				// v = [v_x, 0, 0]
				// Ω × v = [0, Ω_z * v_x, 0]
				// -2Ω × v = [0, -2 * Ω_z * v_x, 0]

				expect(a[0]).toBeCloseTo(0, 10);
				expect(a[1]).toBeCloseTo(-2 * EARTH_ROTATION_RAD_S * 1000, 10);
				expect(a[2]).toBeCloseTo(0, 10);
			}
		});

		it("コリオリ加速度の大きさは速度に比例", () => {
			const v1: Vec3 = [1000, 0, 0];
			const v2: Vec3 = [2000, 0, 0];

			const a1Result = Coriolis.coriolisAcceleration(v1);
			const a2Result = Coriolis.coriolisAcceleration(v2);

			expect(R.isOk(a1Result)).toBe(true);
			expect(R.isOk(a2Result)).toBe(true);

			if (R.isOk(a1Result) && R.isOk(a2Result)) {
				const a1_mag = Vec.magnitude(R.getExn(a1Result));
				const a2_mag = Vec.magnitude(R.getExn(a2Result));

				expect(a2_mag).toBeCloseTo(a1_mag * 2, 10);
			}
		});
	});

	describe("centrifugalAcceleration", () => {
		it("原点での遠心力はゼロ", () => {
			const r_ecef: Vec3 = [0, 0, 0];
			const result = Coriolis.centrifugalAcceleration(r_ecef);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const a = R.getExn(result);
				expect(Vec.magnitude(a)).toBe(0);
			}
		});

		it("Z軸上では遠心力はゼロ（回転軸上）", () => {
			const r_ecef: Vec3 = [0, 0, 1000000];
			const result = Coriolis.centrifugalAcceleration(r_ecef);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const a = R.getExn(result);
				expect(Vec.magnitude(a)).toBeCloseTo(0, 10);
			}
		});

		it("赤道上では遠心力は外向き", () => {
			const r_ecef: Vec3 = [6371000, 0, 0]; // 地球半径
			const result = Coriolis.centrifugalAcceleration(r_ecef);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const a = R.getExn(result);

				// 遠心力は赤道面で外向き（位置ベクトルと同じ方向）
				const r_normalized = Vec.normalize(r_ecef);
				const a_normalized = Vec.normalize(a);

				expect(a_normalized[0]).toBeCloseTo(r_normalized[0], 5);
				expect(a_normalized[1]).toBeCloseTo(r_normalized[1], 5);
				expect(a_normalized[2]).toBeCloseTo(r_normalized[2], 5);
			}
		});

		it("遠心加速度の大きさは距離に比例", () => {
			const r1: Vec3 = [1000000, 0, 0];
			const r2: Vec3 = [2000000, 0, 0];

			const a1Result = Coriolis.centrifugalAcceleration(r1);
			const a2Result = Coriolis.centrifugalAcceleration(r2);

			expect(R.isOk(a1Result)).toBe(true);
			expect(R.isOk(a2Result)).toBe(true);

			if (R.isOk(a1Result) && R.isOk(a2Result)) {
				const a1_mag = Vec.magnitude(R.getExn(a1Result));
				const a2_mag = Vec.magnitude(R.getExn(a2Result));

				expect(a2_mag).toBeCloseTo(a1_mag * 2, 10);
			}
		});
	});
});
