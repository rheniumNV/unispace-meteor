import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import {
  DetailBase,
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "Meteor/MeteorEditor",
  propsConfig: {
    title: UnitProp.String(""),
    description: UnitProp.String(""),
    density: UnitProp.String(""),
    size: UnitProp.String(""),
    speed: UnitProp.String(""),
    positionX: UnitProp.String(""),
    positionY: UnitProp.String(""),
    positionZ: UnitProp.String(""),
    onClickSelectPreset: UnitProp.Function((_env: FunctionEnv) => {}),
  },
  children: "multi",
} as const satisfies DetailBase;

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
