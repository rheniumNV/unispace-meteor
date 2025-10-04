import { type Unit } from "@unispace-meteor/miragex/dist/common/unitChangeEvent";
import { generateMain } from "@unispace-meteor/miragex/dist/unit/main";
import {
  StyledColorVariable,
  StyledMaterialVariable,
  StyledSpriteVariable,
} from "../../../../lib/styledUnit";

import { unitConfig } from "./detail";

const Unit = generateMain(unitConfig);

export const O = (
  props: Omit<
    Parameters<typeof Unit>[0],
    | "styledColor"
    | "styledSprite"
    | "styledMaterial"
    | "styledNormalColor"
    | "styledHighlightColor"
    | "styledPressColor"
    | "styledDisableColor"
    | "styledSpriteShadow"
    | "styledMaterialShadow"
    | "styledSpriteImage"
    | "styledMaterialImage"
  > & {
    styledColor?: StyledColorVariable;
    styledSprite?: StyledSpriteVariable;
    styledMaterial?: StyledMaterialVariable;
    styledNormalColor?: StyledColorVariable;
    styledHighlightColor?: StyledColorVariable;
    styledPressColor?: StyledColorVariable;
    styledDisableColor?: StyledColorVariable;
    styledSpriteShadow?: StyledSpriteVariable;
    styledMaterialShadow?: StyledMaterialVariable;
    styledSpriteImage?: StyledSpriteVariable;
    styledMaterialImage?: StyledMaterialVariable;
  },
) => {
  return Unit({
    ...props,
    styledColor: props.styledColor?.variableName,
    styledSprite: props.styledSprite?.variableName,
    styledMaterial: props.styledMaterial?.variableName,
    styledNormalColor: props.styledNormalColor?.variableName,
    styledHighlightColor: props.styledHighlightColor?.variableName,
    styledPressColor: props.styledPressColor?.variableName,
    styledDisableColor: props.styledDisableColor?.variableName,
    styledSpriteShadow: props.styledSpriteShadow?.variableName,
    styledMaterialShadow: props.styledMaterialShadow?.variableName,
    styledSpriteImage: props.styledSpriteImage?.variableName,
    styledMaterialImage: props.styledMaterialImage?.variableName,
  });
};
