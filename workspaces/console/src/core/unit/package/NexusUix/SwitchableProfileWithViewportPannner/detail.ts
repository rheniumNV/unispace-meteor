import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "NexusUix/SwitchableProfileWithViewportPannner",
  propsConfig: {
    viewpointIndex: UnitProp.Int(0),
    animationTime: UnitProp.Float(0.25),
    content: UnitProp.String(""),
    styledFont: UnitProp.String(""),
    defaultTextColor: UnitProp.Color([0, 0, 0, 1]),
    styledSprite: UnitProp.String(""),
    styledMaterial: UnitProp.String(""),
    styledSpriteShadow: UnitProp.String(""),
    styledMaterialShadow: UnitProp.String(""),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
