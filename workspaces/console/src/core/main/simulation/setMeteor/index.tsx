import { Slot } from "../../../unit/package/Primitive/main";
import { MeteorSetterV2 } from "../../../lib/meteorSetterV2";
import { useAppContext, type SimulationModeSetMeteor } from "../../appContext";
import { useCallback, useEffect } from "react";
import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import { Earth } from "../../../unit/package/Meteor/main";
// import { simulateMeteorImpact } from "@unispace-meteor/simulator/src/simulation";
// import { R } from "@mobily/ts-belt";

export const SetMeteor = (props: {
  simulationState: SimulationModeSetMeteor;
}) => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    // if (!props.simulationState.result) {
    //   const result = simulateMeteorImpact({
    //     discovery: {
    //       t0: new Date(),
    //       r0_ecef: props.simulationState.meteor.position,
    //       velocity: {
    //         magnitude_m_s: props.simulationState.meteor.power[0],
    //         azimuth_deg: props.simulationState.meteor.power[1],
    //         entry_angle_deg: props.simulationState.meteor.power[2],
    //       },
    //     },
    //     meteoroid: {
    //       diameter_m: props.simulationState.meteor.size,
    //       density_kg_m3: props.simulationState.meteor.mass,
    //       strength_mpa: 100,
    //     },
    //     environment: {
    //       surface: "land",
    //     },
    //   });
    //   if (R.isOk(result)) {
    //     dispatch({
    //       type: "UPDATE_SIMULATION_RESULT",
    //       result: R.getExn(result),
    //     });
    //   }
    // }
  }, [dispatch, props.simulationState.result]);

  const onChangePosition = useCallback(
    (_env: FunctionEnv, position: [number, number, number]) => {
      dispatch({
        type: "UPDATE_METEOR_POSITION",
        position,
      });
    },
    [dispatch],
  );

  const onChangePower = useCallback(
    (_env: FunctionEnv, power: [number, number, number]) => {
      dispatch({
        type: "UPDATE_METEOR_POWER",
        power,
      });
    },
    [dispatch],
  );

  return (
    <Slot>
      <Earth />
      <MeteorSetterV2
        defaultPosition={props.simulationState.meteor.position}
        defaultPower={props.simulationState.meteor.power}
        onChangePosition={onChangePosition}
        onChangePower={onChangePower}
      />
    </Slot>
  );
};
