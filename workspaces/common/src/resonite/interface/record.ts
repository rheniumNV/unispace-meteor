import axios from "axios";
import { DeCompress } from "brson.js";
import {
  FAILED_NOT_FOUND,
  FAILED_UNKNOWN,
  Result,
  Success,
} from "../../type/result";
import { ResoniteRecord, ResoniteRecordSchema } from "../model/record";
import { parseRecordLink } from "../util/record";

export const getResoniteRecord = async (
  ownerId: string,
  recordId: string,
): Promise<Result<ResoniteRecord, typeof FAILED_NOT_FOUND>> => {
  const ownerType = ownerId.startsWith("U-") ? "users" : "groups";

  const { status, data } = await axios.get<unknown>(
    `https://api.resonite.com/${ownerType}/${ownerId}/records/${recordId}`,
    {
      validateStatus: () => true,
    },
  );

  if (status === 404) {
    return FAILED_NOT_FOUND;
  }

  if (status === 200) {
    const record = ResoniteRecordSchema.safeParse(data);

    if (!record.success) {
      console.warn(
        "common/resonite/getRecord",
        ownerId,
        recordId,
        record.error,
      );
      return FAILED_UNKNOWN;
    }
    return Success(record.data);
  }

  console.warn("common/resonite/getRecord", ownerId, recordId, status);
  return FAILED_UNKNOWN;
};

export const getResoniteRecordFromLink = async (
  recordLink: string,
): Promise<Result<ResoniteRecord, typeof FAILED_NOT_FOUND>> => {
  const parseRecordLinkResult = parseRecordLink(recordLink);

  if (parseRecordLinkResult.status === "FAILED") {
    return FAILED_UNKNOWN;
  }

  const { ownerId, recordId } = parseRecordLinkResult.data;

  return getResoniteRecord(ownerId, recordId);
};

export const getResoniteBrson = async (
  assetId: string,
): Promise<Result<Buffer>> => {
  try {
    const { data } = await axios.get(`https://assets.resonite.com/${assetId}`, {
      responseType: "arraybuffer",
    });

    return Success(data as Buffer);
  } catch (e) {
    console.warn("common/resonite/getBrson", assetId, e);
    return FAILED_UNKNOWN;
  }
};

export const getResoniteJson = async (
  assetId: string,
): Promise<Result<string>> => {
  try {
    const { data } = await axios.get(`https://assets.resonite.com/${assetId}`, {
      responseType: "arraybuffer",
    });

    return Success(DeCompress(data));
  } catch (e) {
    console.warn("common/resonite/getJson", assetId, e);
    return FAILED_UNKNOWN;
  }
};
