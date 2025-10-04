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
    | "styledSprite"
    | "styledMaterial"
    | "styledSpriteShadow"
    | "styledMaterialShadow"
    | "styledColor"
  > & {
    styledSprite?: StyledSpriteVariable;
    styledMaterial?: StyledMaterialVariable;
    styledSpriteShadow?: StyledSpriteVariable;
    styledMaterialShadow?: StyledMaterialVariable;
    styledColor?: StyledColorVariable;
  },
) => {
  return Unit({
    ...props,
    styledSprite: props.styledSprite?.variableName,
    styledMaterial: props.styledMaterial?.variableName,
    styledSpriteShadow: props.styledSpriteShadow?.variableName,
    styledMaterialShadow: props.styledMaterialShadow?.variableName,
    styledColor: props.styledColor?.variableName,
  });
};
