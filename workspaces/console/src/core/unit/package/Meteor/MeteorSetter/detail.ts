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
  code: "Meteor/MeteorSetter",
  propsConfig: {
    defaultPosition: UnitProp.Float3([0, 0, 0]),
    defaultPower: UnitProp.Float3([0, 0, 0]),
    onChangePosition: UnitProp.Function(
      (_env: FunctionEnv, _position: [number, number, number]) => {},
    ),
    onChangePower: UnitProp.Function(
      (_env: FunctionEnv, _power: [number, number, number]) => {},
    ),
  },
  children: "multi",
} as const satisfies DetailBase;

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
