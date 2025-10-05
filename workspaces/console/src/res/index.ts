import { res } from "@unispace-meteor/miragex/dist/res";
import { generateInstallFrame } from "@unispace-meteor/miragex/dist/res/frame/installFrame";
import { Units } from "../core/unit/res";

import { config } from "./config";

res(
  {
    appCode: "PlanetaryDefenseLab",
    outputPath: __dirname,
    ...config,
    hostAccessReason: {
      ja: "PlanetaryDefenseLabを使うため",
      en: "To use PlanetaryDefenseLab",
      ko: "PlanetaryDefenseLab을 사용하기 위해",
    },
    resetOnSave: config.resetOnSave,
  },
  Units,
  generateInstallFrame,
);
