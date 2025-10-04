import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "NexusUix/OverlayView",
  propsConfig: {
    styledSprite: UnitProp.String(""),
    styledMaterial: UnitProp.String(""),
    styledFalseColor: UnitProp.String(""),
    styledTrueColor: UnitProp.String(""),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
