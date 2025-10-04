import { Slot } from "../../../unit/package/Primitive/main";
import { MeteorSetterV2 } from "../../../lib/meteorSetterV2";
import { useAppContext, type SimulationModeSetMeteor } from "../../appContext";
import { useCallback, useEffect, useMemo } from "react";
import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import { Earth, Line } from "../../../unit/package/Meteor/main";
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

  const meteorLinePoints = useMemo<
    { start: [number, number, number]; end: [number, number, number] }[]
  >(() => {
    const points: [number, number, number][] = [
      [2, 0, 0],
      [1.8, 0.2, 0],
      [1.5, 0.4, 0],
      [1.2, 0.5, 0],
      [0.8, 0.45, 0],
      [0.4, 0.3, 0],
      [0, 0, 0],
    ];
    return points.map((point, index) => ({
      start: point,
      end: points[index + 1] ?? [0, 0, 0],
    }));
  }, []);

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
      {meteorLinePoints.map((line) => (
        <Line key={line.start.join(",")} start={line.start} end={line.end} />
      ))}
    </Slot>
  );
};
