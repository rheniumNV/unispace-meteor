import { type Unit } from "@unispace-meteor/miragex/dist/common/unitChangeEvent";
import { generateMain } from "@unispace-meteor/miragex/dist/unit/main";
import {
  StyledMaterialVariable,
  StyledSpriteVariable,
} from "../../../../lib/styledUnit";

import { unitConfig } from "./detail";

const Unit = generateMain(unitConfig);

export const O = (
  props: Omit<
    Parameters<typeof Unit>[0],
    | "styledSprite"
    | "styledMaterial"
    | "styledShadowSprite"
    | "styledShadowMaterial"
    | "styledActiveSprite"
    | "styledActiveMaterial"
  > & {
    styledSprite?: StyledSpriteVariable;
    styledMaterial?: StyledMaterialVariable;
    styledShadowSprite?: StyledSpriteVariable;
    styledShadowMaterial?: StyledMaterialVariable;
    styledActiveSprite?: StyledSpriteVariable;
    styledActiveMaterial?: StyledMaterialVariable;
  },
) => {
  return Unit({
    ...props,
    styledSprite: props.styledSprite?.variableName,
    styledMaterial: props.styledMaterial?.variableName,
    styledShadowSprite: props.styledShadowSprite?.variableName,
    styledShadowMaterial: props.styledShadowMaterial?.variableName,
    styledActiveSprite: props.styledActiveSprite?.variableName,
    styledActiveMaterial: props.styledActiveMaterial?.variableName,
  });
};
