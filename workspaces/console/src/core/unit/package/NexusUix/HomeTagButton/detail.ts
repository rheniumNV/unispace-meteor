import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import {
  DetailBase,
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "NexusUix/HomeTagButton",
  propsConfig: {
    onClick: UnitProp.Function((_env: FunctionEnv) => {}),
    styledSprite: UnitProp.String(""),
    styledMaterial: UnitProp.String(""),
    styledShadowSprite: UnitProp.String(""),
    styledShadowMaterial: UnitProp.String(""),
    styledActiveSprite: UnitProp.String(""),
    styledActiveMaterial: UnitProp.String(""),
  },
  children: "multi",
} as const satisfies DetailBase;

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
