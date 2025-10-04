import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "StyledUix/StyledRawImage",
  propsConfig: {
    url: UnitProp.Uri(""),
    preserveAspect: UnitProp.Boolean(false),
    interactionTarget: UnitProp.Boolean(true),
    styledMaterial: UnitProp.String(""),
    styledColor: UnitProp.String(""),
    defaultColor: UnitProp.Color([1, 1, 1, 1]),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
