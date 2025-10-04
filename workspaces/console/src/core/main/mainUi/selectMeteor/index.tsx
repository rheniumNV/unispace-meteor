import { useCallback } from "react";
import {
  HorizontalLayout,
  LayoutElement,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import {
  StyledButton,
  StyledImage,
  StyledText,
} from "../../../unit/package/StyledUix/main";
import { useAppContext } from "../../appContext";
import { Color, Sprite } from "../../style";

type Meteor = {
  name: string;
  size: number;
  mass: number;
};

const meteorList: Meteor[] = [
  {
    name: "Meteor 1",
    size: 1,
    mass: 1,
  },
  {
    name: "Meteor 2",
    size: 2,
    mass: 2,
  },
  {
    name: "Meteor 3",
    size: 3,
    mass: 3,
  },
];

const Meteor = ({
  meteor,
  selectMeteor,
}: {
  meteor: Meteor;
  selectMeteor: (meteor: Meteor) => void;
}) => {
  const onClick = useCallback(() => {
    selectMeteor(meteor);
  }, [meteor, selectMeteor]);

  return (
    <LayoutElement minHeight={100}>
      <StyledImage
        styledColor={Color.subBackground}
        styledSprite={Sprite.circleBase}
      />
      <HorizontalLayout>
        <StyledText
          content={meteor.name}
          horizontalAlign="Center"
          styledColor={Color.text}
          verticalAlign="Middle"
        />
        <StyledButton
          onClick={onClick}
          styledColor={Color.button}
          styledSprite={Sprite.circleBase}
        >
          <StyledText
            content="Select"
            horizontalAlign="Center"
            styledColor={Color.text}
            verticalAlign="Middle"
          />
        </StyledButton>
      </HorizontalLayout>
    </LayoutElement>
  );
};

export const MainUiSelectMeteor = () => {
  const { dispatch } = useAppContext();

  const selectMeteor = useCallback(
    (meteor: Meteor) => {
      dispatch({
        type: "SELECT_METEOR",
        meteor: {
          mass: meteor.mass,
          size: meteor.size,
          position: [0, 0, 0],
          rotation: [0, 0, 0, 0],
        },
      });
    },
    [dispatch],
  );

  return (
    <VerticalLayout forceExpandChildHeight={false} spacing={10}>
      {meteorList.map((meteor) => (
        <Meteor key={meteor.name} meteor={meteor} selectMeteor={selectMeteor} />
      ))}
    </VerticalLayout>
  );
};
