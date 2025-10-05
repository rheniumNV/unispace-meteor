import { Canvas, VerticalLayout } from "../../unit/package/PrimitiveUix/main";
import { StyledImage } from "../../unit/package/StyledUix/main";
import { useAppContext } from "../appContext";
import { Color, Material, Sprite } from "../style";
import { MainUiAnimation } from "./animation";
import { ManageSimulationData } from "./manageSimulationData";
import { MainUiSetMeteor } from "./setMeteor";

const SwitchMainUiContent = () => {
  const { appState } = useAppContext();

  switch (appState.simulationState.mode) {
    case "SetMeteor":
      return <MainUiSetMeteor simulationState={appState.simulationState} />;
    case "ANIMATION":
      return <MainUiAnimation simulationState={appState.simulationState} />;
    default:
      return null;
  }
};

export const MainUi = () => {
  const { appState } = useAppContext();
  return (
    <Canvas
      position={[0, 1, 0]}
      size={
        appState.enableSimulationLoader ||
        appState.simulationState.mode === "ANIMATION"
          ? [1000, 1000]
          : [1000, 500]
      }
    >
      <StyledImage
        styledColor={Color.white}
        styledMaterial={Material.baseAlpha}
        styledSprite={Sprite.base}
      />
      <VerticalLayout
        forceExpandChildHeight={false}
        paddingBottom={100}
        paddingLeft={100}
        paddingRight={100}
        paddingTop={100}
      >
        <ManageSimulationData />
        {!appState.enableSimulationLoader && <SwitchMainUiContent />}
      </VerticalLayout>
    </Canvas>
  );
};
