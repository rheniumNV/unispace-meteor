import { type Unit } from "@unispace-meteor/miragex/dist/common/unitChangeEvent";
import { generateMain } from "@unispace-meteor/miragex/dist/unit/main";
import {
  StyledSpriteVariable,
  StyledFontVariable,
  StyledMaterialVariable,
} from "../../../../lib/styledUnit";

import { unitConfig } from "./detail";

const Unit = generateMain(unitConfig);

export const O = (
  props: Omit<
    Parameters<typeof Unit>[0],
    | "styledFont"
    | "styledSprite"
    | "styledMaterial"
    | "styledSpriteShadow"
    | "styledMaterialShadow"
  > & {
    styledFont?: StyledFontVariable;
    styledSprite?: StyledSpriteVariable;
    styledMaterial?: StyledMaterialVariable;
    styledSpriteShadow?: StyledSpriteVariable;
    styledMaterialShadow?: StyledMaterialVariable;
  },
) => {
  return Unit({
    ...props,
    styledFont: props.styledFont?.variableName,
    styledSprite: props.styledSprite?.variableName,
    styledMaterial: props.styledMaterial?.variableName,
    styledSpriteShadow: props.styledSpriteShadow?.variableName,
    styledMaterialShadow: props.styledMaterialShadow?.variableName,
  });
};
