import { useCallback } from "react";
import {
  HorizontalLayout,
  LayoutElement,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import { Sprite } from "../../style";
import { type SimulationModeSetMeteor, useAppContext } from "../../appContext";
import { SimpleIconButton } from "../../components/simpleIconButton";

export const MainUiSetMeteor = (props: {
  simulationState: SimulationModeSetMeteor;
}) => {
  const { dispatch } = useAppContext();

  const onClickPlay = useCallback(() => {
    if (props.simulationState.input && props.simulationState.result) {
      dispatch({
        type: "START_ANIMATION",
        meteor: {
          name: props.simulationState.meteor.name,
          description: props.simulationState.meteor.description,
          position: props.simulationState.meteor.position,
          power: props.simulationState.meteor.power,
          density: props.simulationState.meteor.density,
          size: props.simulationState.meteor.size,
          visualIndex: props.simulationState.meteor.visualIndex,
        },
        input: props.simulationState.input,
        result: props.simulationState.result,
      });
    }
  }, [
    dispatch,
    props.simulationState.input,
    props.simulationState.meteor.density,
    props.simulationState.meteor.description,
    props.simulationState.meteor.name,
    props.simulationState.meteor.position,
    props.simulationState.meteor.power,
    props.simulationState.meteor.size,
    props.simulationState.meteor.visualIndex,
    props.simulationState.result,
  ]);

  return (
    <VerticalLayout>
      <LayoutElement minHeight={100}>
        <HorizontalLayout forceExpandChildWidth={false}>
          <LayoutElement minWidth={100}>
            <SimpleIconButton
              iconSprite={Sprite.iconPlay}
              onClick={onClickPlay}
            />
          </LayoutElement>
        </HorizontalLayout>
      </LayoutElement>
    </VerticalLayout>
  );
};
