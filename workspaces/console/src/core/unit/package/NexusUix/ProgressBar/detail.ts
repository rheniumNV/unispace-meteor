import {
  DetailBase,
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "NexusUix/ProgressBar",
  propsConfig: {
    textSize: UnitProp.Float(32),
    styledFont: UnitProp.String(""),
    styledSprite: UnitProp.String(""),
    styledSpriteInnerShadow: UnitProp.String(""),
    styledMaterial: UnitProp.String(""),
    styledTextMaterial: UnitProp.String(""),
    styledColorInnerShadow: UnitProp.String(""),
    styledTextColor: UnitProp.String(""),
    styledTextColorRev: UnitProp.String(""),
    limitOffsetMax: UnitProp.Float2([200, -10]),
    limitOffsetMin: UnitProp.Float2([30, 10]),
    currentOffsetMax: UnitProp.Float2([-30, -10]),
    currentOffsetMin: UnitProp.Float2([-200, 10]),
    preferredHeight: UnitProp.Float(72),
    preferredWidth: UnitProp.Float(620),
    range: UnitProp.Float2([0, 1000]),
    count: UnitProp.Float(0),
  },
  children: "multi",
} as const satisfies DetailBase;

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
