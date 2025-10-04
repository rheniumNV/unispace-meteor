import { R } from "@mobily/ts-belt";
import { describe, expect, it } from "vitest";
import { MEGATON_TNT_JOULE } from "../../types/constants";
import * as Seismic from "./magnitude";

describe("地震規模計算", () => {
	describe("calculateSeismicMagnitude", () => {
		it("基本的なモーメントマグニチュード計算", () => {
			// 1メガトンTNT相当のエネルギー
			const energy = MEGATON_TNT_JOULE;
			const result = Seismic.calculateSeismicMagnitude(energy);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const magnitude = R.getExn(result);

				// マグニチュードは妥当な範囲
				expect(magnitude).toBeGreaterThan(0);
				expect(magnitude).toBeLessThan(10);
			}
		});

		it("エネルギーが大きいほどマグニチュードも大きい", () => {
			const energy1 = MEGATON_TNT_JOULE;
			const energy2 = MEGATON_TNT_JOULE * 100;

			const result1 = Seismic.calculateSeismicMagnitude(energy1);
			const result2 = Seismic.calculateSeismicMagnitude(energy2);

			expect(R.isOk(result1)).toBe(true);
			expect(R.isOk(result2)).toBe(true);

			if (R.isOk(result1) && R.isOk(result2)) {
				const M1 = R.getExn(result1);
				const M2 = R.getExn(result2);

				// エネルギーが100倍ならマグニチュードは約(2/3)*log10(100) ≈ 1.33大きい
				expect(M2).toBeGreaterThan(M1);
				expect(M2 - M1).toBeCloseTo((2 / 3) * Math.log10(100), 1);
			}
		});

		it("地震効率が大きいほどマグニチュードも大きい", () => {
			const energy = MEGATON_TNT_JOULE;
			const efficiency1 = 0.001;
			const efficiency2 = 0.01;

			const result1 = Seismic.calculateSeismicMagnitude(energy, efficiency1);
			const result2 = Seismic.calculateSeismicMagnitude(energy, efficiency2);

			expect(R.isOk(result1)).toBe(true);
			expect(R.isOk(result2)).toBe(true);

			if (R.isOk(result1) && R.isOk(result2)) {
				const M1 = R.getExn(result1);
				const M2 = R.getExn(result2);

				// 効率が10倍ならマグニチュードは約(2/3)*log10(10) ≈ 0.67大きい
				expect(M2).toBeGreaterThan(M1);
				expect(M2 - M1).toBeCloseTo((2 / 3) * Math.log10(10), 1);
			}
		});

		it("ゼロ以下のエネルギーはエラー", () => {
			const result = Seismic.calculateSeismicMagnitude(0);

			expect(R.isError(result)).toBe(true);
		});

		it("ゼロ以下の地震効率はエラー", () => {
			const result = Seismic.calculateSeismicMagnitude(MEGATON_TNT_JOULE, 0);

			expect(R.isError(result)).toBe(true);
		});

		it("1より大きい地震効率はエラー", () => {
			const result = Seismic.calculateSeismicMagnitude(MEGATON_TNT_JOULE, 1.5);

			expect(R.isError(result)).toBe(true);
		});
	});
});
