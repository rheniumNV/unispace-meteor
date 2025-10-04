import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "NexusUix/AnchorButton",
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
    styledSpriteFill: UnitProp.String(""),
    styledAnchoredColor: UnitProp.String(""),
    defaultAnchoredColor: UnitProp.Color([1, 1, 1, 1]),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
