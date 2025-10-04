import { useCallback, useMemo } from "react";
import {
  LayoutElement,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import { StyledButton, StyledText } from "../../../unit/package/StyledUix/main";
import { Color, Sprite } from "../../style";
import { type SimulationModeSetMeteor, useAppContext } from "../../appContext";

export const MainUiSetMeteor = (props: {
  simulationState: SimulationModeSetMeteor;
}) => {
  const { dispatch } = useAppContext();

  const onClickBack = useCallback(() => {
    dispatch({ type: "GO_TO_SELECT_METEOR" });
  }, [dispatch]);

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
    return `Result: ${JSON.stringify(
      props.simulationState.result.trajectory.map((point) => point.r_ecef)
        .length,
      null,
      2,
    )}`;
  }, [props.simulationState.result]);

  return (
    <VerticalLayout>
      <LayoutElement minHeight={100}>
        <StyledButton
          onClick={onClickBack}
          styledColor={Color.button}
          styledSprite={Sprite.circleBase}
        >
          <StyledText
            content="Back"
            horizontalAlign="Center"
            styledColor={Color.text}
            verticalAlign="Middle"
          />
        </StyledButton>
      </LayoutElement>
      <LayoutElement minHeight={100}>
        <StyledText
          content={`Position: ${props.simulationState.meteor.position.join(", ")}`}
          horizontalAlign="Center"
          styledColor={Color.text}
          verticalAlign="Middle"
          verticalAutoSize
          horizontalAutoSize
          autoSizeMin={1}
        />
      </LayoutElement>
      <LayoutElement minHeight={100}>
        <StyledText
          content={`Power: ${props.simulationState.meteor.power.join(", ")}`}
          horizontalAlign="Center"
          styledColor={Color.text}
          verticalAlign="Middle"
        />
      </LayoutElement>
      <LayoutElement flexibleHeight={1}>
        <StyledText
          content={inputText}
          horizontalAlign="Center"
          styledColor={Color.text}
          verticalAlign="Middle"
        />
      </LayoutElement>
      <LayoutElement flexibleHeight={1}>
        <StyledText
          content={resultText}
          horizontalAlign="Center"
          styledColor={Color.text}
          verticalAlign="Middle"
        />
      </LayoutElement>
    </VerticalLayout>
  );
};
