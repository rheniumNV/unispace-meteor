import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "NexusUix/LanguageText",
  propsConfig: {
    styledFont: UnitProp.String(""),
    contentEn: UnitProp.String(""),
    contentJa: UnitProp.String(""),
    contentKo: UnitProp.String(""),
    size: UnitProp.Float(64),
    styledColor: UnitProp.String(""),
    styledMaterial: UnitProp.String(""),
    defaultColor: UnitProp.Color([0, 0, 0, 1]),
    nullContent: UnitProp.String(""),
    lineHeight: UnitProp.Float(0.8),
    horizontalAutoSize: UnitProp.Boolean(false),
    verticalAutoSize: UnitProp.Boolean(false),
    horizontalAlign: UnitProp.EnumTextHorizontalAlignment("Left"),
    verticalAlign: UnitProp.EnumTextVerticalAlignment("Top"),
    autoSizeMin: UnitProp.Float(8),
    autoSizeMax: UnitProp.Float(64),
    anchorMin: UnitProp.Float2([0, 0]),
    anchorMax: UnitProp.Float2([1, 1]),
    offsetMin: UnitProp.Float2([0, 0]),
    offsetMax: UnitProp.Float2([0, 0]),
  },
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
