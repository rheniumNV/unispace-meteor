import axios, { isAxiosError } from "axios";
import { Failed, FailedResult, Result, Success } from "../type/result";

type Language = "en" | "ja" | "ko";

const translationUrl =
  "https://script.google.com/macros/s/AKfycbzPbuTuGqccrRFdBLsR0YaHN0frGzTBxv1A-UHBRQWQz89LYs99CEgqaUU1DlYsi668/exec";

type TranslationError =
  | "API_ERROR"
  | "NETWORK_ERROR"
  | "INVALID_RESPONSE"
  | "UNKNOWN_ERROR";

export const translate = async (
  text: string,
  source: Language,
): Promise<
  Result<
    { lang: Language; text: string }[],
    FailedResult<TranslationError, null>
  >
> => {
  try {
    const response = await axios.get(
      `${translationUrl}?text=${encodeURIComponent(text)}&source=${source}`,
    );
    if (!Array.isArray(response.data)) {
      return Failed("INVALID_RESPONSE", null);
    }
    return Success(response.data);
  } catch (e) {
    console.error("Translation error:", e);
    if (isAxiosError(e)) {
      if (e.response) {
        // サーバーからのレスポンスがあるが、ステータスコードが2xx範囲外
        return Failed("API_ERROR", null);
      } else if (e.request) {
        // リクエストは作成されたが、レスポンスが受信されなかった
        return Failed("NETWORK_ERROR", null);
      }
    }
    // その他のエラー（リクエスト設定エラーなど）
    return Failed("UNKNOWN_ERROR", null);
  }
};
