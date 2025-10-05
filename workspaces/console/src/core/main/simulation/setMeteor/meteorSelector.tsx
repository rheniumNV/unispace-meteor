import { useCallback } from "react";
import { useAppContext } from "../../appContext";
import { Slot } from "../../../unit/package/Primitive/main";
import { FlexibleCanvas, MeteorInfo } from "../../../unit/package/Meteor/main";
type Meteor = {
  name: string;
  description: string;
  size: number;
  density: number;
  visualIndex: number;
  imageUrl: string;
};

export const meteorList: Meteor[] = [
  {
    name: "アポフィス",
    size: 370,
    density: 2700,
    visualIndex: 0,
    imageUrl:
      "resdb:///e3d9c09304faf986fcb442138f885134e9f3bcddb2c1943d44c92146af9ce95c.webp",
    description:
      "発見当初、2029年に地球に衝突する可能性がわずかながら指摘され、大きな注目を集めました。その後の観測で、少なくとも今後100年間は衝突の危険がないことが確認されています。2029年には地球から約3万1000kmの距離を通過する予定で、静止衛星の軌道よりも内側を通る珍しい機会となります。",
  },
  {
    name: "(415029) 2011 UL21",
    size: 2300,
    density: 2700,
    visualIndex: 1,
    imageUrl:
      "resdb:///4c1801234c8c2c1e42260c4f2ae6f869a0ac2f05fd5b8ae791694f1675822c75.webp",
    description:
      "2024年6月下旬に地球の近くを通過しました。地球に衝突する危険はありませんでしたが、近年通過した中では最大級の小惑星の一つとして注目を集めました。「惑星キラー」とも呼ばれるサイズ帯に属しています。",
  },
  {
    name: "チクシュルーブ衝突体",
    size: 15000,
    density: 1400,
    visualIndex: 2,
    imageUrl:
      "resdb:///b3299f05048f71286193e736039557bbeb28e00270aa98b1831a47a3a0eb254f.webp",
    description:
      "約6600万年前、現在のメキシコ・ユカタン半島沖に落下した直径約10kmの小惑星。この衝突が引き起こした地球規模の環境激変が、恐竜を含む当時の生物種の約75%を絶滅させた「白亜紀末の大量絶滅」の最も有力な原因とされています。",
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
    <MeteorInfo
      density={meteor.density.toString()}
      description={meteor.description}
      imageUrl={meteor.imageUrl}
      onClick={onClick}
      size={meteor.size.toString()}
      title={meteor.name}
    />
  );
};

export const MeteorSelector = () => {
  const { dispatch } = useAppContext();

  const selectMeteor = useCallback(
    (meteor: Meteor) => {
      dispatch({
        type: "UPDATE_METEOR",
        meteor: {
          name: meteor.name,
          description: meteor.description,
          density: meteor.density,
          size: meteor.size,
          visualIndex: meteor.visualIndex,
        },
      });
    },
    [dispatch],
  );

  return (
    <Slot position={[0, 0.5, 0]}>
      <FlexibleCanvas>
        {meteorList.map((meteor) => (
          <Meteor
            key={meteor.name}
            meteor={meteor}
            selectMeteor={selectMeteor}
          />
        ))}
      </FlexibleCanvas>
    </Slot>
  );
};
