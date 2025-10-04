import { generateResUnitFromFeedback } from "@unispace-meteor/miragex/dist/unit/res";

import ResFeedback from "./ResFeedback.json";
import { unitConfig } from "./detail";

export const res = generateResUnitFromFeedback({
  config: unitConfig,
  rawFeedback: ResFeedback,
});
