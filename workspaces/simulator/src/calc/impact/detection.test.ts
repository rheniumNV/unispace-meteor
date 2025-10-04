import { R } from "@mobily/ts-belt";
import { describe, expect, it } from "vitest";
import type { TrajectoryPoint } from "../../types/output";
import * as Detection from "./detection";

describe("衝突検出", () => {
	describe("detectImpact", () => {
		it("高度0以下で衝突を検出", () => {
			const samples: TrajectoryPoint[] = [
				{
					t: 0,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, -1000, 0],
					alt_m: 1000,
					lat: 0,
					lon: 0,
				},
				{
					t: 1,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, -1000, 0],
					alt_m: -10,
					lat: 35.6,
					lon: 139.7,
				},
			];

			const result = Detection.detectImpact(samples);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const impact = R.getExn(result);
				expect(impact.impacted).toBe(true);

				if (impact.impacted) {
					expect(impact.t).toBe(1);
					expect(impact.r_ecef).toEqual([6371000, 0, 0]);
					expect(impact.v_ecef).toEqual([0, -1000, 0]);
					expect(impact.lat).toBe(35.6);
					expect(impact.lon).toBe(139.7);
				}
			}
		});

		it("高度0ちょうどで衝突を検出", () => {
			const samples: TrajectoryPoint[] = [
				{
					t: 0,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, -1000, 0],
					alt_m: 100,
					lat: 0,
					lon: 0,
				},
				{
					t: 1,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, -1000, 0],
					alt_m: 0,
					lat: 35.6,
					lon: 139.7,
				},
			];

			const result = Detection.detectImpact(samples);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const impact = R.getExn(result);
				expect(impact.impacted).toBe(true);
			}
		});

		it("高度が正で衝突していない", () => {
			const samples: TrajectoryPoint[] = [
				{
					t: 0,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, -1000, 0],
					alt_m: 1000,
					lat: 0,
					lon: 0,
				},
				{
					t: 1,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, -1000, 0],
					alt_m: 500,
					lat: 35.6,
					lon: 139.7,
				},
			];

			const result = Detection.detectImpact(samples);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const impact = R.getExn(result);
				expect(impact.impacted).toBe(false);
			}
		});

		it("単一サンプルでも動作する", () => {
			const samples: TrajectoryPoint[] = [
				{
					t: 0,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, -1000, 0],
					alt_m: -5,
					lat: 35.6,
					lon: 139.7,
				},
			];

			const result = Detection.detectImpact(samples);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const impact = R.getExn(result);
				expect(impact.impacted).toBe(true);
			}
		});

		it("空のサンプル配列でエラー", () => {
			const samples: TrajectoryPoint[] = [];

			const result = Detection.detectImpact(samples);

			expect(R.isError(result)).toBe(true);
		});
	});
});
