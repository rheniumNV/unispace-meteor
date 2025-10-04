import { useAppContext } from "../appContext";
import { SelectMeteor } from "./selectMeteor";

export const Simulation = () => {
  const { appState } = useAppContext();

  switch (appState.simulationState.mode) {
    case "SelectMeteor":
      return <SelectMeteor />;
    default:
      return null;
  }
};
