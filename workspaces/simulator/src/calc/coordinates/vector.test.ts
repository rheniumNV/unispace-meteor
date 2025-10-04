import { describe, expect, it } from "vitest";
import type { Vec3 } from "../../types/input";
import * as Vec from "./vector";

describe("ベクトル演算", () => {
	describe("magnitude", () => {
		it("ゼロベクトルの大きさは0", () => {
			const v: Vec3 = [0, 0, 0];
			expect(Vec.magnitude(v)).toBe(0);
		});

		it("単位ベクトルの大きさは1", () => {
			const v: Vec3 = [1, 0, 0];
			expect(Vec.magnitude(v)).toBe(1);
		});

		it("3-4-5の直角三角形は5", () => {
			const v: Vec3 = [3, 4, 0];
			expect(Vec.magnitude(v)).toBe(5);
		});

		it("3次元ベクトルの大きさ", () => {
			const v: Vec3 = [1, 2, 2];
			expect(Vec.magnitude(v)).toBe(3);
		});
	});

	describe("normalize", () => {
		it("単位ベクトルは正規化しても同じ", () => {
			const v: Vec3 = [1, 0, 0];
			const result = Vec.normalize(v);
			expect(result).toEqual([1, 0, 0]);
		});

		it("ベクトルを正規化すると大きさが1になる", () => {
			const v: Vec3 = [3, 4, 0];
			const result = Vec.normalize(v);
			expect(Vec.magnitude(result)).toBeCloseTo(1, 10);
		});

		it("ゼロベクトルを正規化するとゼロベクトル", () => {
			const v: Vec3 = [0, 0, 0];
			const result = Vec.normalize(v);
			expect(result).toEqual([0, 0, 0]);
		});
	});

	describe("add", () => {
		it("ベクトルの加算", () => {
			const a: Vec3 = [1, 2, 3];
			const b: Vec3 = [4, 5, 6];
			const result = Vec.add(a, b);
			expect(result).toEqual([5, 7, 9]);
		});

		it("ゼロベクトルを加算しても同じ", () => {
			const a: Vec3 = [1, 2, 3];
			const b: Vec3 = [0, 0, 0];
			const result = Vec.add(a, b);
			expect(result).toEqual([1, 2, 3]);
		});
	});

	describe("subtract", () => {
		it("ベクトルの減算", () => {
			const a: Vec3 = [5, 7, 9];
			const b: Vec3 = [1, 2, 3];
			const result = Vec.subtract(a, b);
			expect(result).toEqual([4, 5, 6]);
		});

		it("同じベクトルを引くとゼロベクトル", () => {
			const a: Vec3 = [1, 2, 3];
			const result = Vec.subtract(a, a);
			expect(result).toEqual([0, 0, 0]);
		});
	});

	describe("scale", () => {
		it("スカラー倍", () => {
			const v: Vec3 = [1, 2, 3];
			const result = Vec.scale(v, 2);
			expect(result).toEqual([2, 4, 6]);
		});

		it("0倍するとゼロベクトル", () => {
			const v: Vec3 = [1, 2, 3];
			const result = Vec.scale(v, 0);
			expect(result).toEqual([0, 0, 0]);
		});

		it("負のスカラー倍", () => {
			const v: Vec3 = [1, 2, 3];
			const result = Vec.scale(v, -1);
			expect(result).toEqual([-1, -2, -3]);
		});
	});

	describe("dot", () => {
		it("直交ベクトルの内積は0", () => {
			const a: Vec3 = [1, 0, 0];
			const b: Vec3 = [0, 1, 0];
			expect(Vec.dot(a, b)).toBe(0);
		});

		it("同じ単位ベクトルの内積は1", () => {
			const a: Vec3 = [1, 0, 0];
			expect(Vec.dot(a, a)).toBe(1);
		});

		it("反対方向のベクトルの内積は負", () => {
			const a: Vec3 = [1, 0, 0];
			const b: Vec3 = [-1, 0, 0];
			expect(Vec.dot(a, b)).toBe(-1);
		});

		it("一般的な内積計算", () => {
			const a: Vec3 = [1, 2, 3];
			const b: Vec3 = [4, 5, 6];
			expect(Vec.dot(a, b)).toBe(32); // 1*4 + 2*5 + 3*6 = 32
		});
	});

	describe("cross", () => {
		it("X軸とY軸の外積はZ軸", () => {
			const x: Vec3 = [1, 0, 0];
			const y: Vec3 = [0, 1, 0];
			const result = Vec.cross(x, y);
			expect(result).toEqual([0, 0, 1]);
		});

		it("Y軸とZ軸の外積はX軸", () => {
			const y: Vec3 = [0, 1, 0];
			const z: Vec3 = [0, 0, 1];
			const result = Vec.cross(y, z);
			expect(result).toEqual([1, 0, 0]);
		});

		it("Z軸とX軸の外積はY軸", () => {
			const z: Vec3 = [0, 0, 1];
			const x: Vec3 = [1, 0, 0];
			const result = Vec.cross(z, x);
			expect(result).toEqual([0, 1, 0]);
		});

		it("同じベクトルの外積はゼロベクトル", () => {
			const v: Vec3 = [1, 2, 3];
			const result = Vec.cross(v, v);
			expect(result).toEqual([0, 0, 0]);
		});

		it("外積は反交換的", () => {
			const a: Vec3 = [1, 2, 3];
			const b: Vec3 = [4, 5, 6];
			const ab = Vec.cross(a, b);
			const ba = Vec.cross(b, a);
			expect(ab).toEqual(Vec.scale(ba, -1));
		});
	});
});
