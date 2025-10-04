import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "NexusUix/OverlayCloudSpawnButton",
  propsConfig: {
    url: UnitProp.Uri(""),
    title: UnitProp.String(""),
    styledSprite: UnitProp.String(""),
    styledColor: UnitProp.String(""),
    styledMaterial: UnitProp.String(""),
    defaultColor: UnitProp.Color([1, 1, 1, 1]),
    tintColorMode: UnitProp.EnumInteractionElementColorMode("Explicit"),
    styledNormalColor: UnitProp.String(""),
    styledHighlightColor: UnitProp.String(""),
    styledPressColor: UnitProp.String(""),
    styledDisableColor: UnitProp.String(""),
    onClick: UnitProp.Function((_env: FunctionEnv) => {}),
    requireLockInToPress: UnitProp.Boolean(false),
    nineSliceSizing: UnitProp.EnumNineSliceSizing("TextureSize"),
    styledSpriteShadow: UnitProp.String(""),
    styledMaterialShadow: UnitProp.String(""),
    styledSpriteImage: UnitProp.String(""),
    styledMaterialImage: UnitProp.String(""),
    anchorMinImage: UnitProp.Float2([0, 0]),
    anchorMaxImage: UnitProp.Float2([1, 1]),
    offsetMinImage: UnitProp.Float2([0, 0]),
    offsetMaxImage: UnitProp.Float2([0, 0]),
    offsetMinShadow: UnitProp.Float2([0, 0]),
    offsetMaxShadow: UnitProp.Float2([0, 0]),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
