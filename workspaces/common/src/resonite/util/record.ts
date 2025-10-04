import { FAILED_UNKNOWN, Result, Success } from "../../type/result";

export const parseAssetUri = (assetUri: string): Result<string> => {
  try {
    const [_, assetId] = assetUri.match(/resdb:\/\/\/(.+).brson/) ?? [];

    if (typeof assetId === "string") {
      return Success(assetId);
    }
    return FAILED_UNKNOWN;
  } catch (e) {
    console.error("common/resonite/parseAssetUri", assetUri, e);
    return FAILED_UNKNOWN;
  }
};

export const parseCommonAssetUri = (assetUri: string): Result<string> => {
  try {
    const [_, assetId] = assetUri.match(/resdb:\/\/\/(.+)\..+/) ?? [];

    if (typeof assetId === "string") {
      return Success(assetId);
    }
    return FAILED_UNKNOWN;
  } catch (e) {
    console.error("common/resonite/parseAssetUri", assetUri, e);
    return FAILED_UNKNOWN;
  }
};

export const parseRecordLink = (
  recordLink: string,
): Result<{ ownerId: string; recordId: string }> => {
  try {
    const [_, ownerId, recordId] =
      recordLink.match(/resrec:\/\/\/(.+)\/(.+)/) ?? [];
    if (!ownerId || !recordId) {
      return FAILED_UNKNOWN;
    }
    return Success({ ownerId, recordId });
  } catch (e) {
    console.error("common/resonite/parseRecordLink", recordLink, e);
    return FAILED_UNKNOWN;
  }
};

export const generateAssetUrl = (assetId: string) =>
  `https://assets.resonite.com/${assetId}`;
