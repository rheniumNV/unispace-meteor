/**
 * ベクトル演算ユーティリティ
 */

import type { Vec3 } from "../../types/input";

/** ベクトルの大きさ */
export const magnitude = (v: Vec3): number => {
	const [x, y, z] = v;
	return Math.sqrt(x * x + y * y + z * z);
};

/** ベクトルの正規化 */
export const normalize = (v: Vec3): Vec3 => {
	const mag = magnitude(v);
	if (mag === 0) return [0, 0, 0];
	return [v[0] / mag, v[1] / mag, v[2] / mag];
};

/** ベクトルの加算 */
export const add = (a: Vec3, b: Vec3): Vec3 => {
	return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
};

/** ベクトルの減算 */
export const subtract = (a: Vec3, b: Vec3): Vec3 => {
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
};

/** ベクトルのスカラー倍 */
export const scale = (v: Vec3, s: number): Vec3 => {
	return [v[0] * s, v[1] * s, v[2] * s];
};

/** 内積 */
export const dot = (a: Vec3, b: Vec3): number => {
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/** 外積 */
export const cross = (a: Vec3, b: Vec3): Vec3 => {
	return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
};
