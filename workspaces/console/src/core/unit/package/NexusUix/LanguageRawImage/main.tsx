import { type Unit } from "@unispace-meteor/miragex/dist/common/unitChangeEvent";
import { generateMain } from "@unispace-meteor/miragex/dist/unit/main";
import {
  StyledColorVariable,
  StyledMaterialVariable,
} from "../../../../lib/styledUnit";

import { unitConfig } from "./detail";

const Unit = generateMain(unitConfig);

export const O = (
  props: Omit<Parameters<typeof Unit>[0], "styledMaterial" | "styledColor"> & {
    styledMaterial?: StyledMaterialVariable;
    styledColor?: StyledColorVariable;
  },
) => {
  return Unit({
    ...props,
    styledMaterial: props.styledMaterial?.variableName,
    styledColor: props.styledColor?.variableName,
  });
};
