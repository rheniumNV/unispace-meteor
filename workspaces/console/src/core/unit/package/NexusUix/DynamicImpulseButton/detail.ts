import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "NexusUix/DynamicImpulseButton",
  propsConfig: {
    styledSprite: UnitProp.String(""),
    styledColor: UnitProp.String(""),
    styledMaterial: UnitProp.String(""),
    defaultColor: UnitProp.Color([1, 1, 1, 1]),
    tintColorMode: UnitProp.EnumInteractionElementColorMode("Explicit"),
    styledNormalColor: UnitProp.String(""),
    styledHighlightColor: UnitProp.String(""),
    styledPressColor: UnitProp.String(""),
    styledDisableColor: UnitProp.String(""),
    requireLockInToPress: UnitProp.Boolean(false),
    nineSliceSizing: UnitProp.EnumNineSliceSizing("TextureSize"),
    dynamicImpulseTarget: UnitProp.String(""),
    dynamicImpulsePressedTag: UnitProp.String(""),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
