import { AppContextProvider } from "./appContext";
import { MainUi } from "./mainUi";
import { Simulation } from "./simulation";
import { StyledSpace } from "./style";

export const App = () => {
  return (
    <StyledSpace>
      <AppContextProvider>
        <Simulation />
        <MainUi />
      </AppContextProvider>
    </StyledSpace>
  );
};
