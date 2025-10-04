import { useAppContext } from "../appContext";
import { SelectMeteor } from "./selectMeteor";
import { SetMeteor } from "./setMeteor";

export const Simulation = () => {
  const { appState } = useAppContext();

  switch (appState.simulationState.mode) {
    case "SetMeteor":
      return <SetMeteor simulationState={appState.simulationState} />;
    default:
      return null;
  }
};
