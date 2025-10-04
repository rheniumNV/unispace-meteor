import { type Unit } from "@unispace-meteor/miragex/dist/common/unitChangeEvent";
import { generateMain } from "@unispace-meteor/miragex/dist/unit/main";
import {
  StyledColorVariable,
  StyledSpriteVariable,
  StyledMaterialVariable,
} from "../../../../lib/styledUnit";

import { unitConfig } from "./detail";

const Unit = generateMain(unitConfig);

export const O = (
  props: Omit<
    Parameters<typeof Unit>[0],
    | "styledColor"
    | "styledSprite"
    | "styledMaterial"
    | "styledMaterialActive"
    | "styledSpriteActive"
    | "styledNormalColor"
    | "styledHighlightColor"
    | "styledPressColor"
    | "styledDisableColor"
  > & {
    styledColor?: StyledColorVariable;
    styledSprite?: StyledSpriteVariable;
    styledMaterial?: StyledMaterialVariable;
    styledMaterialActive?: StyledMaterialVariable;
    styledSpriteActive?: StyledSpriteVariable;
    styledNormalColor?: StyledColorVariable;
    styledHighlightColor?: StyledColorVariable;
    styledPressColor?: StyledColorVariable;
    styledDisableColor?: StyledColorVariable;
  },
) => {
  return Unit({
    ...props,
    styledColor: props.styledColor?.variableName,
    styledSprite: props.styledSprite?.variableName,
    styledMaterial: props.styledMaterial?.variableName,
    styledMaterialActive: props.styledMaterialActive?.variableName,
    styledSpriteActive: props.styledSpriteActive?.variableName,
    styledNormalColor: props.styledNormalColor?.variableName,
    styledHighlightColor: props.styledHighlightColor?.variableName,
    styledPressColor: props.styledPressColor?.variableName,
    styledDisableColor: props.styledDisableColor?.variableName,
  });
};
