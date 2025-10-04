import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "NexusUix/SwitcRect",
  propsConfig: {
    switchState: UnitProp.Int(0),
    valueItemFloat: UnitProp.Float2([0, 0]),
    offsetMin: UnitProp.Float2([0, 0]),
    offsetMax: UnitProp.Float2([0, 0]),
    shadowOffsetMin: UnitProp.Float2([0, 0]),
    shadowOffsetMax: UnitProp.Float2([0, 0]),
    styledSprite: UnitProp.String(""),
    styledMaterial: UnitProp.String(""),
    styledSpriteShadow: UnitProp.String(""),
    styledMaterialShadow: UnitProp.String(""),
    styledColor: UnitProp.String(""),
    defaultColor: UnitProp.Color([1, 1, 1, 1]),
    nineSliceSizing: UnitProp.EnumNineSliceSizing("TextureSize"),
    preserveAspect: UnitProp.Boolean(true),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
