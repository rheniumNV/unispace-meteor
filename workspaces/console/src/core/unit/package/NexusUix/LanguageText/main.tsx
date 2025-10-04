import { type Unit } from "@unispace-meteor/miragex/dist/common/unitChangeEvent";
import { generateMain } from "@unispace-meteor/miragex/dist/unit/main";
import {
  StyledColorVariable,
  StyledFontVariable,
  StyledMaterialVariable,
} from "../../../../lib/styledUnit";

import { unitConfig } from "./detail";

const Unit = generateMain(unitConfig);

export const O = (
  props: Omit<
    Parameters<typeof Unit>[0],
    "styledFont" | "styledColor" | "styledMaterial"
  > & {
    styledFont?: StyledFontVariable;
    styledColor?: StyledColorVariable;
    styledMaterial?: StyledMaterialVariable;
  },
) => {
  return Unit({
    ...props,
    styledFont: props.styledFont?.variableName,
    styledColor: props.styledColor?.variableName,
    styledMaterial: props.styledMaterial?.variableName,
  });
};
