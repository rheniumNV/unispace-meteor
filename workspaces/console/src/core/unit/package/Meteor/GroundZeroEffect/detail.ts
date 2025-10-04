import {
  DetailBase,
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "Meteor/GroundZeroEffect",
  propsConfig: {
    position: UnitProp.Float3([0, 0, 0]),
    radius1: UnitProp.Float(0),
    radius2: UnitProp.Float(0),
    radius3: UnitProp.Float(0),
    color1: UnitProp.Color([1, 1, 1, 1]),
    color2: UnitProp.Color([1, 1, 1, 1]),
    color3: UnitProp.Color([1, 1, 1, 1]),
  },
  children: "multi",
} as const satisfies DetailBase;

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
