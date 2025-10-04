import { Slot } from "../../../unit/package/Primitive/main";
import { MeteorSetterV2 } from "../../../lib/meteorSetterV2";
import { useAppContext, type SimulationModeSetMeteor } from "../../appContext";
import { useCallback, useEffect, useMemo } from "react";
import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import {
  DamagePrediction,
  Earth,
  GroundZeroEffect,
  Line,
  MeteorVisual,
} from "../../../unit/package/Meteor/main";
import { simulateMeteorImpact } from "@unispace-meteor/simulator/dist/main";
import { R } from "@mobily/ts-belt";
import { SIMULATION_SCALE, SIMULATION_POWER_SCALE } from "../../constant";
import { MeteorSelector } from "./meteorSelector";

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
            props.simulationState.meteor.position[0] * SIMULATION_SCALE,
            props.simulationState.meteor.position[1] * SIMULATION_SCALE,
            props.simulationState.meteor.position[2] * SIMULATION_SCALE,
          ],
          velocity_ecef: [
            -props.simulationState.meteor.power[0] *
              SIMULATION_POWER_SCALE *
              SIMULATION_SCALE,
            -props.simulationState.meteor.power[1] *
              SIMULATION_POWER_SCALE *
              SIMULATION_SCALE,
            -props.simulationState.meteor.power[2] *
              SIMULATION_POWER_SCALE *
              SIMULATION_SCALE,
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
        model: {
          time_step_s: 10,
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
    const length = props.simulationState.result.trajectory.length;
    const points: (readonly [number, number, number])[] =
      props.simulationState.result.trajectory
        .map((point) => point.r_ecef)
        .map(
          (point) =>
            [
              point[0] / SIMULATION_SCALE,
              point[1] / SIMULATION_SCALE,
              point[2] / SIMULATION_SCALE,
            ] as [number, number, number],
        )
        .filter((_p, index) =>
          length < 100 || length - 1 === index
            ? true
            : index % Math.round(length / 100) === 0,
        );
    return points
      .map((point, index) => {
        const prevPoint = points[index - 1];
        return prevPoint
          ? {
              start: [point[0], point[1], point[2]] as [number, number, number],
              end: [prevPoint[0], prevPoint[1], prevPoint[2]] as [
                number,
                number,
                number,
              ],
            }
          : undefined;
      })
      .filter((v) => v !== undefined)
      .slice(0, 1000);
  }, [props.simulationState.result]);

  console.log(meteorLinePoints.length);

  const onChangePosition = useCallback(
    (_env: FunctionEnv, position: [number, number, number]) => {
      dispatch({
        type: "UPDATE_METEOR",
        meteor: {
          position,
        },
      });
    },
    [dispatch],
  );

  const onChangePower = useCallback(
    (_env: FunctionEnv, power: [number, number, number]) => {
      dispatch({
        type: "UPDATE_METEOR",
        meteor: {
          power,
        },
      });
    },
    [dispatch],
  );

  const crater = useMemo(() => {
    if (!props.simulationState.result) {
      return undefined;
    }
    if (!props.simulationState.result.crater.hasCrater) {
      return undefined;
    }
    if (!props.simulationState.result.trajectory) {
      return undefined;
    }
    const lastPoint =
      props.simulationState.result.trajectory[
        props.simulationState.result.trajectory.length - 1
      ];
    if (!lastPoint) {
      return undefined;
    }
    return {
      ...props.simulationState.result.crater,
      damage_radii_km:
        props.simulationState.result.blast.damage_radii_km["20kPa"],
      position: [
        lastPoint.r_ecef[0] / SIMULATION_SCALE,
        lastPoint.r_ecef[1] / SIMULATION_SCALE,
        lastPoint.r_ecef[2] / SIMULATION_SCALE,
      ] as [number, number, number],
    };
  }, [props.simulationState.result]);

  return (
    <Slot>
      <Earth />
      <MeteorSetterV2
        defaultPosition={props.simulationState.meteor.position}
        defaultPower={props.simulationState.meteor.power}
        onChangePosition={onChangePosition}
        onChangePower={onChangePower}
      >
        <MeteorVisual
          scale={[0.1, 0.1, 0.1]}
          meteorIndex={props.simulationState.meteor.visualIndex}
        />
        <MeteorSelector />
      </MeteorSetterV2>
      {meteorLinePoints.map((line, index) => (
        <Line key={index} start={line.start} end={line.end} />
      ))}
      {crater && (
        <GroundZeroEffect
          position={crater.position}
          radius1={crater.transient_diameter_m / SIMULATION_SCALE / 2}
          radius2={crater.final_diameter_m / SIMULATION_SCALE / 2}
          radius3={((crater.damage_radii_km ?? 0) / SIMULATION_SCALE) * 1000}
          color1={[1, 0, 0, 1]}
          color2={[1, 1, 0, 1]}
          color3={[1, 1, 1, 0.5]}
        />
      )}
    </Slot>
  );
};
