import { R } from "@mobily/ts-belt";
import { describe, expect, it } from "vitest";
import { MEGATON_TNT_JOULE } from "../../types/constants";
import * as Blast from "./radius";

describe("爆風半径計算", () => {
	describe("calculateBlastRadius", () => {
		it("基本的な爆風半径計算", () => {
			// 1メガトンTNT相当のエネルギー
			const energy = MEGATON_TNT_JOULE;
			const overpressure = 10; // 10kPa
			const result = Blast.calculateBlastRadius(energy, overpressure);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const radius_km = R.getExn(result);

				// 半径は正の値
				expect(radius_km).toBeGreaterThan(0);

				// おおよその妥当性チェック（10kPaで数km程度）
				expect(radius_km).toBeGreaterThan(1);
				expect(radius_km).toBeLessThan(100);
			}
		});

		it("エネルギーが大きいほど影響半径も大きい", () => {
			const energy1 = MEGATON_TNT_JOULE;
			const energy2 = MEGATON_TNT_JOULE * 10;
			const overpressure = 10;

			const result1 = Blast.calculateBlastRadius(energy1, overpressure);
			const result2 = Blast.calculateBlastRadius(energy2, overpressure);

			expect(R.isOk(result1)).toBe(true);
			expect(R.isOk(result2)).toBe(true);

			if (R.isOk(result1) && R.isOk(result2)) {
				const radius1 = R.getExn(result1);
				const radius2 = R.getExn(result2);

				// エネルギーが10倍なら半径は10^(1/3) ≈ 2.15倍
				expect(radius2).toBeGreaterThan(radius1);
				expect(radius2 / radius1).toBeCloseTo(10 ** (1 / 3), 1);
			}
		});

		it("過圧が小さいほど影響半径が大きい", () => {
			const energy = MEGATON_TNT_JOULE;
			const overpressure1 = 20; // 20kPa
			const overpressure2 = 5; // 5kPa

			const result1 = Blast.calculateBlastRadius(energy, overpressure1);
			const result2 = Blast.calculateBlastRadius(energy, overpressure2);

			expect(R.isOk(result1)).toBe(true);
			expect(R.isOk(result2)).toBe(true);

			if (R.isOk(result1) && R.isOk(result2)) {
				const radius1 = R.getExn(result1);
				const radius2 = R.getExn(result2);

				// 低い過圧の方が遠くまで届く
				expect(radius2).toBeGreaterThan(radius1);
			}
		});

		it("空中爆発では地表での半径が小さくなる", () => {
			const energy = MEGATON_TNT_JOULE;
			const overpressure = 10;

			const resultGround = Blast.calculateBlastRadius(energy, overpressure, 0);
			const resultAir = Blast.calculateBlastRadius(energy, overpressure, 1000);

			expect(R.isOk(resultGround)).toBe(true);
			expect(R.isOk(resultAir)).toBe(true);

			if (R.isOk(resultGround) && R.isOk(resultAir)) {
				const radiusGround = R.getExn(resultGround);
				const radiusAir = R.getExn(resultAir);

				// 空中爆発の方が地表での半径は小さい
				expect(radiusAir).toBeLessThanOrEqual(radiusGround);
			}
		});

		it("ゼロ以下のエネルギーはエラー", () => {
			const result = Blast.calculateBlastRadius(0, 10);

			expect(R.isError(result)).toBe(true);
		});

		it("ゼロ以下の過圧はエラー", () => {
			const result = Blast.calculateBlastRadius(MEGATON_TNT_JOULE, 0);

			expect(R.isError(result)).toBe(true);
		});
	});

	describe("calculateBlastRadii", () => {
		it("複数のしきい値で半径を計算", () => {
			const energy = MEGATON_TNT_JOULE;
			const thresholds = [1, 3.5, 10, 20];
			const result = Blast.calculateBlastRadii(energy, thresholds);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const radii = R.getExn(result);

				// 全てのしきい値で半径が計算されている
				expect(radii["1kPa"]).toBeGreaterThan(0);
				expect(radii["3.5kPa"]).toBeGreaterThan(0);
				expect(radii["10kPa"]).toBeGreaterThan(0);
				expect(radii["20kPa"]).toBeGreaterThan(0);

				// 低い過圧ほど半径が大きい
				expect(radii["1kPa"]).toBeGreaterThan(radii["3.5kPa"]);
				expect(radii["3.5kPa"]).toBeGreaterThan(radii["10kPa"]);
				expect(radii["10kPa"]).toBeGreaterThan(radii["20kPa"]);
			}
		});
	});
});
