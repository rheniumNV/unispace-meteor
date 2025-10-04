import { FAILED_UNKNOWN, FailedResult, Result, Success } from "../type/result";

export const safeParse = <T>(json: string): T | null => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const safeTry = async <
  R extends Awaited<unknown>,
  F extends FailedResult<
    string,
    null | string | { [key: string]: unknown }
  > = never,
>(
  fn: () => R,
  error?: (e: unknown) => F,
): Promise<Result<Awaited<R>, F>> => {
  try {
    return Success(await fn());
  } catch (e) {
    if (error) {
      return error(e);
    }
    return FAILED_UNKNOWN;
  }
};

export const unique = <T>(array: T[], getKey: (v: T) => string): T[] => {
  const map = new Map<string, T>();
  array.forEach((item) => {
    map.set(getKey(item), item);
  });
  return Array.from(map.values());
};

export const filterNull = <T>(array: (T | null)[]): T[] => {
  return array.filter((item): item is T => item !== null);
};

export const groupBy = <T>(
  array: T[],
  func: (arg: T) => string,
): { key: string; data: T[] }[] => {
  const map: { [key: string]: T[] } = {};
  array.forEach((item) => {
    const key = func(item);
    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(item);
  });
  return Object.entries(map).map(([key, data]) => ({ key, data }));
};

export const groupByCustom = <T extends { [key: string]: unknown }, X>(
  array: T[],
  getKey: (arg: T) => string,
  format: (first: T, list: T[]) => X,
): X[] => {
  const map: { [key: string]: T[] } = {};
  array.forEach((item) => {
    const key = getKey(item);
    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(item);
  });
  return Object.entries(map)
    .map(([, data]) => (data[0] ? format(data[0], data) : null))
    .filter((item) => item !== null);
};

export const shuffle = <T>(arr: T[]) =>
  arr.sort(() => Math.random() - Math.random());
