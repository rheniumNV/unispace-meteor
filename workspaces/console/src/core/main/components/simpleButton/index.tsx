import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import { StyledButton, StyledText } from "../../../unit/package/StyledUix/main";
import { Color, Sprite } from "../../style";
import { StyledColorVariable } from "../../../lib/styledUnit";

export const SimpleButton = (props: {
  enabled?: boolean;
  text: string;
  onClick?: (env: FunctionEnv) => void;
  overrideStyledColor?: StyledColorVariable;
}) => {
  return (
    <StyledButton
      enabled={props.enabled ?? true}
      onClick={props.onClick}
      styledColor={props.overrideStyledColor ?? Color.button}
      styledSprite={Sprite.button}
    >
      <StyledText
        content={props.text}
        horizontalAlign="Center"
        horizontalAutoSize
        styledColor={Color.text}
        verticalAlign="Middle"
        verticalAutoSize
      />
    </StyledButton>
  );
};
