import { useMemo } from "react";
import { SimulationResult } from "@unispace-meteor/simulator";
import { SIMULATION_SCALE } from "../../constant";
import {
  DamagePrediction,
  GroundZeroEffect,
} from "../../../unit/package/Meteor/main";
import { Slot } from "../../../unit/package/Primitive/main";

export const DamageView = (props: { result: SimulationResult }) => {
  const grandZeroEffectProps = useMemo(() => {
    if (!props.result) {
      return undefined;
    }
    if (!props.result.crater.hasCrater) {
      return undefined;
    }
    if (!props.result.trajectory) {
      return undefined;
    }
    const lastPoint =
      props.result.trajectory[props.result.trajectory.length - 1];
    if (!lastPoint) {
      return undefined;
    }
    return {
      ...props.result.crater,
      damage_radii_km: props.result.blast.damage_radii_km["20kPa"],
      position: [
        lastPoint.r_ecef[0] / SIMULATION_SCALE,
        lastPoint.r_ecef[1] / SIMULATION_SCALE,
        lastPoint.r_ecef[2] / SIMULATION_SCALE,
      ] as [number, number, number],
      radius1:
        ((props.result.blast.damage_radii_km["20kPa"] ?? 0) /
          SIMULATION_SCALE) *
        1000,
      radius2:
        ((props.result.blast.damage_radii_km["10kPa"] ?? 0) /
          SIMULATION_SCALE) *
        1000,
      radius3:
        ((props.result.blast.damage_radii_km["3.5kPa"] ?? 0) /
          SIMULATION_SCALE) *
        1000,
      color1: [1, 0, 0, 1] as [number, number, number, number],
      color2: [1, 1, 0, 1] as [number, number, number, number],
      color3: [1, 1, 1, 0.5] as [number, number, number, number],
    };
  }, [props.result]);

  const damagePredictionProps = useMemo(() => {
    return {
      initialDiameter: props.result.crater.hasCrater
        ? `${Math.round(props.result.crater.transient_diameter_m / 1000)}km`
        : undefined,
      finalDiameter: props.result.crater.hasCrater
        ? `${Math.round(props.result.crater.final_diameter_m / 1000)}km`
        : undefined,
      craterDepth: props.result.crater.hasCrater
        ? `${Math.round(props.result.crater.depth_m / 1000)}km`
        : undefined,
      blast3_5kPa: props.result.blast.damage_radii_km["3.5kPa"]
        ? `${Math.round(props.result.blast.damage_radii_km["3.5kPa"])}km`
        : undefined,
      blast10kPa: props.result.blast.damage_radii_km["10kPa"]
        ? `${Math.round(props.result.blast.damage_radii_km["10kPa"])}km`
        : undefined,
      blast20kPa: props.result.blast.damage_radii_km["20kPa"]
        ? `${Math.round(props.result.blast.damage_radii_km["20kPa"])}km`
        : undefined,
      activeCrater: props.result.crater.hasCrater,
      activeBlast: (props.result.blast.damage_radii_km["3.5kPa"] ?? 0) > 0,
    };
  }, [props.result]);

  return (
    <Slot>
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
      {damagePredictionProps.activeBlast &&
        damagePredictionProps.activeCrater && (
          <Slot position={grandZeroEffectProps?.position ?? [0.2, 0.2, 0]}>
            <DamagePrediction
              activeBlast={damagePredictionProps?.activeBlast}
              activeCrater={damagePredictionProps?.activeCrater}
              blast10kPa={damagePredictionProps?.blast10kPa}
              blast20kPa={damagePredictionProps?.blast20kPa}
              blast3_5kPa={damagePredictionProps?.blast3_5kPa}
              craterDepth={damagePredictionProps?.craterDepth}
              finalDiameter={damagePredictionProps?.finalDiameter}
              initialDiameter={damagePredictionProps?.initialDiameter}
            />
          </Slot>
        )}
    </Slot>
  );
};
