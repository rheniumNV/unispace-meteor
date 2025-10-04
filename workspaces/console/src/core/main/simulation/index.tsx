import { useAppContext } from "../appContext";
import { Animation } from "./animation";
import { SetMeteor } from "./setMeteor";

export const Simulation = () => {
  const { appState } = useAppContext();

  switch (appState.simulationState.mode) {
    case "SetMeteor":
      return <SetMeteor simulationState={appState.simulationState} />;
    case "ANIMATION":
      return <Animation simulationState={appState.simulationState} />;
    default:
      return null;
  }
};
