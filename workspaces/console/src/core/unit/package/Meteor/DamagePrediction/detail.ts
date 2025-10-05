import {
  DetailBase,
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "Meteor/DamagePrediction",
  propsConfig: {
    initialDiameter: UnitProp.String(""),
    finalDiameter: UnitProp.String(""),
    craterDepth: UnitProp.String(""),
    blast3_5kPa: UnitProp.String(""),
    blast10kPa: UnitProp.String(""),
    blast20kPa: UnitProp.String(""),
    uiPosition: UnitProp.Float3([0, 0, 0]),
    targetPosition: UnitProp.Float3([0, 0, 0]),
    activeCrater: UnitProp.Boolean(true),
    activeBlast: UnitProp.Boolean(true),
  },
  children: "multi",
} as const satisfies DetailBase;

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
