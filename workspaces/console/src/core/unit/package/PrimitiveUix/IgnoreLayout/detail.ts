import {
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "PrimitiveUix/IgnoreLayout",
  propsConfig: {},
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
