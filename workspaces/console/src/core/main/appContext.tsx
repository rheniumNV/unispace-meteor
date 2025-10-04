import { createContext, Dispatch, useContext, useReducer } from "react";
import {
  SimulationInput,
  type SimulationResult,
} from "@unispace-meteor/simulator/dist/main";

export type SimulationModeSelectMeteor = {
  mode: "SelectMeteor";
};

export type SimulationModeSetMeteor = {
  mode: "SetMeteor";
  meteor: {
    position: [number, number, number];
    power: [number, number, number];
    mass: number;
    size: number;
  };
  input?: SimulationInput;
  result?: SimulationResult;
};

export type SimulationModeViewMeteor = {
  mode: "ViewMeteor";
  meteor: {
    position: [number, number, number];
    power: [number, number, number];
    mass: number;
    size: number;
  };
};

export type SimulationState =
  | SimulationModeSelectMeteor
  | SimulationModeSetMeteor
  | SimulationModeViewMeteor;

export type AppState = {
  mode: "Simulation";
  simulationState: SimulationState;
};

export type AppAction =
  | {
      type: "GO_TO_SELECT_METEOR";
    }
  | {
      type: "SELECT_METEOR";
      meteor: {
        mass: number;
        size: number;
        position: [number, number, number];
        power: [number, number, number];
      };
    }
  | {
      type: "UPDATE_METEOR_POSITION";
      position: [number, number, number];
    }
  | {
      type: "UPDATE_METEOR_POWER";
      power: [number, number, number];
    }
  | {
      type: "UPDATE_SIMULATION_RESULT";
      input: SimulationInput;
      result: SimulationResult;
    };

export const appReducer = (state: AppState, action: AppAction): AppState => {
  console.debug("appReducer", action);

  switch (action.type) {
    case "GO_TO_SELECT_METEOR":
      return {
        mode: "Simulation",
        simulationState: { mode: "SelectMeteor" },
      };
    case "SELECT_METEOR":
      if (state.simulationState.mode !== "SelectMeteor") {
        return state;
      }
      return {
        ...state,
        simulationState: {
          mode: "SetMeteor",
          meteor: {
            ...action.meteor,
            power: [0, 0, 0],
          },
        },
      };
    case "UPDATE_METEOR_POSITION":
      if (state.simulationState.mode !== "SetMeteor") {
        return state;
      }
      return {
        ...state,
        simulationState: {
          mode: "SetMeteor",
          meteor: {
            ...state.simulationState.meteor,
            position: action.position,
          },
        },
      };
    case "UPDATE_METEOR_POWER":
      if (state.simulationState.mode !== "SetMeteor") {
        return state;
      }
      return {
        ...state,
        simulationState: {
          mode: "SetMeteor",
          meteor: {
            ...state.simulationState.meteor,
            power: action.power,
          },
        },
      };
    case "UPDATE_SIMULATION_RESULT":
      if (state.simulationState.mode !== "SetMeteor") {
        return state;
      }
      return {
        ...state,
        simulationState: {
          ...state.simulationState,
          input: action.input,
          result: action.result,
        },
      };
    default:
      return state;
  }
};

const AppContext = createContext<
  | {
      appState: AppState;
      dispatch: Dispatch<AppAction>;
    }
  | undefined
>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [appState, dispatch] = useReducer<
    (state: AppState, action: AppAction) => AppState
  >(appReducer, {
    mode: "Simulation",
    simulationState: {
      mode: "SelectMeteor",
    },
  } as const);

  return (
    <AppContext.Provider value={{ appState, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("AppContext is not provided");
  }
  return context;
};
