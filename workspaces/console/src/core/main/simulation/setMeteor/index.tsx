import { Slot } from "../../../unit/package/Primitive/main";
import { MeteorSetterV2 } from "../../../lib/meteorSetterV2";
import { useAppContext, type SimulationModeSetMeteor } from "../../appContext";
import { useCallback, useEffect, useMemo } from "react";
import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import {
  Earth,
  Line,
  MeteorEditor,
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
  METEOR_VISUAL_SCALE,
} from "../../constant";
import { MeteorSelector } from "./meteorSelector";
import { rotateQuatY } from "@unispace-meteor/common/dist/quaternion";
import { DamageView } from "../../components/damageView";

const simulateMeteorImpactAsync = async (
  input: SimulationInput,
  callback: (result: SimulationResult) => void,
) => {
  const result = await (async () => simulateMeteorImpact(input))();
  if (R.isOk(result)) {
    callback(R.getExn(result));
  }
};

const absoluteVec3 = (vec3: [number, number, number]) => {
  return Math.sqrt(vec3[0] ** 2 + vec3[1] ** 2 + vec3[2] ** 2);
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

  const earthRotation = useMemo<[number, number, number, number]>(() => {
    return rotateQuatY(
      [0, 0, 0, 1],
      (2 * Math.PI * (props.simulationState.result?.end_time_s ?? 0)) /
        SIMULATION_DAY_TIME_STEP,
    );
  }, [props.simulationState.result?.end_time_s]);

  const meteorSpeedText = useMemo(() => {
    return `${absoluteVec3(props.simulationState.meteor.power).toFixed(2)}km/s`;
  }, [props.simulationState.meteor.power]);

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
            scale={METEOR_VISUAL_SCALE}
            meteorIndex={props.simulationState.meteor.visualIndex}
          />
          <MeteorEditor
            title={props.simulationState.meteor.name}
            description={props.simulationState.meteor.description}
            density={props.simulationState.meteor.density.toString()}
            size={props.simulationState.meteor.size.toString()}
            speed={meteorSpeedText}
            positionX={`${Math.round(
              (props.simulationState.meteor.position[0] * SIMULATION_SCALE) /
                1000,
            )}km`}
            positionY={`${Math.round(
              (props.simulationState.meteor.position[1] * SIMULATION_SCALE) /
                1000,
            )}km`}
            positionZ={`${Math.round(
              (props.simulationState.meteor.position[2] * SIMULATION_SCALE) /
                1000,
            )}km`}
          >
            <Slot position={[-0.1, 0, 0]}>
              <MeteorSelector />
            </Slot>
          </MeteorEditor>
        </MeteorSetterV2>
      )}
      <Slot
        active={appState.enableSimulationLoader !== undefined}
        position={props.simulationState.meteor.position}
      >
        <MeteorVisual
          scale={METEOR_VISUAL_SCALE}
          meteorIndex={props.simulationState.meteor.visualIndex}
        />
      </Slot>
      {meteorLinePoints.map((line, index) => (
        <Line key={index} start={line.start} end={line.end} />
      ))}
      {props.simulationState.result && (
        <DamageView result={props.simulationState.result} />
      )}
    </Slot>
  );
};
