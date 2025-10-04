import { createContext, Dispatch, useContext, useReducer } from "react";

export type SimulationModeSelectMeteor = {
  mode: "SelectMeteor";
};

export type SimulationModeSetMeteor = {
  mode: "SetMeteor";
  meteor: {
    position: [number, number, number];
    rotation: [number, number, number, number];
    mass: number;
    size: number;
  };
};

export type SimulationModeViewMeteor = {
  mode: "ViewMeteor";
  meteor: {
    position: [number, number, number];
    rotation: [number, number, number, number];
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
        rotation: [number, number, number, number];
      };
    }
  | {
      type: "UPDATE_METEOR";
      meteor: {
        mass: number;
        size: number;
        position: [number, number, number];
        rotation: [number, number, number, number];
      };
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
        simulationState: { mode: "SetMeteor", meteor: action.meteor },
      };
    case "UPDATE_METEOR":
      if (state.simulationState.mode !== "SetMeteor") {
        return state;
      }
      return {
        ...state,
        simulationState: { mode: "SetMeteor", meteor: action.meteor },
      };
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
