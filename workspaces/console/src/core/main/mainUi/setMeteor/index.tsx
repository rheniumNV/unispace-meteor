import { useCallback, useMemo } from "react";
import {
  HorizontalLayout,
  LayoutElement,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import { StyledText } from "../../../unit/package/StyledUix/main";
import { Color } from "../../style";
import { type SimulationModeSetMeteor, useAppContext } from "../../appContext";
import { SimpleButton } from "../../components/simpleButton";

export const MainUiSetMeteor = (props: {
  simulationState: SimulationModeSetMeteor;
}) => {
  const { dispatch } = useAppContext();

  const inputText = useMemo(() => {
    if (!props.simulationState.input) {
      return "Input: No input";
    }
    return `${JSON.stringify(props.simulationState.input, null, 2)}`;
  }, [props.simulationState.input]);

  const resultText = useMemo(() => {
    if (!props.simulationState.result) {
      return "Result: No result";
    }
    const { trajectory, ...results } = props.simulationState.result;
    return `points: ${trajectory.length}
    ${JSON.stringify(results, null, 2)}`;
  }, [props.simulationState.result]);

  const onClickPlay = useCallback(() => {
    if (props.simulationState.input && props.simulationState.result) {
      dispatch({
        type: "START_ANIMATION",
        meteor: {
          position: props.simulationState.meteor.position,
          power: props.simulationState.meteor.power,
          mass: props.simulationState.meteor.mass,
          size: props.simulationState.meteor.size,
          visualIndex: props.simulationState.meteor.visualIndex,
        },
        input: props.simulationState.input,
        result: props.simulationState.result,
      });
    }
  }, [dispatch, props.simulationState.input, props.simulationState.result]);

  return (
    <VerticalLayout>
      <LayoutElement minHeight={100}>
        <HorizontalLayout>
          <SimpleButton text="Play" onClick={onClickPlay} />
        </HorizontalLayout>
      </LayoutElement>
      <LayoutElement flexibleHeight={1}>
        <StyledText
          content={inputText}
          horizontalAlign="Left"
          styledColor={Color.text}
          verticalAlign="Middle"
          verticalAutoSize
          horizontalAutoSize
          autoSizeMin={1}
        />
      </LayoutElement>
      <LayoutElement flexibleHeight={1}>
        <StyledText
          content={resultText}
          horizontalAlign="Left"
          styledColor={Color.text}
          verticalAlign="Middle"
          verticalAutoSize
          horizontalAutoSize
          autoSizeMin={1}
        />
      </LayoutElement>
    </VerticalLayout>
  );
};
