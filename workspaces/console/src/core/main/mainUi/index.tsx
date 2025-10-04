import { Canvas, VerticalLayout } from "../../unit/package/PrimitiveUix/main";
import { StyledImage } from "../../unit/package/StyledUix/main";
import { useAppContext } from "../appContext";
import { Color, Material, Sprite } from "../style";
import { MainUiSetMeteor } from "./setMeteor";

const SwitchMainUiContent = () => {
  const { appState } = useAppContext();

  switch (appState.simulationState.mode) {
    case "SetMeteor":
      return <MainUiSetMeteor simulationState={appState.simulationState} />;
    default:
      return null;
  }
};

export const MainUi = () => {
  return (
    <Canvas position={[0, 1, 0]} size={[1000, 1000]}>
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
        <SwitchMainUiContent />
      </VerticalLayout>
    </Canvas>
  );
};
