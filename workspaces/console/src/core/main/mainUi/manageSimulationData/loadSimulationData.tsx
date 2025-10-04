import { useCallback, useMemo } from "react";
import {
  LayoutElement,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import { useAppContext } from "../../appContext";
import { SimpleButton } from "../../components/simpleButton";
import { SimulationData } from "../../localSimulationData";
import { Color } from "../../style";

const LocalSimulationData = (props: {
  simulationData: SimulationData;
  onClickLoadSimulationData: (data: SimulationData) => void;
}) => {
  const { appState } = useAppContext();

  const onClickLoad = useCallback(() => {
    props.onClickLoadSimulationData(props.simulationData);
  }, [props]);

  const backgroundColor = useMemo(() => {
    return appState.simulationState.id === props.simulationData.id
      ? Color.selectedButton
      : Color.button;
  }, [appState.simulationState.id, props.simulationData.id]);

  return (
    <LayoutElement minHeight={100}>
      <SimpleButton
        onClick={onClickLoad}
        overrideStyledColor={backgroundColor}
        text={props.simulationData.title}
      />
    </LayoutElement>
  );
};

export const LoadSimulationData = (_props: {
  mode: "Local" | "NasaApi";
  localSimulationData: Record<string, SimulationData>;
}) => {
  const { dispatch } = useAppContext();

  const onClickBack = useCallback(() => {
    dispatch({ type: "CLOSE_LOAD_SIMULATION_DATA" });
  }, [dispatch]);

  const onClickLoadSimulationData = useCallback(
    (simulationData: SimulationData) => {
      dispatch({
        type: "LOAD_SIMULATION_DATA",
        simulationData,
      });
    },
    [dispatch],
  );

  return (
    <VerticalLayout
      forceExpandChildHeight={false}
      paddingBottom={100}
      paddingLeft={100}
      paddingRight={100}
      paddingTop={100}
    >
      <LayoutElement minHeight={100}>
        <SimpleButton onClick={onClickBack} text="Back" />
      </LayoutElement>
      <LayoutElement flexibleHeight={1}>
        <VerticalLayout forceExpandChildHeight={false} spacing={10}>
          {Object.entries(_props.localSimulationData).map(
            ([_, data], index) => (
              <LocalSimulationData
                key={index}
                onClickLoadSimulationData={onClickLoadSimulationData}
                simulationData={data}
              />
            ),
          )}
        </VerticalLayout>
      </LayoutElement>
    </VerticalLayout>
  );
};
