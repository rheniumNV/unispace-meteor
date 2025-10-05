import { useCallback, useMemo, useRef } from "react";
import { FunctionEnv } from "@unispace-meteor/miragex/dist/common/interactionEvent";
import {
  HorizontalLayout,
  LayoutElement,
  RectTransform,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import { SimulationModeAnimation, useAppContext } from "../../appContext";
import { StyledImage, StyledText } from "../../../unit/package/StyledUix/main";
import { StyledTextFieldV2 } from "../../../lib/styledTextFieldV2";
import { Sprite } from "../../style";
import { SimpleIconButton } from "../../components/simpleIconButton";

export const MainUiAnimation = (props: {
  simulationState: SimulationModeAnimation;
}) => {
  const { dispatch } = useAppContext();

  const onClickPlay = useCallback(() => {
    dispatch({ type: "PLAY_ANIMATION" });
  }, [dispatch]);

  const onClickPause = useCallback(() => {
    dispatch({ type: "PAUSE_ANIMATION" });
  }, [dispatch]);

  const onClickStop = useCallback(() => {
    dispatch({ type: "SET_METEOR_MODE", meteor: props.simulationState.meteor });
  }, [dispatch, props.simulationState.meteor]);

  const setTimeScaleTextFieldRef = useRef((_arg: string) => {});

  const onChangeTimeScale = useCallback(
    (_env: FunctionEnv, timeScale: string) => {
      const parsedTimeScale = parseFloat(timeScale);
      if (isNaN(parsedTimeScale)) {
        setTimeScaleTextFieldRef.current("0");
        dispatch({
          type: "UPDATE_ANIMATION_TIME_SCALE",
          timeScale: 1,
        });
        return;
      }
      dispatch({
        type: "UPDATE_ANIMATION_TIME_SCALE",
        timeScale: parseFloat(timeScale),
      });
    },
    [dispatch],
  );

  const timeRate = useMemo(() => {
    if (!props.simulationState.result.end_time_s) {
      return 0;
    }
    return props.simulationState.time / props.simulationState.result.end_time_s;
  }, [props.simulationState.result.end_time_s, props.simulationState.time]);

  const timeText = useMemo(() => {
    if (!props.simulationState.result.end_time_s) {
      return "0:00:00/0:00:00";
    }
    return `${Math.floor(props.simulationState.time / 3600)
      .toString()
      .padStart(2, "0")}:${Math.floor((props.simulationState.time % 3600) / 60)
      .toString()
      .padStart(2, "0")}:${Math.floor(props.simulationState.time % 60)
      .toString()
      .padStart(2, "0")}/${Math.floor(
      props.simulationState.result.end_time_s / 3600,
    )
      .toString()
      .padStart(2, "0")}:${Math.floor(
      (props.simulationState.result.end_time_s % 3600) / 60,
    )
      .toString()
      .padStart(2, "0")}:${Math.floor(
      props.simulationState.result.end_time_s % 60,
    )
      .toString()
      .padStart(2, "0")}`;
  }, [props.simulationState.result.end_time_s, props.simulationState.time]);

  const realTimeText = useMemo(() => {
    const startTime = props.simulationState.input.discovery.t0;
    const addTime = props.simulationState.time * 1000;
    const realTime = new Date(startTime.getTime() + addTime);
    return `${startTime.toLocaleDateString()} ${realTime.toLocaleTimeString()}`;
  }, [props.simulationState.input.discovery.t0, props.simulationState.time]);

  return (
    <VerticalLayout forceExpandChildHeight={false} spacing={10}>
      <LayoutElement minHeight={100}>
        <HorizontalLayout forceExpandChildWidth={false}>
          <LayoutElement minWidth={100}>
            <SimpleIconButton
              enabled={!props.simulationState.play}
              iconSprite={Sprite.iconPlay}
              onClick={onClickPlay}
            />
          </LayoutElement>
          <LayoutElement minWidth={100}>
            <SimpleIconButton
              enabled={props.simulationState.play}
              iconSprite={Sprite.iconPause}
              onClick={onClickPause}
            />
          </LayoutElement>
          <LayoutElement minWidth={100}>
            <SimpleIconButton
              iconSprite={Sprite.iconStop}
              onClick={onClickStop}
            />
          </LayoutElement>
        </HorizontalLayout>
      </LayoutElement>
      <LayoutElement minHeight={100}>
        <HorizontalLayout>
          <StyledText
            content="Time Scale"
            horizontalAlign="Center"
            verticalAlign="Middle"
          />
          <StyledTextFieldV2
            defaultValue={props.simulationState.timeScale.toString()}
            onChange={onChangeTimeScale}
            setValueRef={setTimeScaleTextFieldRef}
            styledBackgroundSprite={Sprite.circleBase}
          />
        </HorizontalLayout>
      </LayoutElement>

      <LayoutElement minHeight={50}>
        <StyledText
          content={realTimeText}
          horizontalAlign="Center"
          verticalAlign="Middle"
        />
      </LayoutElement>

      <LayoutElement minHeight={10}>
        <StyledImage defaultColor={[0.2, 0.2, 0.2, 1]} />
        <RectTransform anchorMax={[timeRate, 1]}>
          <StyledImage defaultColor={[0.4, 1, 0.4, 1]} />
        </RectTransform>
      </LayoutElement>
      <LayoutElement minHeight={50}>
        <StyledText
          content={timeText}
          horizontalAlign="Center"
          verticalAlign="Middle"
        />
      </LayoutElement>
    </VerticalLayout>
  );
};
