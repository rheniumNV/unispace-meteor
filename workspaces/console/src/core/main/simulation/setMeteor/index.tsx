import { Slot } from "../../../unit/package/Primitive/main";
import { MeteorSetterV2 } from "../../../lib/meteorSetterV2";
import { useAppContext, type SimulationModeSetMeteor } from "../../appContext";
import { useCallback, useEffect, useMemo } from "react";
import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import {
  Earth,
  GroundZeroEffect,
  Line,
  MeteorVisual,
} from "../../../unit/package/Meteor/main";
import {
  simulateMeteorImpact,
  SimulationInput,
  SimulationResult,
} from "@unispace-meteor/simulator/dist/main";
import { R } from "@mobily/ts-belt";
import {
  SIMULATION_SCALE,
  SIMULATION_POWER_SCALE,
  SIMULATION_DAY_TIME_STEP,
} from "../../constant";
import { MeteorSelector } from "./meteorSelector";
import { rotateQuatY } from "@unispace-meteor/common/dist/quaternion";

const simulateMeteorImpactAsync = async (
  input: SimulationInput,
  callback: (result: SimulationResult) => void,
) => {
  const result = await (async () => simulateMeteorImpact(input))();
  if (R.isOk(result)) {
    callback(R.getExn(result));
  }
};

export const SetMeteor = (props: {
  simulationState: SimulationModeSetMeteor;
}) => {
  const { appState, dispatch } = useAppContext();

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
          density_kg_m3: props.simulationState.meteor.density,
          strength_mpa: 100,
        },
        environment: {
          surface: "land",
        },
        model: {
          time_step_s: 1,
          max_time_s: 60 * 60 * 24 * 7,
        },
      } as const;

      let cancel = false;
      simulateMeteorImpactAsync(input, (result) => {
        if (cancel) {
          return;
        }
        dispatch({
          type: "UPDATE_SIMULATION_RESULT",
          input,
          result,
        });
      });

      return () => {
        cancel = true;
      };
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

  const grandZeroEffectProps = useMemo(() => {
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
      radius1:
        ((props.simulationState.result.blast.damage_radii_km["20kPa"] ?? 0) /
          SIMULATION_SCALE) *
        1000,
      radius2:
        ((props.simulationState.result.blast.damage_radii_km["10kPa"] ?? 0) /
          SIMULATION_SCALE) *
        1000,
      radius3:
        ((props.simulationState.result.blast.damage_radii_km["3.5kPa"] ?? 0) /
          SIMULATION_SCALE) *
        1000,
      color1: [1, 0, 0, 1] as [number, number, number, number],
      color2: [1, 1, 0, 1] as [number, number, number, number],
      color3: [1, 1, 1, 0.5] as [number, number, number, number],
    };
  }, [props.simulationState.result]);

  const earthRotation = useMemo<[number, number, number, number]>(() => {
    return rotateQuatY(
      [0, 0, 0, 1],
      (2 * Math.PI * (props.simulationState.result?.end_time_s ?? 0)) /
        SIMULATION_DAY_TIME_STEP,
    );
  }, [props.simulationState.result?.end_time_s]);

  return (
    <Slot>
      <Earth rotation={earthRotation} />
      {appState.enableSimulationLoader === undefined && (
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
      )}
      <Slot
        active={appState.enableSimulationLoader !== undefined}
        position={props.simulationState.meteor.position}
      >
        <MeteorVisual
          scale={[0.1, 0.1, 0.1]}
          meteorIndex={props.simulationState.meteor.visualIndex}
        />
      </Slot>
      {meteorLinePoints.map((line, index) => (
        <Line key={index} start={line.start} end={line.end} />
      ))}
      {grandZeroEffectProps && (
        <GroundZeroEffect
          position={grandZeroEffectProps.position}
          radius1={grandZeroEffectProps.radius1}
          radius2={grandZeroEffectProps.radius2}
          radius3={grandZeroEffectProps.radius3}
          color1={grandZeroEffectProps.color1}
          color2={grandZeroEffectProps.color2}
          color3={grandZeroEffectProps.color3}
        />
      )}
    </Slot>
  );
};
