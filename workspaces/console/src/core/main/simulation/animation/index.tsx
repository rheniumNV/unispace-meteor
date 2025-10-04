import { useEffect, useMemo } from "react";
import { Earth, MeteorVisual } from "../../../unit/package/Meteor/main";
import { Slot } from "../../../unit/package/Primitive/main";
import { SimulationModeAnimation, useAppContext } from "../../appContext";

export const Animation = (props: SimulationModeAnimation) => {
  const { dispatch } = useAppContext();

  const meteorPosition = useMemo((): [number, number, number] => {
    for (let i = 0; i < props.result.trajectory.length; i++) {
      const prevPoint = props.result.trajectory[i];
      const nextPoint = props.result.trajectory[i + 1];
      if (prevPoint && nextPoint) {
        if (prevPoint.t <= props.time && nextPoint.t >= props.time) {
          const rate = (props.time - prevPoint.t) / (nextPoint.t - prevPoint.t);
          return [
            prevPoint.r_ecef[0] * (1 - rate) + nextPoint.r_ecef[0] * rate,
            prevPoint.r_ecef[1] * (1 - rate) + nextPoint.r_ecef[1] * rate,
            prevPoint.r_ecef[2] * (1 - rate) + nextPoint.r_ecef[2] * rate,
          ];
        }
      }
    }
    const lastPoint =
      props.result.trajectory[props.result.trajectory.length - 1];
    return [
      lastPoint?.r_ecef[0] ?? 0,
      lastPoint?.r_ecef[1] ?? 0,
      lastPoint?.r_ecef[2] ?? 0,
    ];
  }, [props.result.trajectory, props.time]);

  useEffect(() => {
    if (props.play) {
      const interval = setInterval(() => {
        dispatch({ type: "UPDATE_ANIMATION_TIME", time: props.time + 10 });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [props.play, dispatch, props.time]);

  return (
    <Slot>
      <Earth />
      <Slot position={meteorPosition}>
        <MeteorVisual
          meteorIndex={props.meteor.visualIndex}
          scale={[0.1, 0.1, 0.1]}
        />
      </Slot>
    </Slot>
  );
};
