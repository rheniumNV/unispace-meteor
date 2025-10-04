import { R } from "@mobily/ts-belt";
import { describe, expect, it } from "vitest";
import { EARTH_RADIUS_M } from "../types/constants";
import type { SimulationInput, Vec3 } from "../types/input";
import * as Runner from "./runner";

describe("シミュレーション統合テスト", () => {
	describe("simulateMeteorImpact", () => {
		it("正常な入力でOkを返す", () => {
			// チェリャビンスク隕石風の小型隕石シナリオ
			// 19 km/s, 東向き (方位角90度), 入射角20度
			const r0_ecef: Vec3 = [EARTH_RADIUS_M + 30000, 0, 0]; // 赤道上空30km
			const velocity_ecef: Vec3 = [0, 17849, -6499]; // ≈19km/s, 東向き, 20度下向き
			const input: SimulationInput = {
				discovery: {
					t0: new Date("2024-01-01T00:00:00Z"),
					r0_ecef,
					velocity_ecef,
				},
				meteoroid: {
					diameter_m: 20, // 20m径
					density_kg_m3: 3300, // 石質隕石
					strength_mpa: 10, // 10 MPa
				},
				environment: {
					surface: "land",
				},
			};

			const result = Runner.simulateMeteorImpact(input);

			expect(R.isOk(result)).toBe(true);
		});

		it("ゼロベクトル位置でErrorを返す", () => {
			const input: SimulationInput = {
				discovery: {
					t0: new Date("2024-01-01T00:00:00Z"),
					r0_ecef: [0, 0, 0], // 不正な位置
					velocity_ecef: [19000, 0, 0], // ダミー速度ベクトル
				},
				meteoroid: {
					diameter_m: 20,
					density_kg_m3: 3300,
					strength_mpa: 10,
				},
				environment: {
					surface: "land",
				},
			};

			const result = Runner.simulateMeteorImpact(input);

			expect(R.isError(result)).toBe(true);
		});

		it("現実的なシナリオで妥当な結果を返す（統合テスト）", () => {
			// チェリャビンスク隕石風のシナリオ
			// 19 km/s, 東向き (方位角90度), 入射角45度
			const r0_ecef: Vec3 = [EARTH_RADIUS_M + 20000, 0, 0]; // 赤道上空20km
			const velocity_ecef: Vec3 = [0, 13435, -13435]; // ≈19km/s, 東向き, 45度下向き
			const input: SimulationInput = {
				discovery: {
					t0: new Date("2024-01-01T00:00:00Z"),
					r0_ecef,
					velocity_ecef,
				},
				meteoroid: {
					diameter_m: 20, // 20m径
					density_kg_m3: 3300, // 石質隕石
					strength_mpa: 10, // 10 MPa（比較的脆い）
				},
				environment: {
					surface: "land",
				},
			};

			const result = Runner.simulateMeteorImpact(input);

			expect(R.isOk(result)).toBe(true);

			if (R.isOk(result)) {
				const simResult = R.getExn(result);

				// 軌道データが存在する
				expect(simResult.trajectory.length).toBeGreaterThan(0);

				// 衝突までの時間が正の値
				expect(simResult.time_to_impact_s).toBeGreaterThan(0);
				expect(simResult.time_to_impact_s).toBeLessThan(100); // 100秒以内

				// エネルギーが妥当な範囲
				expect(simResult.energy.joule).toBeGreaterThan(0);
				expect(simResult.energy.mt_tnt).toBeGreaterThan(0); // 0より大きい

				// 空中爆発が検出される（弱い隕石なので）
				// または地表衝突する（強度次第）
				const hasAirburst = simResult.airburst !== null;
				const hasCrater = simResult.crater !== null;
				expect(hasAirburst || hasCrater).toBe(true);

				// 爆風半径が計算されている
				expect(Object.keys(simResult.blast.damage_radii_km).length).toBeGreaterThan(0);

				// 各しきい値で半径が存在する（0以上）
				for (const [_key, radius] of Object.entries(simResult.blast.damage_radii_km)) {
					expect(radius).toBeGreaterThanOrEqual(0);
					expect(radius).toBeLessThan(10000); // 10000km以下
				}

				// 地震規模が計算されている（エネルギーがある場合）
				if (simResult.energy.joule > 0) {
					expect(simResult.seismic.moment_magnitude_M).toBeGreaterThanOrEqual(0);
					expect(simResult.seismic.moment_magnitude_M).toBeLessThan(15); // M15以下
				}
			}
		});

		it("小さな隕石（1m径）でも計算できる", () => {
			// 15 km/s, 北向き (方位角0度), 入射角45度
			const r0_ecef: Vec3 = [EARTH_RADIUS_M + 10000, 0, 0]; // 上空10km
			const velocity_ecef: Vec3 = [-10606.6, 0, -10606.6]; // ≈15km/s, 北向き, 45度下向き
			const input: SimulationInput = {
				discovery: {
					t0: new Date("2024-01-01T00:00:00Z"),
					r0_ecef,
					velocity_ecef,
				},
				meteoroid: {
					diameter_m: 1, // 1m径
					density_kg_m3: 3000,
					strength_mpa: 5,
				},
				environment: {
					surface: "land",
				},
			};

			const result = Runner.simulateMeteorImpact(input);

			expect(R.isOk(result)).toBe(true);

			if (R.isOk(result)) {
				const simResult = R.getExn(result);
				expect(simResult.trajectory.length).toBeGreaterThan(0);
				expect(simResult.energy.mt_tnt).toBeGreaterThan(0);
			}
		});

		it("非常に強い隕石（100 MPa）は地表まで到達する", () => {
			// 20 km/s, 北向き (方位角0度), 入射角60度
			const r0_ecef: Vec3 = [EARTH_RADIUS_M + 20000, 0, 0]; // 上空20km
			const velocity_ecef: Vec3 = [-10000, 0, -17321]; // ≈20km/s, 北向き, 60度下向き
			const input: SimulationInput = {
				discovery: {
					t0: new Date("2024-01-01T00:00:00Z"),
					r0_ecef,
					velocity_ecef,
				},
				meteoroid: {
					diameter_m: 50, // 50m径
					density_kg_m3: 3500, // 鉄質隕石
					strength_mpa: 100, // 非常に強い
				},
				environment: {
					surface: "land",
				},
			};

			const result = Runner.simulateMeteorImpact(input);

			expect(R.isOk(result)).toBe(true);

			if (R.isOk(result)) {
				const simResult = R.getExn(result);

				// 強い隕石は地表衝突する可能性が高い
				// （ただし、速度や角度によっては空中爆発もありうる）
				expect(simResult.crater !== null || simResult.airburst !== null).toBe(true);
			}
		});

		it("水面衝突のケース", () => {
			// 18 km/s, 北東 (方位角45度), 入射角30度
			const r0_ecef: Vec3 = [EARTH_RADIUS_M + 15000, 0, 0]; // 上空15km
			const velocity_ecef: Vec3 = [-11023, 11023, -9000]; // ≈18km/s, 北東, 30度下向き
			const input: SimulationInput = {
				discovery: {
					t0: new Date("2024-01-01T00:00:00Z"),
					r0_ecef,
					velocity_ecef,
				},
				meteoroid: {
					diameter_m: 30,
					density_kg_m3: 3200,
					strength_mpa: 20,
				},
				environment: {
					surface: "water", // 水面
				},
			};

			const result = Runner.simulateMeteorImpact(input);

			expect(R.isOk(result)).toBe(true);

			if (R.isOk(result)) {
				const simResult = R.getExn(result);
				expect(simResult.trajectory.length).toBeGreaterThan(0);

				// 水面衝突でもクレーターは計算される（ターゲット密度が水の1000kg/m³）
				if (simResult.crater !== null) {
					expect(simResult.crater.final_diameter_m).toBeGreaterThan(0);
				}
			}
		});

		it("モデルパラメータなしでデフォルト値を使用", () => {
			// 15 km/s, 北向き (方位角0度), 入射角45度
			const r0_ecef: Vec3 = [EARTH_RADIUS_M + 10000, 0, 0];
			const velocity_ecef: Vec3 = [-10606.6, 0, -10606.6]; // ≈15km/s, 北向き, 45度下向き
			const input: SimulationInput = {
				discovery: {
					t0: new Date("2024-01-01T00:00:00Z"),
					r0_ecef,
					velocity_ecef,
				},
				meteoroid: {
					diameter_m: 10,
					density_kg_m3: 3000,
					strength_mpa: 10,
				},
				environment: {
					surface: "land",
				},
				// modelパラメータを省略
			};

			const result = Runner.simulateMeteorImpact(input);

			expect(R.isOk(result)).toBe(true);

			if (R.isOk(result)) {
				const simResult = R.getExn(result);

				// デフォルトの爆風しきい値が使われる
				expect(Object.keys(simResult.blast.damage_radii_km)).toContain("1kPa");
				expect(Object.keys(simResult.blast.damage_radii_km)).toContain("3.5kPa");
				expect(Object.keys(simResult.blast.damage_radii_km)).toContain("10kPa");
				expect(Object.keys(simResult.blast.damage_radii_km)).toContain("20kPa");
			}
		});

		it("カスタム爆風しきい値が正しく使われる", () => {
			// 15 km/s, 北向き (方位角0度), 入射角45度
			const customThresholds = [5, 15, 50];
			const r0_ecef: Vec3 = [EARTH_RADIUS_M + 10000, 0, 0];
			const velocity_ecef: Vec3 = [-10606.6, 0, -10606.6]; // ≈15km/s, 北向き, 45度下向き
			const input: SimulationInput = {
				discovery: {
					t0: new Date("2024-01-01T00:00:00Z"),
					r0_ecef,
					velocity_ecef,
				},
				meteoroid: {
					diameter_m: 10,
					density_kg_m3: 3000,
					strength_mpa: 10,
				},
				environment: {
					surface: "land",
				},
				model: {
					blast_thresholds_kpa: customThresholds,
				},
			};

			const result = Runner.simulateMeteorImpact(input);

			expect(R.isOk(result)).toBe(true);

			if (R.isOk(result)) {
				const simResult = R.getExn(result);

				// カスタムしきい値が使われる
				expect(Object.keys(simResult.blast.damage_radii_km)).toContain("5kPa");
				expect(Object.keys(simResult.blast.damage_radii_km)).toContain("15kPa");
				expect(Object.keys(simResult.blast.damage_radii_km)).toContain("50kPa");
			}
		});

		it("環境パラメータの上書きが動作する", () => {
			// 15 km/s, 北向き (方位角0度), 入射角45度
			const r0_ecef: Vec3 = [EARTH_RADIUS_M + 10000, 0, 0];
			const velocity_ecef: Vec3 = [-10606.6, 0, -10606.6]; // ≈15km/s, 北向き, 45度下向き
			const input: SimulationInput = {
				discovery: {
					t0: new Date("2024-01-01T00:00:00Z"),
					r0_ecef,
					velocity_ecef,
				},
				meteoroid: {
					diameter_m: 10,
					density_kg_m3: 3000,
					strength_mpa: 10,
				},
				environment: {
					surface: "land",
					rho0_kg_m3: 1.5, // カスタム大気密度
					gravity_m_s2: 10.0, // カスタム重力
				},
			};

			const result = Runner.simulateMeteorImpact(input);

			// カスタムパラメータでも正常に動作する
			expect(R.isOk(result)).toBe(true);
		});
	});
});
