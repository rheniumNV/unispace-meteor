export type Quaternion = [number, number, number, number];

/**
 * クォータニオンをY軸で回転させる
 * @param q 元のクォータニオン [x, y, z, w]
 * @param angle 回転角度（ラジアン）
 * @returns 新しいクォータニオン [x, y, z, w]
 */
export function rotateQuatY(q: Quaternion, angle: number): Quaternion {
  const half = angle * 0.5;
  const sy = Math.sin(half);
  const cy = Math.cos(half);

  const r: Quaternion = [0, sy, 0, cy]; // Y軸回転クォータニオン

  return mulQuat(r, q);
}

/**
 * クォータニオンの掛け算 (a * b)
 * @param a 左側のクォータニオン
 * @param b 右側のクォータニオン
 * @returns 掛け算結果のクォータニオン
 */
export function mulQuat(a: Quaternion, b: Quaternion): Quaternion {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;

  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}
