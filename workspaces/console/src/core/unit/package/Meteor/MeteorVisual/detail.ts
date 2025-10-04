import {
  DetailBase,
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "Meteor/MeteorVisual",
  propsConfig: {
    meteorIndex: UnitProp.Int(0),
    scale: UnitProp.Float3([1, 1, 1]),
    rotation: UnitProp.FloatQ([0, 0, 0, 0]),
  },
  children: "multi",
} as const satisfies DetailBase;

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
