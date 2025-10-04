/**
 * 指定した時間だけ処理を一時停止します。
 *
 * @param ms - 待機する時間（ミリ秒）
 * @returns 指定時間後に解決するPromise
 *
 * @example
 * // 2秒間待機する
 * await sleep(2000);
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
