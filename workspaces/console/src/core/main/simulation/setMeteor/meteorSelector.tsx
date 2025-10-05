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

const meteorList: Meteor[] = [
  {
    name: "アエンデ隕石",
    size: 2.7,
    density: 20000000,
    visualIndex: 2,
    imageUrl:
      "resdb:///b3299f05048f71286193e736039557bbeb28e00270aa98b1831a47a3a0eb254f.webp",
    description:
      "アエンデ隕石は、1969年にメキシコのチワワ州プエブリート・デ・アエンデに落下しました。重さ約2トンで地球上で発見された最大の炭素質コンドライト隕石です。最も研究されている隕石の一つであり、豊富なCAI(高アルミニウムカルシウム含有物)を含むことで知られています。",
  },
  {
    name: "チェリャビンスク隕石",
    size: 17,
    density: 10000000,
    visualIndex: 0,
    imageUrl:
      "resdb:///4c1801234c8c2c1e42260c4f2ae6f869a0ac2f05fd5b8ae791694f1675822c75.webp",
    description:
      "チェリャビンスク隕石は、2013年ロシアのチェリャビンスク市の上空約20キロメートルで爆発しました。直径約18メートル、重量約1万1000トンの隕石で時速約66960キロメートルの速度で地球大気圏に突入しました。この爆発は、広島を破壊した原爆の30倍以上のエネルギーを放出し、惑星防衛に関する世界的な議論の火付け役となりました。",
  },
  {
    name: "ピークスキル流星",
    size: 0.3,
    density: 12.57,
    visualIndex: 1,
    imageUrl:
      "resdb:///62860aa6d0c249b5b7ab44a801fd8f828b5a05e540343e7b3f99710303fd2aee.webp",
    description:
      "1992年のピークスキル流星は、16本の独立したビデオに撮影され、その後車に衝突しました。結果として生じた隕石は高密度の岩石で構成されており、非常に重い ボウリングのボールほどの大きさと質量があります。 隕石事件の中でも最も視覚的な記録が残るものの一つとなりました。",
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
