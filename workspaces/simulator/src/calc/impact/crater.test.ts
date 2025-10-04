import { R } from "@mobily/ts-belt";
import { describe, expect, it } from "vitest";
import * as Crater from "./crater";

describe("クレーター計算", () => {
	describe("calculateCrater", () => {
		it("基本的なクレーター計算", () => {
			// 10m径、3000kg/m³密度、20km/s速度、45度衝突、陸地（2500kg/m³）
			const result = Crater.calculateCrater(10, 3000, 20000, 45, 2500, 9.81);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const crater = R.getExn(result);

				// クレーターサイズは正の値
				expect(crater.transient_diameter_m).toBeGreaterThan(0);
				expect(crater.final_diameter_m).toBeGreaterThan(0);
				expect(crater.depth_m).toBeGreaterThan(0);

				// 最終クレーターは一時クレーターより大きい
				expect(crater.final_diameter_m).toBeGreaterThan(crater.transient_diameter_m);

				// 深さは直径より小さい
				expect(crater.depth_m).toBeLessThan(crater.final_diameter_m);
			}
		});

		it("高速衝突ほどクレーターが大きい", () => {
			const result1 = Crater.calculateCrater(10, 3000, 10000, 45, 2500, 9.81);
			const result2 = Crater.calculateCrater(10, 3000, 20000, 45, 2500, 9.81);

			expect(R.isOk(result1)).toBe(true);
			expect(R.isOk(result2)).toBe(true);

			if (R.isOk(result1) && R.isOk(result2)) {
				const crater1 = R.getExn(result1);
				const crater2 = R.getExn(result2);

				// 速度が2倍なら、クレーターサイズも大きくなる（v^0.44）
				expect(crater2.final_diameter_m).toBeGreaterThan(crater1.final_diameter_m);
			}
		});

		it("大きな隕石ほどクレーターが大きい", () => {
			const result1 = Crater.calculateCrater(10, 3000, 20000, 45, 2500, 9.81);
			const result2 = Crater.calculateCrater(20, 3000, 20000, 45, 2500, 9.81);

			expect(R.isOk(result1)).toBe(true);
			expect(R.isOk(result2)).toBe(true);

			if (R.isOk(result1) && R.isOk(result2)) {
				const crater1 = R.getExn(result1);
				const crater2 = R.getExn(result2);

				// 直径が2倍なら、クレーターサイズも大きくなる（d^0.78）
				expect(crater2.final_diameter_m).toBeGreaterThan(crater1.final_diameter_m);
			}
		});

		it("垂直衝突（90度）は斜め衝突より大きいクレーター", () => {
			const result45 = Crater.calculateCrater(10, 3000, 20000, 45, 2500, 9.81);
			const result90 = Crater.calculateCrater(10, 3000, 20000, 90, 2500, 9.81);

			expect(R.isOk(result45)).toBe(true);
			expect(R.isOk(result90)).toBe(true);

			if (R.isOk(result45) && R.isOk(result90)) {
				const crater45 = R.getExn(result45);
				const crater90 = R.getExn(result90);

				// 垂直衝突の方が大きいクレーター
				expect(crater90.final_diameter_m).toBeGreaterThan(crater45.final_diameter_m);
			}
		});

		it("ゼロ以下の直径はエラー", () => {
			const result = Crater.calculateCrater(0, 3000, 20000, 45, 2500, 9.81);

			expect(R.isError(result)).toBe(true);
		});

		it("ゼロ以下の密度はエラー", () => {
			const result = Crater.calculateCrater(10, 0, 20000, 45, 2500, 9.81);

			expect(R.isError(result)).toBe(true);
		});

		it("ゼロ以下の速度はエラー", () => {
			const result = Crater.calculateCrater(10, 3000, 0, 45, 2500, 9.81);

			expect(R.isError(result)).toBe(true);
		});

		it("0度の衝突角はエラー", () => {
			const result = Crater.calculateCrater(10, 3000, 20000, 0, 2500, 9.81);

			expect(R.isError(result)).toBe(true);
		});
	});
});
