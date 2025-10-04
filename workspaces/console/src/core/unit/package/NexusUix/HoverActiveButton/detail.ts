import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "@unispace-meteor/miragex/dist/unit/common";

const detail = {
  code: "NexusUix/HoverActiveButton",
  propsConfig: {
    enabled: UnitProp.Boolean(true),
    styledSprite: UnitProp.String(""),
    styledColor: UnitProp.String(""),
    styledMaterial: UnitProp.String(""),
    styledHoverSprite: UnitProp.String(""),
    styledHoverMaterial: UnitProp.String(""),
    defaultColor: UnitProp.Color([1, 1, 1, 1]),
    styledNormalColor: UnitProp.String(""),
    styledHighlightColor: UnitProp.String(""),
    styledPressColor: UnitProp.String(""),
    styledDisableColor: UnitProp.String(""),
    onClick: UnitProp.Function((_env: FunctionEnv) => {}),
    requireLockInToPress: UnitProp.Boolean(false),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
