import { Slot } from "../../../unit/package/Primitive/main";
import { MeteorSetterV2 } from "../../../lib/meteorSetterV2";
import type { SimulationModeSetMeteor } from "../../appContext";

export const SetMeteor = (_props: {
  simulationState: SimulationModeSetMeteor;
}) => {
  return (
    <Slot>
      <MeteorSetterV2 />
    </Slot>
  );
};
