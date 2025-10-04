import { ComponentProps, useEffect, useRef, useState } from "react";
import { MeteorSetter } from "../../unit/package/Meteor/main";

type Vector3 = [number, number, number];

const useChangeableValue = <T,>(
  defaultValue: T,
  setValueRef?: ReturnType<typeof useRef<(v: T) => void>>,
) => {
  const [rawValue, setRawValue] = useState<T>(defaultValue);
  const newValue = useRef<T>(defaultValue);

  useEffect(() => {
    if (setValueRef) {
      setValueRef.current = (value: T) => {
        newValue.current = value;
        setRawValue(value);
      };
    }
  }, [setValueRef]);

  useEffect(() => {
    if (newValue.current !== rawValue) {
      setRawValue(newValue.current);
    }
  }, [rawValue]);

  return rawValue;
};

export const MeteorSetterV2 = ({
  setPositionRef,
  setPowerRef,
  defaultPosition,
  defaultPower,
  ...props
}: Omit<ComponentProps<typeof MeteorSetter>, "value"> & {
  setPositionRef?: ReturnType<typeof useRef<(position: Vector3) => void>>;
  setPowerRef?: ReturnType<typeof useRef<(power: Vector3) => void>>;
  defaultPower?: Vector3;
}) => {
  const position = useChangeableValue(
    defaultPosition ?? [0, 0, 0],
    setPositionRef,
  );
  const power = useChangeableValue(defaultPower ?? [0, 0, 0], setPowerRef);

  return (
    <MeteorSetter {...props} defaultPosition={position} defaultPower={power} />
  );
};
