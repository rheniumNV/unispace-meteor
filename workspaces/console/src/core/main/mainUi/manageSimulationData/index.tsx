import { useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import {
  HorizontalLayout,
  LayoutElement,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import { useAppContext } from "../../appContext";
import { SimpleButton } from "../../components/simpleButton";
import { useLocalSimulationData } from "../../localSimulationData";
import { StyledText } from "../../../unit/package/StyledUix/main";
import { StyledTextFieldV2 } from "../../../lib/styledTextFieldV2";
import { LoadSimulationData } from "./loadSimulationData";

export const ManageSimulationData = () => {
  const { appState, dispatch } = useAppContext();
  const { localSimulationData, saveSimulationData } = useLocalSimulationData();

  const enableSaveAs = useMemo(() => {
    return appState.simulationState.id !== undefined;
  }, [appState.simulationState.id]);

  const onClickLoad = useCallback(
    (_env: FunctionEnv) => {
      dispatch({
        type: "OPEN_LOAD_SIMULATION_DATA",
        mode: "Local",
      });
    },
    [dispatch],
  );

  const onClickSave = useCallback(
    (env: FunctionEnv) => {
      if (appState.simulationState.input && appState.simulationState.result) {
        const id = appState.simulationState.id ?? uuidv4();
        if (!appState.simulationState.id) {
          dispatch({
            type: "UPDATE_SIMULATION_METADATA",
            id,
          });
        }
        saveSimulationData({
          id,
          title: appState.simulationState.title,
          meteor: appState.simulationState.meteor,
          createdBy: env.userId,
          createdAt: new Date().toISOString(),
          input: appState.simulationState.input,
          result: appState.simulationState.result,
        });
      }
    },
    [
      appState.simulationState.id,
      appState.simulationState.input,
      appState.simulationState.meteor,
      appState.simulationState.result,
      appState.simulationState.title,
      dispatch,
      saveSimulationData,
    ],
  );

  const onClickSaveAs = useCallback(
    (env: FunctionEnv) => {
      if (appState.simulationState.input && appState.simulationState.result) {
        const id = uuidv4();
        dispatch({
          type: "UPDATE_SIMULATION_METADATA",
          id,
        });
        saveSimulationData({
          id,
          title: appState.simulationState.title,
          meteor: appState.simulationState.meteor,
          createdBy: env.userId,
          createdAt: new Date().toISOString(),
          input: appState.simulationState.input,
          result: appState.simulationState.result,
        });
      }
    },
    [
      appState.simulationState.input,
      appState.simulationState.meteor,
      appState.simulationState.result,
      appState.simulationState.title,
      dispatch,
      saveSimulationData,
    ],
  );

  const onChangeTitle = useCallback(
    (_env: FunctionEnv, text: string) => {
      dispatch({
        type: "UPDATE_SIMULATION_METADATA",
        title: text,
      });
    },
    [dispatch],
  );

  return (
    <VerticalLayout>
      {!appState.enableSimulationLoader && (
        <VerticalLayout forceExpandChildHeight={false}>
          <LayoutElement minHeight={100}>
            <HorizontalLayout>
              <StyledText content="title:" />
              <StyledTextFieldV2
                defaultValue={appState.simulationState.title}
                onChange={onChangeTitle}
              />
            </HorizontalLayout>
          </LayoutElement>
          <LayoutElement minHeight={100}>
            <HorizontalLayout>
              <SimpleButton onClick={onClickSave} text="Save" />
              <SimpleButton
                enabled={enableSaveAs}
                onClick={onClickSaveAs}
                text="Save As"
              />
              <SimpleButton onClick={onClickLoad} text="Load" />
            </HorizontalLayout>
          </LayoutElement>
        </VerticalLayout>
      )}
      <VerticalLayout forceExpandChildHeight={false}>
        {appState.enableSimulationLoader &&
          localSimulationData.status === "SUCCESS" && (
            <LoadSimulationData
              localSimulationData={localSimulationData.data}
              mode="Local"
            />
          )}
      </VerticalLayout>
    </VerticalLayout>
  );
};
