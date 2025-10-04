import { convertRawFeedback } from "./convertRawFeedback";
import { getJson, getRecords, pickLatestObject } from "./util";
import fs, { readFileSync } from "fs";
import path from "path";

export const fetchFeedback = async (option: {
  link: string;
  outputPath: string;
}) => {
  const prevInfo = (() => {
    try {
      return JSON.parse(
        readFileSync(
          path.resolve(option.outputPath, "./ResFeedbackMetaOriginal.json"),
          "utf-8",
        ),
      );
    } catch {
      return {};
    }
  })();

  const records = await getRecords(option.link);
  const latestObject = await pickLatestObject(records);
  if (!latestObject) {
    console.info("not found feedback");
    return;
  }
  if (latestObject.id === prevInfo?.id) {
    console.info(
      "no new feedback",
      `latestFeedbackTime=${latestObject.creationTime}`,
    );
    return;
  }
  const rawJson = await getJson(latestObject.assetUri);

  const json = convertRawFeedback(JSON.parse(rawJson));

  if (json) {
    fs.writeFileSync(
      path.resolve(option.outputPath, "./ResFeedbackOriginal.json"),
      json,
    );
    fs.writeFileSync(
      path.resolve(option.outputPath, "./ResFeedbackMetaOriginal.json"),
      JSON.stringify({
        id: latestObject.id,
        creationTime: latestObject.creationTime,
      }),
    );
    console.info(
      "updated ",
      `${prevInfo?.creationTime} --> ${latestObject.creationTime}`,
    );
  } else {
    new Error("no json error");
  }
};
