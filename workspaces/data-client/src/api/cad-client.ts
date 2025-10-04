/**
 * NASA JPL SBDB Close Approach Data API クライアント
 */

import type { CADQueryParams, CADResponse, CloseApproachData } from "../types/cad-api";

/** CAD API のベースURL */
const CAD_API_BASE_URL = "https://ssd-api.jpl.nasa.gov/cad.api";

/**
 * クエリパラメータをURL文字列に変換
 */
const buildQueryString = (params: CADQueryParams): string => {
	const entries: [string, string][] = [];

	if (params.neo !== undefined) {
		entries.push(["neo", params.neo.toString()]);
	}
	if (params.body !== undefined) {
		entries.push(["body", params.body]);
	}
	if (params.distMax !== undefined) {
		entries.push(["dist-max", params.distMax.toString()]);
	}
	if (params.pha !== undefined) {
		entries.push(["pha", params.pha.toString()]);
	}
	if (params.fullname !== undefined) {
		entries.push(["fullname", params.fullname.toString()]);
	}
	if (params.dateMin !== undefined) {
		entries.push(["date-min", params.dateMin]);
	}
	if (params.dateMax !== undefined) {
		entries.push(["date-max", params.dateMax]);
	}

	return new URLSearchParams(entries).toString();
};

/**
 * フィールドのインデックスを見つける
 */
const findFieldIndex = (fields: readonly string[], name: string): number => {
	const index = fields.indexOf(name);
	if (index === -1) {
		throw new Error(`フィールド "${name}" が見つかりません`);
	}
	return index;
};

/**
 * APIレスポンスのdata配列をCloseApproachDataに変換
 */
const parseDataRow = (
	fields: readonly string[],
	row: readonly (string | number)[],
): CloseApproachData => {
	const desIndex = findFieldIndex(fields, "des");
	const orbitIdIndex = findFieldIndex(fields, "orbit_id");
	const jdIndex = findFieldIndex(fields, "jd");
	const cdIndex = findFieldIndex(fields, "cd");
	const distIndex = findFieldIndex(fields, "dist");
	const vRelIndex = findFieldIndex(fields, "v_rel");
	const hIndex = findFieldIndex(fields, "h");
	const fullnameIndex = findFieldIndex(fields, "fullname");

	// diameterはオプショナル
	let diameterIndex = -1;
	try {
		diameterIndex = findFieldIndex(fields, "diameter");
	} catch {
		// diameterフィールドが存在しない場合は無視
	}

	const data: CloseApproachData = {
		designation: String(row[desIndex] ?? ""),
		orbitId: String(row[orbitIdIndex] ?? ""),
		julianDate: Number(row[jdIndex] ?? 0),
		calendarDate: String(row[cdIndex] ?? ""),
		distanceAu: Number(row[distIndex] ?? 0),
		relativeVelocityKmS: Number(row[vRelIndex] ?? 0),
		absoluteMagnitude: Number(row[hIndex] ?? 0),
		diameterKm: diameterIndex !== -1 ? Number(row[diameterIndex] ?? null) : null,
		fullname: String(row[fullnameIndex] ?? ""),
	};

	return data;
};

/**
 * CAD APIから地球接近小惑星データを取得
 */
export const fetchCloseApproaches = async (
	params: CADQueryParams = {},
): Promise<CloseApproachData[]> => {
	// デフォルトパラメータ
	const queryParams: CADQueryParams = {
		neo: true,
		body: "Earth",
		distMax: 0.05,
		fullname: true,
		...params,
	};

	const queryString = buildQueryString(queryParams);
	const url = `${CAD_API_BASE_URL}?${queryString}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`API呼び出しに失敗: ${response.status} ${response.statusText}`);
	}

	const json: CADResponse = (await response.json()) as CADResponse;

	// 各データ行をパース
	const data = json.data.map((row) => parseDataRow(json.fields, row));

	return data;
};
