import { createContext, Dispatch, useContext, useReducer } from "react";
import {
  SimulationInput,
  type SimulationResult,
} from "@unispace-meteor/simulator/dist/main";
import { SimulationData } from "./localSimulationData";

export type SimulationModeSetMeteor = {
  id?: string;
  mode: "SetMeteor";
  title: string;
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

export type SimulationModeAnimation = {
  id?: string;
  mode: "ANIMATION";
  title: string;
  play: boolean;
  time: number;
  timeScale: number;
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

export type SimulationState = SimulationModeSetMeteor | SimulationModeAnimation;

export type AppState = {
  mode: "Simulation";
  simulationState: SimulationState;
  enableSimulationLoader?: {
    mode: "Local" | "NasaApi";
  };
};

export type AppAction =
  | {
      type: "SET_METEOR_MODE";
      meteor: {
        position: [number, number, number];
        power: [number, number, number];
        mass: number;
        size: number;
        visualIndex: number;
      };
    }
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
      type: "UPDATE_SIMULATION_METADATA";
      id?: string;
      title?: string;
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
      type: "PAUSE_ANIMATION";
    }
  | {
      type: "UPDATE_ANIMATION_TIME";
      time: number;
    }
  | {
      type: "UPDATE_ANIMATION_TIME_SCALE";
      timeScale: number;
    }
  | {
      type: "OPEN_LOAD_SIMULATION_DATA";
      mode: "Local" | "NasaApi";
    }
  | {
      type: "CLOSE_LOAD_SIMULATION_DATA";
    }
  | {
      type: "LOAD_SIMULATION_DATA";
      simulationData: SimulationData;
    };

export const appReducer = (state: AppState, action: AppAction): AppState => {
  if (action.type !== "UPDATE_ANIMATION_TIME") {
    console.debug("appReducer", action);
  }

  switch (action.type) {
    case "SET_METEOR_MODE":
      return {
        ...state,
        simulationState: {
          title: "New Simulation",
          mode: "SetMeteor",
          meteor: action.meteor,
        },
      };
    case "UPDATE_METEOR":
      if (state.simulationState.mode !== "SetMeteor") {
        return state;
      }
      return {
        ...state,
        simulationState: {
          title: state.simulationState.title,
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
    case "UPDATE_SIMULATION_METADATA":
      if (state.simulationState.mode !== "SetMeteor") {
        return state;
      }
      return {
        ...state,
        simulationState: {
          ...state.simulationState,
          title: action.title ?? state.simulationState.title,
          id: action.id ?? state.simulationState.id,
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
          title: state.simulationState.title,
          mode: "ANIMATION",
          play: true,
          time: 0,
          timeScale: Math.min(
            Math.max(1, Math.round(action.result.end_time_s / 5 / 100) * 100),
            10000,
          ),
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
    case "PAUSE_ANIMATION":
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
          time: Math.min(
            state.simulationState.result.end_time_s ?? 0,
            Math.max(0, action.time),
          ),
        },
      };
    case "UPDATE_ANIMATION_TIME_SCALE":
      if (state.simulationState.mode !== "ANIMATION") {
        return state;
      }
      return {
        ...state,
        simulationState: {
          ...state.simulationState,
          timeScale: action.timeScale,
        },
      };
    case "OPEN_LOAD_SIMULATION_DATA":
      return {
        ...state,
        enableSimulationLoader: {
          mode: action.mode,
        },
      };
    case "CLOSE_LOAD_SIMULATION_DATA":
      return {
        ...state,
        enableSimulationLoader: undefined,
      };
    case "LOAD_SIMULATION_DATA":
      switch (state.simulationState.mode) {
        case "SetMeteor":
          return {
            mode: "Simulation",
            simulationState: {
              mode: "SetMeteor",
              id: action.simulationData.id,
              title: action.simulationData.title,
              meteor: action.simulationData.meteor,
              input: action.simulationData.input,
              result: action.simulationData.result,
            },
          };
        case "ANIMATION":
          return {
            mode: "Simulation",
            simulationState: {
              id: action.simulationData.id,
              title: action.simulationData.title,
              mode: "ANIMATION",
              play: true,
              time: 0,
              timeScale: Math.min(
                Math.max(
                  1,
                  Math.round(
                    action.simulationData.result.end_time_s / 5 / 100,
                  ) * 100,
                ),
                10000,
              ),
              meteor: action.simulationData.meteor,
              input: action.simulationData.input,
              result: action.simulationData.result,
            },
          };
      }
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
      title: "New Simulation",
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
