import { R } from "@mobily/ts-belt";
import { describe, expect, it } from "vitest";
import * as Atmos from "./density";

describe("大気密度", () => {
	describe("atmosphericDensity", () => {
		it("海面高度での密度", () => {
			const result = Atmos.atmosphericDensity(0, 1.225, 8000);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				expect(R.getExn(result)).toBeCloseTo(1.225, 10);
			}
		});

		it("スケールハイト高度での密度は約1/e", () => {
			const rho0 = 1.225;
			const H = 8000;
			const result = Atmos.atmosphericDensity(H, rho0, H);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const expected = rho0 / Math.E;
				expect(R.getExn(result)).toBeCloseTo(expected, 10);
			}
		});

		it("高度が2倍のスケールハイトで密度は約1/e²", () => {
			const rho0 = 1.225;
			const H = 8000;
			const result = Atmos.atmosphericDensity(2 * H, rho0, H);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const expected = rho0 / (Math.E * Math.E);
				expect(R.getExn(result)).toBeCloseTo(expected, 10);
			}
		});

		it("負の高度では海面密度を返す", () => {
			const result = Atmos.atmosphericDensity(-1000, 1.225, 8000);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				expect(R.getExn(result)).toBe(1.225);
			}
		});

		it("負の海面密度はエラー", () => {
			const result = Atmos.atmosphericDensity(0, -1, 8000);

			expect(R.isError(result)).toBe(true);
		});

		it("ゼロ以下のスケールハイトはエラー", () => {
			const result = Atmos.atmosphericDensity(0, 1.225, 0);

			expect(R.isError(result)).toBe(true);
		});
	});
});
