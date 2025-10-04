import { useCallback } from "react";
import {
  LayoutElement,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import { StyledButton, StyledText } from "../../../unit/package/StyledUix/main";
import { Color, Sprite } from "../../style";
import { useAppContext } from "../../appContext";

export const MainUiSetMeteor = () => {
  const { dispatch } = useAppContext();

  const onClickBack = useCallback(() => {
    dispatch({ type: "GO_TO_SELECT_METEOR" });
  }, [dispatch]);

  return (
    <VerticalLayout>
      <LayoutElement minHeight={100}>
        <StyledButton
          onClick={onClickBack}
          styledColor={Color.button}
          styledSprite={Sprite.circleBase}
        >
          <StyledText
            content="Back"
            horizontalAlign="Center"
            styledColor={Color.text}
            verticalAlign="Middle"
          />
        </StyledButton>
      </LayoutElement>
    </VerticalLayout>
  );
};
