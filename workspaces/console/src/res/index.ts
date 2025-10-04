import { res } from "@unispace-meteor/miragex/dist/res";
import { generateInstallFrame } from "@unispace-meteor/miragex/dist/res/frame/installFrame";
import { Units } from "../core/unit/res";

import { config } from "./config";

res(
  {
    appCode: "UniPocket",
    outputPath: __dirname,
    ...config,
    hostAccessReason: {
      ja: "UniPocketを使うため",
      en: "To use UniPocket",
      ko: "UniPocket을 사용하기 위해",
    },
    resetOnSave: config.resetOnSave,
  },
  Units,
  generateInstallFrame,
);
