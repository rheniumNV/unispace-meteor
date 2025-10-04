import { R } from "@mobily/ts-belt";
import { describe, expect, it } from "vitest";
import type { Vec3 } from "../../types/input";
import * as Vec from "../coordinates/vector";
import * as Drag from "./drag";

describe("抗力計算", () => {
	describe("dragAcceleration", () => {
		it("速度ゼロでは抗力もゼロ", () => {
			const v_rel: Vec3 = [0, 0, 0];
			const result = Drag.dragAcceleration(v_rel, 1.225, 1.0, 1.0, 1000);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const drag = R.getExn(result);
				expect(Vec.magnitude(drag)).toBe(0);
			}
		});

		it("抗力は速度と反対方向", () => {
			const v_rel: Vec3 = [100, 0, 0];
			const result = Drag.dragAcceleration(v_rel, 1.225, 1.0, 1.0, 1000);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const drag = R.getExn(result);
				const v_normalized = Vec.normalize(v_rel);
				const drag_normalized = Vec.normalize(drag);

				// 抗力は速度と反対方向
				expect(drag_normalized[0]).toBeCloseTo(-v_normalized[0], 10);
				expect(drag_normalized[1]).toBeCloseTo(-v_normalized[1], 10);
				expect(drag_normalized[2]).toBeCloseTo(-v_normalized[2], 10);
			}
		});

		it("抗力は速度の2乗に比例", () => {
			const v1: Vec3 = [100, 0, 0];
			const v2: Vec3 = [200, 0, 0];

			const drag1Result = Drag.dragAcceleration(v1, 1.225, 1.0, 1.0, 1000);
			const drag2Result = Drag.dragAcceleration(v2, 1.225, 1.0, 1.0, 1000);

			expect(R.isOk(drag1Result)).toBe(true);
			expect(R.isOk(drag2Result)).toBe(true);

			if (R.isOk(drag1Result) && R.isOk(drag2Result)) {
				const drag1_mag = Vec.magnitude(R.getExn(drag1Result));
				const drag2_mag = Vec.magnitude(R.getExn(drag2Result));

				// 速度が2倍なら抗力は4倍
				expect(drag2_mag).toBeCloseTo(drag1_mag * 4, 10);
			}
		});

		it("抗力は密度に比例", () => {
			const v_rel: Vec3 = [100, 0, 0];
			const drag1Result = Drag.dragAcceleration(v_rel, 1.0, 1.0, 1.0, 1000);
			const drag2Result = Drag.dragAcceleration(v_rel, 2.0, 1.0, 1.0, 1000);

			expect(R.isOk(drag1Result)).toBe(true);
			expect(R.isOk(drag2Result)).toBe(true);

			if (R.isOk(drag1Result) && R.isOk(drag2Result)) {
				const drag1_mag = Vec.magnitude(R.getExn(drag1Result));
				const drag2_mag = Vec.magnitude(R.getExn(drag2Result));

				// 密度が2倍なら抗力も2倍
				expect(drag2_mag).toBeCloseTo(drag1_mag * 2, 10);
			}
		});

		it("質量がゼロ以下はエラー", () => {
			const v_rel: Vec3 = [100, 0, 0];
			const result = Drag.dragAcceleration(v_rel, 1.225, 1.0, 1.0, 0);

			expect(R.isError(result)).toBe(true);
		});

		it("負の密度はエラー", () => {
			const v_rel: Vec3 = [100, 0, 0];
			const result = Drag.dragAcceleration(v_rel, -1, 1.0, 1.0, 1000);

			expect(R.isError(result)).toBe(true);
		});
	});

	describe("dynamicPressure", () => {
		it("速度ゼロでは動圧もゼロ", () => {
			const result = Drag.dynamicPressure(0, 1.225);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				expect(R.getExn(result)).toBe(0);
			}
		});

		it("動圧の計算式 q = ρv²/2", () => {
			const v = 100; // m/s
			const rho = 1.225; // kg/m³
			const result = Drag.dynamicPressure(v, rho);

			expect(R.isOk(result)).toBe(true);
			if (R.isOk(result)) {
				const expected = (rho * v * v) / 2;
				expect(R.getExn(result)).toBeCloseTo(expected, 10);
			}
		});

		it("動圧は速度の2乗に比例", () => {
			const q1Result = Drag.dynamicPressure(100, 1.225);
			const q2Result = Drag.dynamicPressure(200, 1.225);

			expect(R.isOk(q1Result)).toBe(true);
			expect(R.isOk(q2Result)).toBe(true);

			if (R.isOk(q1Result) && R.isOk(q2Result)) {
				// 速度が2倍なら動圧は4倍
				expect(R.getExn(q2Result)).toBeCloseTo(R.getExn(q1Result) * 4, 10);
			}
		});

		it("負の速度はエラー", () => {
			const result = Drag.dynamicPressure(-100, 1.225);

			expect(R.isError(result)).toBe(true);
		});

		it("負の密度はエラー", () => {
			const result = Drag.dynamicPressure(100, -1);

			expect(R.isError(result)).toBe(true);
		});
	});
});
