import {
  DetailBase,
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "NexusUix/ImageWithAnimation",
  propsConfig: {
    url: UnitProp.Uri(""),
    preserveAspect: UnitProp.Boolean(false),
    nineSliceSizing: UnitProp.EnumNineSliceSizing("TextureSize"),
    styledColor: UnitProp.String(""),
    defaultColor: UnitProp.Color([1, 1, 1, 1]),
    //AtlasGridSize: UnitProp.Int2([0, 0]),
    //AtlasGridFrame: UnitProp.Int(1),
    AnimationSpeed: UnitProp.Float(15),
  },
  children: "multi",
} as const satisfies DetailBase;

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
