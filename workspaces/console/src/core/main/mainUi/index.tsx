import { Canvas, VerticalLayout } from "../../unit/package/PrimitiveUix/main";
import { StyledImage } from "../../unit/package/StyledUix/main";
import { useAppContext } from "../appContext";
import { Color, Material, Sprite } from "../style";
import { MainUiSelectMeteor } from "./selectMeteor";
import { MainUiSetMeteor } from "./setMeteor";

const SwitchMainUiContent = () => {
  const { appState } = useAppContext();

  switch (appState.simulationState.mode) {
    case "SelectMeteor":
      return <MainUiSelectMeteor />;
    case "SetMeteor":
      return <MainUiSetMeteor />;
    default:
      return null;
  }
};

export const MainUi = () => {
  return (
    <Canvas position={[0, 1, 0]} size={[1000, 1000]}>
      <StyledImage
        styledColor={Color.background}
        styledMaterial={Material.base}
        styledSprite={Sprite.circleBase}
      />
      <VerticalLayout
        forceExpandChildHeight={false}
        paddingBottom={20}
        paddingLeft={20}
        paddingRight={20}
        paddingTop={20}
      >
        <SwitchMainUiContent />
      </VerticalLayout>
    </Canvas>
  );
};
