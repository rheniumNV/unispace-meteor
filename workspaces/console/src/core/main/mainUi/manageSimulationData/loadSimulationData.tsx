import { useCallback, useMemo } from "react";
import {
  HorizontalLayout,
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
  deleteSimulationData: (id: string) => void;
}) => {
  const { appState } = useAppContext();

  const onClickLoad = useCallback(() => {
    props.onClickLoadSimulationData(props.simulationData);
  }, [props]);

  const onClickDelete = useCallback(() => {
    props.deleteSimulationData(props.simulationData.id);
  }, [props]);

  const backgroundColor = useMemo(() => {
    return appState.simulationState.id === props.simulationData.id
      ? Color.selectedButton
      : Color.button;
  }, [appState.simulationState.id, props.simulationData.id]);

  return (
    <LayoutElement minHeight={100}>
      <HorizontalLayout>
        <SimpleButton
          onClick={onClickLoad}
          overrideStyledColor={backgroundColor}
          text={props.simulationData.title}
        />
        <SimpleButton
          onClick={onClickDelete}
          overrideStyledColor={backgroundColor}
          text="Delete"
        />
      </HorizontalLayout>
    </LayoutElement>
  );
};

export const LoadSimulationData = (props: {
  mode: "Local" | "NasaApi";
  localSimulationData: Record<string, SimulationData>;
  deleteSimulationData: (id: string) => void;
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

  const onClickLocal = useCallback(() => {
    dispatch({
      type: "OPEN_LOAD_SIMULATION_DATA",
      mode: "Local",
    });
  }, [dispatch]);

  const onClickApi = useCallback(() => {
    dispatch({
      type: "OPEN_LOAD_SIMULATION_DATA",
      mode: "NasaApi",
    });
  }, [dispatch]);

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
      <LayoutElement minHeight={100}>
        <HorizontalLayout>
          <SimpleButton
            onClick={onClickLocal}
            overrideStyledColor={
              props.mode === "Local" ? Color.selectedButton : Color.button
            }
            text="Local Save Data"
          />
          <SimpleButton
            onClick={onClickApi}
            overrideStyledColor={
              props.mode === "NasaApi" ? Color.selectedButton : Color.button
            }
            text="Nearby asteroids(from Web API)"
          />
        </HorizontalLayout>
      </LayoutElement>
      <LayoutElement flexibleHeight={1}>
        {props.mode === "Local" && (
          <VerticalLayout forceExpandChildHeight={false} spacing={10}>
            {Object.entries(props.localSimulationData).map(
              ([_, data], index) => (
                <LocalSimulationData
                  deleteSimulationData={props.deleteSimulationData}
                  key={index}
                  onClickLoadSimulationData={onClickLoadSimulationData}
                  simulationData={data}
                />
              ),
            )}
          </VerticalLayout>
        )}
        {props.mode === "NasaApi" && (
          <VerticalLayout forceExpandChildHeight={false} spacing={10}>
            <SimpleButton text="Load" />
          </VerticalLayout>
        )}
      </LayoutElement>
    </VerticalLayout>
  );
};
