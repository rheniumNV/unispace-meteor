import { useEffect, useMemo } from "react";
import { rotateQuatY } from "@unispace-meteor/common/dist/quaternion";
import { Earth, Line, MeteorVisual } from "../../../unit/package/Meteor/main";
import { Slot } from "../../../unit/package/Primitive/main";
import { SimulationModeAnimation, useAppContext } from "../../appContext";
import {
  METEOR_VISUAL_SCALE,
  SIMULATION_DAY_TIME_STEP,
  SIMULATION_SCALE,
} from "../../constant";
import { DamageView } from "../../components/damageView";

export const Animation = (props: {
  simulationState: SimulationModeAnimation;
}) => {
  const { dispatch } = useAppContext();

  const meteorData = useMemo((): {
    points: {
      start: [number, number, number];
      end: [number, number, number];
    }[];
    position: [number, number, number];
  } => {
    const points: {
      start: [number, number, number];
      end: [number, number, number];
    }[] = [];
    for (let i = 0; i < props.simulationState.result.trajectory.length; i++) {
      const prevPoint = props.simulationState.result.trajectory[i];
      const nextPoint = props.simulationState.result.trajectory[i + 1];
      if (prevPoint && nextPoint) {
        if (
          prevPoint.t <= props.simulationState.time &&
          nextPoint.t >= props.simulationState.time
        ) {
          const rate =
            (props.simulationState.time - prevPoint.t) /
            (nextPoint.t - prevPoint.t);
          const currentPoint = [
            (prevPoint.r_ecef[0] * (1 - rate) + nextPoint.r_ecef[0] * rate) /
              SIMULATION_SCALE,
            (prevPoint.r_ecef[1] * (1 - rate) + nextPoint.r_ecef[1] * rate) /
              SIMULATION_SCALE,
            (prevPoint.r_ecef[2] * (1 - rate) + nextPoint.r_ecef[2] * rate) /
              SIMULATION_SCALE,
          ] as [number, number, number];
          points.push({
            start: [
              prevPoint.r_ecef[0] / SIMULATION_SCALE,
              prevPoint.r_ecef[1] / SIMULATION_SCALE,
              prevPoint.r_ecef[2] / SIMULATION_SCALE,
            ],
            end: currentPoint,
          });
          return {
            points,
            position: currentPoint,
          };
        }
        points.push({
          start: [
            prevPoint.r_ecef[0] / SIMULATION_SCALE,
            prevPoint.r_ecef[1] / SIMULATION_SCALE,
            prevPoint.r_ecef[2] / SIMULATION_SCALE,
          ],
          end: [
            nextPoint.r_ecef[0] / SIMULATION_SCALE,
            nextPoint.r_ecef[1] / SIMULATION_SCALE,
            nextPoint.r_ecef[2] / SIMULATION_SCALE,
          ],
        });
      }
    }
    const lastPoint =
      props.simulationState.result.trajectory[
        props.simulationState.result.trajectory.length - 1
      ];
    return {
      points,
      position: [
        (lastPoint?.r_ecef[0] ?? 0) / SIMULATION_SCALE,
        (lastPoint?.r_ecef[1] ?? 0) / SIMULATION_SCALE,
        (lastPoint?.r_ecef[2] ?? 0) / SIMULATION_SCALE,
      ],
    };
  }, [props.simulationState.result.trajectory, props.simulationState.time]);

  useEffect(() => {
    if (props.simulationState.play) {
      const interval = setInterval(() => {
        dispatch({
          type: "UPDATE_ANIMATION_TIME",
          time:
            props.simulationState.time +
            props.simulationState.timeScale * 0.025,
        });
      }, 25);
      return () => clearInterval(interval);
    }
  }, [
    props.simulationState.play,
    dispatch,
    props.simulationState.time,
    props.simulationState.timeScale,
  ]);

  const isVisibleDamageView = useMemo(() => {
    return (
      props.simulationState.time >= props.simulationState.result.end_time_s
    );
  }, [props.simulationState.time, props.simulationState.result.end_time_s]);

  const earthRotation = useMemo<[number, number, number, number]>(() => {
    return rotateQuatY(
      [0, 0, 0, 1],
      (2 * Math.PI * props.simulationState.time) / SIMULATION_DAY_TIME_STEP,
    );
  }, [props.simulationState.time]);

  return (
    <Slot>
      <Earth rotation={earthRotation} />
      <Slot
        active={
          props.simulationState.time < props.simulationState.result.end_time_s
        }
        position={meteorData.position}
      >
        <MeteorVisual
          meteorIndex={props.simulationState.meteor.visualIndex}
          scale={METEOR_VISUAL_SCALE}
        />
      </Slot>

      {meteorData.points.map((line, index) => (
        <Line end={line.end} key={index} start={line.start} />
      ))}

      {isVisibleDamageView && (
        <DamageView result={props.simulationState.result} />
      )}
    </Slot>
  );
};
