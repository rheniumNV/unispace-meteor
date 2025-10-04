/**
 * NASA JPL SBDB Close Approach Data API の型定義
 * https://ssd-api.jpl.nasa.gov/doc/cad.html
 */

/** API レスポンスの署名情報 */
export interface CADSignature {
	readonly source: string;
	readonly version: string;
}

/** API レスポンス全体 */
export interface CADResponse {
	readonly signature: CADSignature;
	/** 結果の総数 */
	readonly count: number;
	/** データフィールド名のリスト */
	readonly fields: readonly string[];
	/** 各接近イベントのデータ配列（fieldsの順序に対応） */
	readonly data: readonly (readonly (string | number)[])[];
}

/** 接近データの構造化された形式 */
export interface CloseApproachData {
	/** 小惑星の識別番号 */
	readonly designation: string;
	/** 軌道ID */
	readonly orbitId: string;
	/** 接近日時（ユリウス日） */
	readonly julianDate: number;
	/** 接近日時（カレンダー形式、例: "2028-Jun-26 05:23"） */
	readonly calendarDate: string;
	/** 接近距離 [AU] */
	readonly distanceAu: number;
	/** 地球に対する相対速度 [km/s] */
	readonly relativeVelocityKmS: number;
	/** 絶対等級 [mag] */
	readonly absoluteMagnitude: number;
	/** 直径 [km]（存在する場合） */
	readonly diameterKm: number | null;
	/** フルネーム */
	readonly fullname: string;
}

/** CAD API クエリパラメータ */
export interface CADQueryParams {
	/** 地球接近天体のみに絞る */
	readonly neo?: boolean;
	/** 接近対象の天体名（デフォルト: "Earth"） */
	readonly body?: string;
	/** 最大接近距離 [AU]（デフォルト: 0.05） */
	readonly distMax?: number;
	/** 潜在的に危険な小惑星のみに絞る */
	readonly pha?: boolean;
	/** フルネームを含める */
	readonly fullname?: boolean;
	/** 取得するデータフィールドのリスト */
	readonly fields?: readonly string[];
	/** 接近日の開始日（YYYY-MM-DD形式） */
	readonly dateMin?: string;
	/** 接近日の終了日（YYYY-MM-DD形式） */
	readonly dateMax?: string;
}
