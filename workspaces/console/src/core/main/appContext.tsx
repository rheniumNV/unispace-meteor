import { createContext, Dispatch, useContext, useReducer } from "react";
import {
  SimulationInput,
  type SimulationResult,
} from "@unispace-meteor/simulator/dist/main";

export type SimulationModeSetMeteor = {
  mode: "SetMeteor";
  meteor: {
    position: [number, number, number];
    power: [number, number, number];
    mass: number;
    size: number;
    visualIndex: number;
  };
  input?: SimulationInput;
  result?: SimulationResult;
};

export type SimulationModeViewMeteor = {
  mode: "ANIMATION";
  play: boolean;
  time: number;
  meteor: {
    position: [number, number, number];
    power: [number, number, number];
    mass: number;
    size: number;
    visualIndex: number;
  };
  input: SimulationInput;
  result: SimulationResult;
};

export type SimulationState =
  | SimulationModeSetMeteor
  | SimulationModeViewMeteor;

export type AppState = {
  mode: "Simulation";
  simulationState: SimulationState;
};

export type AppAction =
  | {
      type: "UPDATE_METEOR";
      meteor: {
        mass?: number;
        size?: number;
        visualIndex?: number;
        position?: [number, number, number];
        power?: [number, number, number];
      };
    }
  | {
      type: "UPDATE_SIMULATION_RESULT";
      input: SimulationInput;
      result: SimulationResult;
    }
  | {
      type: "START_ANIMATION";
      meteor: {
        position: [number, number, number];
        power: [number, number, number];
        mass: number;
        size: number;
        visualIndex: number;
      };
      input: SimulationInput;
      result: SimulationResult;
    }
  | { type: "PLAY_ANIMATION" }
  | {
      type: "STOP_ANIMATION";
    }
  | {
      type: "UPDATE_ANIMATION_TIME";
      time: number;
    };

export const appReducer = (state: AppState, action: AppAction): AppState => {
  console.debug("appReducer", action);

  switch (action.type) {
    case "UPDATE_METEOR":
      if (state.simulationState.mode !== "SetMeteor") {
        return state;
      }
      return {
        ...state,
        simulationState: {
          mode: "SetMeteor",
          meteor: {
            size: action.meteor.size ?? state.simulationState.meteor.size,
            mass: action.meteor.mass ?? state.simulationState.meteor.mass,
            position:
              action.meteor.position ?? state.simulationState.meteor.position,
            power: action.meteor.power ?? state.simulationState.meteor.power,
            visualIndex:
              action.meteor.visualIndex ??
              state.simulationState.meteor.visualIndex ??
              0,
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
    case "START_ANIMATION":
      return {
        ...state,
        simulationState: {
          mode: "ANIMATION",
          play: true,
          time: 0,
          meteor: action.meteor,
          input: action.input,
          result: action.result,
        },
      };
    case "PLAY_ANIMATION":
      if (state.simulationState.mode !== "ANIMATION") {
        return state;
      }
      return {
        ...state,
        simulationState: {
          ...state.simulationState,
          play: true,
        },
      };
    case "STOP_ANIMATION":
      if (state.simulationState.mode !== "ANIMATION") {
        return state;
      }
      return {
        ...state,
        simulationState: {
          ...state.simulationState,
          play: false,
        },
      };
    case "UPDATE_ANIMATION_TIME":
      if (state.simulationState.mode !== "ANIMATION") {
        return state;
      }
      return {
        ...state,
        simulationState: {
          ...state.simulationState,
          time: action.time,
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
      mode: "SetMeteor",
      meteor: {
        position: [2, 0.1, -0.05],
        power: [0.3, 0.05, 0],
        mass: 3000,
        size: 10000,
        visualIndex: 0,
      },
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
