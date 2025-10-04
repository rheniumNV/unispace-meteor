import { generateMain } from "@unispace-meteor/miragex/dist/unit/main";
import {
  StyledColorVariable,
  StyledFontVariable,
  StyledMaterialVariable,
  StyledSpriteVariable,
} from "../../../../lib/styledUnit";

import { unitConfig } from "./detail";

const Unit = generateMain(unitConfig);

export const O = (
  props: Omit<
    Parameters<typeof Unit>[0],
    | "styledFont"
    | "styledColorInnerShadow"
    | "styledTextColor"
    | "styledTextColorRev"
    | "styledMaterial"
    | "styledTextMaterial"
    | "styledSprite"
    | "styledSpriteInnerShadow"
  > & {
    styledFont?: StyledFontVariable;
    styledColorInnerShadow?: StyledColorVariable;
    styledTextColor?: StyledColorVariable;
    styledTextColorRev?: StyledColorVariable;
    styledMaterial?: StyledMaterialVariable;
    styledTextMaterial?: StyledMaterialVariable;
    styledSprite?: StyledSpriteVariable;
    styledSpriteInnerShadow?: StyledSpriteVariable;
  },
) => {
  return Unit({
    ...props,
    styledFont: props.styledFont?.variableName,
    styledColorInnerShadow: props.styledColorInnerShadow?.variableName,
    styledTextColor: props.styledTextColor?.variableName,
    styledTextColorRev: props.styledTextColorRev?.variableName,
    styledMaterial: props.styledMaterial?.variableName,
    styledTextMaterial: props.styledTextMaterial?.variableName,
    styledSprite: props.styledSprite?.variableName,
    styledSpriteInnerShadow: props.styledSpriteInnerShadow?.variableName,
  });
};
