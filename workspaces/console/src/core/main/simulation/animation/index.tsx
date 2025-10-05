import { useEffect, useMemo } from "react";
import { rotateQuatY } from "@unispace-meteor/common/dist/quaternion";
import {
  Earth,
  GroundZeroEffect,
  Line,
  MeteorVisual,
} from "../../../unit/package/Meteor/main";
import { Slot } from "../../../unit/package/Primitive/main";
import { SimulationModeAnimation, useAppContext } from "../../appContext";
import { SIMULATION_DAY_TIME_STEP, SIMULATION_SCALE } from "../../constant";

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

  const grandZeroEffectProps = useMemo(() => {
    if (props.simulationState.time < props.simulationState.result.end_time_s) {
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
  }, [
    props.simulationState.result.blast.damage_radii_km,
    props.simulationState.result.crater,
    props.simulationState.result.end_time_s,
    props.simulationState.result.trajectory,
    props.simulationState.time,
  ]);

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
          scale={[0.1, 0.1, 0.1]}
        />
      </Slot>

      {meteorData.points.map((line, index) => (
        <Line end={line.end} key={index} start={line.start} />
      ))}

      {grandZeroEffectProps && (
        <GroundZeroEffect
          color1={grandZeroEffectProps.color1}
          color2={grandZeroEffectProps.color2}
          color3={grandZeroEffectProps.color3}
          position={grandZeroEffectProps.position}
          radius1={grandZeroEffectProps.radius1}
          radius2={grandZeroEffectProps.radius2}
          radius3={grandZeroEffectProps.radius3}
        />
      )}
    </Slot>
  );
};
