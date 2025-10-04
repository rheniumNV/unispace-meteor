import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "NexusUix/TabSelectActive",
  propsConfig: {
    switchState: UnitProp.Int(0),
    valueItemFloat: UnitProp.Float2([0, 0]),
    offsetMin: UnitProp.Float2([0, 0]),
    offsetMax: UnitProp.Float2([0, 0]),
    styledSprite: UnitProp.String(""),
    styledMaterial: UnitProp.String(""),
    defaultColor: UnitProp.Color([1, 1, 1, 1]),
    styledSpriteShadow: UnitProp.String(""),
    styledMaterialShadow: UnitProp.String(""),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
