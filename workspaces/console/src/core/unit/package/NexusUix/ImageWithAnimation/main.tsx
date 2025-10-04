import { generateMain } from "@unispace-meteor/miragex/dist/unit/main";
import { StyledColorVariable } from "../../../../lib/styledUnit";

import { unitConfig } from "./detail";

const Unit = generateMain(unitConfig);

export const O = (
  props: Omit<Parameters<typeof Unit>[0], "styledColor"> & {
    styledColor?: StyledColorVariable;
  },
) => {
  return Unit({
    ...props,
    styledColor: props.styledColor?.variableName,
  });
};
