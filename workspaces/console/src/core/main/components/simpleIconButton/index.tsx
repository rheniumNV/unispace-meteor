import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import {
  StyledButton,
  StyledImage,
} from "../../../unit/package/StyledUix/main";
import { Color, Sprite } from "../../style";
import {
  StyledColorVariable,
  StyledSpriteVariable,
} from "../../../lib/styledUnit";
import { VerticalLayout } from "../../../unit/package/PrimitiveUix/main";

export const SimpleIconButton = (props: {
  enabled?: boolean;
  iconSprite: StyledSpriteVariable;
  onClick?: (env: FunctionEnv) => void;
  overrideStyledColor?: StyledColorVariable;
}) => {
  return (
    <StyledButton
      enabled={props.enabled ?? true}
      onClick={props.onClick}
      styledColor={props.overrideStyledColor ?? Color.button}
      styledSprite={Sprite.frame}
    >
      <VerticalLayout
        paddingBottom={10}
        paddingLeft={10}
        paddingRight={10}
        paddingTop={10}
      >
        <StyledImage
          styledColor={
            props.overrideStyledColor ??
            ((props.enabled ?? true) ? Color.text : Color.disableText)
          }
          styledSprite={props.iconSprite}
        />
      </VerticalLayout>
    </StyledButton>
  );
};
