import { Slot } from "../../../unit/package/Primitive/main";
import { MeteorSetterV2 } from "../../../lib/meteorSetterV2";
import { useAppContext, type SimulationModeSetMeteor } from "../../appContext";
import { useCallback, useEffect, useMemo } from "react";
import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import { Earth, Line } from "../../../unit/package/Meteor/main";
import {
  simulateMeteorImpact,
  Vec3,
} from "@unispace-meteor/simulator/dist/main";
import { R } from "@mobily/ts-belt";

export const SetMeteor = (props: {
  simulationState: SimulationModeSetMeteor;
}) => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    if (!props.simulationState.result) {
      const input = {
        discovery: {
          t0: new Date(),
          r0_ecef: [
            props.simulationState.meteor.position[0] * 10000000,
            props.simulationState.meteor.position[1] * 10000000,
            props.simulationState.meteor.position[2] * 10000000,
          ],
          velocity_ecef: [
            -props.simulationState.meteor.power[0] * 0.01 * 10000000,
            -props.simulationState.meteor.power[1] * 0.01 * 10000000,
            -props.simulationState.meteor.power[2] * 0.01 * 10000000,
          ],
        },
        meteoroid: {
          diameter_m: props.simulationState.meteor.size,
          density_kg_m3: props.simulationState.meteor.mass,
          strength_mpa: 100,
        },
        environment: {
          surface: "land",
        },
      } as const;
      const result = simulateMeteorImpact(input);
      if (R.isOk(result)) {
        dispatch({
          type: "UPDATE_SIMULATION_RESULT",
          input,
          result: R.getExn(result),
        });
      }
    }
  }, [dispatch, props.simulationState.result]);

  const meteorLinePoints = useMemo<
    { start: [number, number, number]; end: [number, number, number] }[]
  >((): {
    start: [number, number, number];
    end: [number, number, number];
  }[] => {
    if (!props.simulationState.result) {
      return [];
    }
    const points: (readonly [number, number, number])[] =
      props.simulationState.result.trajectory.map((point) => point.r_ecef);
    // [
    //   [2, 0, 0],
    //   [1.8, 0.2, 0],
    //   [1.5, 0.4, 0],
    //   [1.2, 0.5, 0],
    //   [0.8, 0.45, 0],
    //   [0.4, 0.3, 0],
    //   [0, 0, 0],
    // ];
    return points
      .map(
        (point) =>
          [point[0] / 10000000, point[1] / 10000000, point[2] / 10000000] as [
            number,
            number,
            number,
          ],
      )
      .map((point, index) => {
        const prevPoint = points[index - 1];
        return {
          start: [point[0], point[1], point[2]] as [number, number, number],
          end: prevPoint
            ? ([prevPoint[0], prevPoint[1], prevPoint[2]] as [
                number,
                number,
                number,
              ])
            : ([0, 0, 0] as [number, number, number]),
        };
      })
      .slice(0, 10);
  }, [props.simulationState.result]);

  console.log(meteorLinePoints.length);

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
