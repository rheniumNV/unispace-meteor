import { useCallback } from "react";
import {
  Canvas,
  HorizontalLayout,
  LayoutElement,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import { StyledImage, StyledText } from "../../../unit/package/StyledUix/main";
import { SimpleButton } from "../../components/simpleButton";
import { Color, Material, Sprite } from "../../style";
import { useAppContext } from "../../appContext";
type Meteor = {
  name: string;
  size: number;
  mass: number;
  visualIndex: number;
};

const meteorList: Meteor[] = [
  {
    name: "Meteor 1",
    size: 3000,
    mass: 100000,
    visualIndex: 0,
  },
  {
    name: "Meteor 2",
    size: 30000,
    mass: 2000000,
    visualIndex: 1,
  },
  {
    name: "Meteor 3",
    size: 300000,
    mass: 30000000,
    visualIndex: 2,
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
    <LayoutElement minHeight={200}>
      <StyledImage
        styledColor={Color.subBackground}
        styledSprite={Sprite.circleBase}
      />
      <HorizontalLayout spacing={10}>
        <LayoutElement flexibleWidth={1}>
          <VerticalLayout>
            <LayoutElement minHeight={100}>
              <StyledText
                content={meteor.name}
                horizontalAlign="Center"
                styledColor={Color.text}
                verticalAlign="Middle"
              />
            </LayoutElement>
            <LayoutElement flexibleHeight={1}>
              <HorizontalLayout spacing={10}>
                <StyledText
                  content={`Size: ${meteor.size}`}
                  horizontalAlign="Center"
                  styledColor={Color.text}
                  verticalAlign="Middle"
                />
                <StyledText
                  content={`Mass: ${meteor.mass}`}
                  horizontalAlign="Center"
                  styledColor={Color.text}
                  verticalAlign="Middle"
                />
              </HorizontalLayout>
            </LayoutElement>
          </VerticalLayout>
        </LayoutElement>
        <LayoutElement minWidth={200}>
          <SimpleButton onClick={onClick} text="Select" />
        </LayoutElement>
      </HorizontalLayout>
    </LayoutElement>
  );
};

export const MeteorSelector = () => {
  const { dispatch } = useAppContext();

  const selectMeteor = useCallback(
    (meteor: Meteor) => {
      dispatch({
        type: "UPDATE_METEOR",
        meteor: {
          mass: meteor.mass,
          size: meteor.size,
          visualIndex: meteor.visualIndex,
        },
      });
    },
    [dispatch],
  );

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
        spacing={10}
      >
        <VerticalLayout forceExpandChildHeight={false} spacing={10}>
          {meteorList.map((meteor) => (
            <Meteor
              key={meteor.name}
              meteor={meteor}
              selectMeteor={selectMeteor}
            />
          ))}
        </VerticalLayout>
      </VerticalLayout>
    </Canvas>
  );
};
