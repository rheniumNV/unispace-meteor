import { useCallback } from "react";
import {
  HorizontalLayout,
  LayoutElement,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import { StyledImage, StyledText } from "../../../unit/package/StyledUix/main";
import { useAppContext } from "../../appContext";
import { Color, Sprite } from "../../style";
import { SimpleButton } from "../../components/simpleButton";

type Meteor = {
  name: string;
  size: number;
  mass: number;
};

const meteorList: Meteor[] = [
  {
    name: "Meteor 1",
    size: 3000,
    mass: 100000,
  },
  {
    name: "Meteor 2",
    size: 30000,
    mass: 2000000,
  },
  {
    name: "Meteor 3",
    size: 300000,
    mass: 30000000,
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
        <SimpleButton onClick={onClick} text="Select" />
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
