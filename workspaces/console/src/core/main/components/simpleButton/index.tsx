import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import { StyledButton, StyledText } from "../../../unit/package/StyledUix/main";
import { Color, Sprite } from "../../style";

export const SimpleButton = (props: {
  text: string;
  onClick: (env: FunctionEnv) => void;
}) => {
  return (
    <StyledButton
      onClick={props.onClick}
      styledColor={Color.button}
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
