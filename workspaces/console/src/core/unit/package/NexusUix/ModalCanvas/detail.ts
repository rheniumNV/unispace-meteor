import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "NexusUix/ModalCanvas",
  propsConfig: {
    size: UnitProp.Float2([1000, 1000]),
    position: UnitProp.Float3([0, 0, 0]),
    rotation: UnitProp.FloatQ([0, 0, 0, 0]),
    scale: UnitProp.Float3([1, 1, 1]),
    isOpen: UnitProp.Boolean(false),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
