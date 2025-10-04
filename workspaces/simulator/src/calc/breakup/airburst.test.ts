import { R } from "@mobily/ts-belt";
import { describe, expect, it } from "vitest";
import type { TrajectoryPoint } from "../../types/output";
import * as Airburst from "./airburst";

describe("空中爆発検出", () => {
	describe("detectAirburst", () => {
		it("空中爆発が発生する場合（高度 > 0）", () => {
			const samples: TrajectoryPoint[] = [
				{
					t: 0,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, 15000, -10000],
					mass_kg: 1000, // 質量1トン
					alt_m: 10000, // 高度10km
					lat: 0,
					lon: 0,
				},
			];

			const result = Airburst.detectAirburst(samples, 10);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const airburst = R.getExn(result);

				expect(airburst.isOccurrence).toBe(true);
				if (airburst.isOccurrence) {
					expect(airburst.burst_altitude_m).toBe(10000);
					expect(airburst.burst_energy_joule).toBeGreaterThan(0);
				}
			}
		});

		it("空中爆発が発生しない場合（高度 = 0）", () => {
			const samples: TrajectoryPoint[] = [
				{
					t: 0,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, 15000, -10000],
					mass_kg: 1000,
					alt_m: 0, // 高度0m（地表）
					lat: 0,
					lon: 0,
				},
			];

			const result = Airburst.detectAirburst(samples, 10);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const airburst = R.getExn(result);
				expect(airburst.isOccurrence).toBe(false);
			}
		});

		it("空中爆発が発生しない場合（高度 < 0）", () => {
			const samples: TrajectoryPoint[] = [
				{
					t: 0,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, 15000, -10000],
					mass_kg: 1000,
					alt_m: -100, // 高度-100m（地下）
					lat: 0,
					lon: 0,
				},
			];

			const result = Airburst.detectAirburst(samples, 10);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const airburst = R.getExn(result);
				expect(airburst.isOccurrence).toBe(false);
			}
		});

		it("空の軌道サンプルでエラーを返す", () => {
			const samples: TrajectoryPoint[] = [];

			const result = Airburst.detectAirburst(samples, 10);

			expect(R.isError(result)).toBe(true);
		});

		it("高度が高いほどエネルギーが大きい（速度依存）", () => {
			const samples1: TrajectoryPoint[] = [
				{
					t: 0,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, 10000, -5000], // 低速
					mass_kg: 1000,
					alt_m: 5000,
					lat: 0,
					lon: 0,
				},
			];

			const samples2: TrajectoryPoint[] = [
				{
					t: 0,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, 20000, -10000], // 高速
					mass_kg: 1000,
					alt_m: 5000,
					lat: 0,
					lon: 0,
				},
			];

			const result1 = Airburst.detectAirburst(samples1, 10);
			const result2 = Airburst.detectAirburst(samples2, 10);

			expect(R.isOk(result1)).toBe(true);
			expect(R.isOk(result2)).toBe(true);

			if (R.isOk(result1) && R.isOk(result2)) {
				const airburst1 = R.getExn(result1);
				const airburst2 = R.getExn(result2);

				expect(airburst1.isOccurrence).toBe(true);
				expect(airburst2.isOccurrence).toBe(true);

				if (airburst1.isOccurrence && airburst2.isOccurrence) {
					// 速度が速いほうがエネルギーが大きい
					expect(airburst2.burst_energy_joule).toBeGreaterThan(airburst1.burst_energy_joule);
				}
			}
		});

		it("複数サンプルがある場合、最後のサンプルを使う", () => {
			const samples: TrajectoryPoint[] = [
				{
					t: 0,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, 15000, -10000],
					mass_kg: 1000,
					alt_m: 20000, // 最初は高度20km
					lat: 0,
					lon: 0,
				},
				{
					t: 1,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, 14000, -9000],
					mass_kg: 950,
					alt_m: 15000, // 途中で高度15km
					lat: 0,
					lon: 0,
				},
				{
					t: 2,
					r_ecef: [6371000, 0, 0],
					v_ecef: [0, 13000, -8000],
					mass_kg: 900,
					alt_m: 8000, // 最後は高度8km
					lat: 0,
					lon: 0,
				},
			];

			const result = Airburst.detectAirburst(samples, 10);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const airburst = R.getExn(result);

				expect(airburst.isOccurrence).toBe(true);
				if (airburst.isOccurrence) {
					// 最後のサンプルの高度を使う
					expect(airburst.burst_altitude_m).toBe(8000);
				}
			}
		});
	});
});
