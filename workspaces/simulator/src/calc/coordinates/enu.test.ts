import { R } from "@mobily/ts-belt";
import { describe, expect, it } from "vitest";
import * as ENU from "./enu";
import * as Vec from "./vector";

describe("ENU座標系", () => {
	describe("enuBasisAt", () => {
		it("赤道・経度0度でのENU基底", () => {
			const lat = 0;
			const lon = 0;
			const result = ENU.enuBasisAt(lat, lon);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const basis = R.getExn(result);

				// East: [-sin(0), cos(0), 0] = [0, 1, 0]
				expect(basis.E[0]).toBeCloseTo(0, 10);
				expect(basis.E[1]).toBeCloseTo(1, 10);
				expect(basis.E[2]).toBeCloseTo(0, 10);

				// North: [-sin(0)*cos(0), -sin(0)*sin(0), cos(0)] = [0, 0, 1]
				expect(basis.N[0]).toBeCloseTo(0, 10);
				expect(basis.N[1]).toBeCloseTo(0, 10);
				expect(basis.N[2]).toBeCloseTo(1, 10);

				// Up: [cos(0)*cos(0), cos(0)*sin(0), sin(0)] = [1, 0, 0]
				expect(basis.U[0]).toBeCloseTo(1, 10);
				expect(basis.U[1]).toBeCloseTo(0, 10);
				expect(basis.U[2]).toBeCloseTo(0, 10);
			}
		});

		it("北極でのENU基底", () => {
			const lat = Math.PI / 2;
			const lon = 0;
			const result = ENU.enuBasisAt(lat, lon);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const basis = R.getExn(result);

				// 全てのベクトルが単位ベクトル
				expect(Vec.magnitude(basis.E)).toBeCloseTo(1, 10);
				expect(Vec.magnitude(basis.N)).toBeCloseTo(1, 10);
				expect(Vec.magnitude(basis.U)).toBeCloseTo(1, 10);

				// 互いに直交
				expect(Vec.dot(basis.E, basis.N)).toBeCloseTo(0, 10);
				expect(Vec.dot(basis.N, basis.U)).toBeCloseTo(0, 10);
				expect(Vec.dot(basis.U, basis.E)).toBeCloseTo(0, 10);
			}
		});

		it("ENU基底は互いに直交する単位ベクトル", () => {
			const lat = Math.PI / 4; // 45度
			const lon = Math.PI / 6; // 30度
			const result = ENU.enuBasisAt(lat, lon);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const basis = R.getExn(result);

				// 全てのベクトルが単位ベクトル
				expect(Vec.magnitude(basis.E)).toBeCloseTo(1, 10);
				expect(Vec.magnitude(basis.N)).toBeCloseTo(1, 10);
				expect(Vec.magnitude(basis.U)).toBeCloseTo(1, 10);

				// 互いに直交
				expect(Vec.dot(basis.E, basis.N)).toBeCloseTo(0, 10);
				expect(Vec.dot(basis.N, basis.U)).toBeCloseTo(0, 10);
				expect(Vec.dot(basis.U, basis.E)).toBeCloseTo(0, 10);

				// 右手系（E × N = U）
				const cross_EN = Vec.cross(basis.E, basis.N);
				expect(cross_EN[0]).toBeCloseTo(basis.U[0], 10);
				expect(cross_EN[1]).toBeCloseTo(basis.U[1], 10);
				expect(cross_EN[2]).toBeCloseTo(basis.U[2], 10);
			}
		});
	});

	describe("velocityFromAzimuthEntry", () => {
		it("北向き・水平（方位角0度・入射角0度）", () => {
			const basis = {
				E: [0, 1, 0] as const,
				N: [0, 0, 1] as const,
				U: [1, 0, 0] as const,
			};
			const result = ENU.velocityFromAzimuthEntry(100, 0, 0, basis);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const v = R.getExn(result);
				const mag = Vec.magnitude(v);
				expect(mag).toBeCloseTo(100, 10);

				// 北向き = N方向
				expect(v[0]).toBeCloseTo(0, 10);
				expect(v[1]).toBeCloseTo(0, 10);
				expect(v[2]).toBeCloseTo(100, 10);
			}
		});

		it("東向き・水平（方位角90度・入射角0度）", () => {
			const basis = {
				E: [0, 1, 0] as const,
				N: [0, 0, 1] as const,
				U: [1, 0, 0] as const,
			};
			const result = ENU.velocityFromAzimuthEntry(100, 90, 0, basis);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const v = R.getExn(result);
				const mag = Vec.magnitude(v);
				expect(mag).toBeCloseTo(100, 10);

				// 東向き = E方向
				expect(v[0]).toBeCloseTo(0, 10);
				expect(v[1]).toBeCloseTo(100, 10);
				expect(v[2]).toBeCloseTo(0, 10);
			}
		});

		it("鉛直下向き（入射角90度）", () => {
			const basis = {
				E: [0, 1, 0] as const,
				N: [0, 0, 1] as const,
				U: [1, 0, 0] as const,
			};
			const result = ENU.velocityFromAzimuthEntry(100, 0, 90, basis);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const v = R.getExn(result);
				const mag = Vec.magnitude(v);
				expect(mag).toBeCloseTo(100, 10);

				// 下向き = -U方向
				expect(v[0]).toBeCloseTo(-100, 10);
				expect(v[1]).toBeCloseTo(0, 10);
				expect(v[2]).toBeCloseTo(0, 10);
			}
		});

		it("45度入射（北向き）", () => {
			const basis = {
				E: [0, 1, 0] as const,
				N: [0, 0, 1] as const,
				U: [1, 0, 0] as const,
			};
			const result = ENU.velocityFromAzimuthEntry(100, 0, 45, basis);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const v = R.getExn(result);
				const mag = Vec.magnitude(v);
				expect(mag).toBeCloseTo(100, 10);

				// 水平成分と鉛直成分がほぼ同じ
				const v_horizontal = Math.sqrt(v[1] * v[1] + v[2] * v[2]);
				const v_vertical = Math.abs(v[0]);
				expect(v_horizontal).toBeCloseTo(v_vertical, 10);
			}
		});

		it("負の速度はエラー", () => {
			const basis = {
				E: [0, 1, 0] as const,
				N: [0, 0, 1] as const,
				U: [1, 0, 0] as const,
			};
			const result = ENU.velocityFromAzimuthEntry(-100, 0, 0, basis);

			expect(R.isError(result)).toBe(true);
		});
	});
});
