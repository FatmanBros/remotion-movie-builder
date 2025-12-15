import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  Img,
  OffthreadVideo,
  Html5Video,
  staticFile,
} from "remotion";
import { SceneData, EffectType, TransitionType } from "../types";
import { GridTransition, isGridTransition } from "../../components/GridTransition";
import { TelopRenderer } from "./TelopRenderer";
import { WipeRenderer } from "./WipeRenderer";
import { FixedElementRenderer } from "./FixedElementRenderer";
import {
  parseDisplayMode,
  getDisplayModeContainerStyle,
  getDisplayModeMediaStyle,
} from "../utils/displayMode";

// エフェクトに基づいたopacityを計算
const calculateEffectOpacity = (
  frame: number,
  fps: number,
  startFrame: number,
  durationFrames: number,
  effects: EffectType[]
): number => {
  const hasFadeIn = effects.includes("fadeIn");
  const hasFadeOut = effects.includes("fadeOut");
  const fadeFrames = fps * 0.5;

  let opacity = 1;

  if (hasFadeIn) {
    const fadeInProgress = interpolate(
      frame,
      [startFrame, startFrame + fadeFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    opacity = Math.min(opacity, fadeInProgress);
  }

  if (hasFadeOut) {
    const endFrame = startFrame + durationFrames;
    const fadeOutProgress = interpolate(
      frame,
      [endFrame - fadeFrames, endFrame],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    opacity = Math.min(opacity, fadeOutProgress);
  }

  return opacity;
};

// トランジションスタイルを計算
const calculateTransitionStyle = (
  progress: number,
  transition: TransitionType
): React.CSSProperties => {
  switch (transition) {
    case "wipeLeft":
      return { clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` };
    case "wipeRight":
      return { clipPath: `inset(0 0 0 ${(1 - progress) * 100}%)` };
    case "wipeUp":
      return { clipPath: `inset(0 0 ${(1 - progress) * 100}% 0)` };
    case "wipeDown":
      return { clipPath: `inset(${(1 - progress) * 100}% 0 0 0)` };
    case "slideLeft":
      return { transform: `translateX(${(1 - progress) * 100}%)` };
    case "slideRight":
      return { transform: `translateX(${(1 - progress) * -100}%)` };
    case "slideUp":
      return { transform: `translateY(${(1 - progress) * 100}%)` };
    case "slideDown":
      return { transform: `translateY(${(1 - progress) * -100}%)` };
    case "zoomIn":
      return { transform: `scale(${progress})`, opacity: progress };
    case "zoomOut":
      return {
        transform: `scale(${1 + (1 - progress) * 0.5})`,
        opacity: progress,
      };
    case "blur":
      return { filter: `blur(${(1 - progress) * 20}px)`, opacity: progress };
    case "flipLeft":
      return {
        transform: `perspective(1000px) rotateY(${(1 - progress) * -90}deg)`,
        transformOrigin: "left center",
        opacity: progress > 0.5 ? 1 : progress * 2,
      };
    case "flipRight":
      return {
        transform: `perspective(1000px) rotateY(${(1 - progress) * 90}deg)`,
        transformOrigin: "right center",
        opacity: progress > 0.5 ? 1 : progress * 2,
      };
    case "flipUp":
      return {
        transform: `perspective(1000px) rotateX(${(1 - progress) * 90}deg)`,
        transformOrigin: "center top",
        opacity: progress > 0.5 ? 1 : progress * 2,
      };
    case "flipDown":
      return {
        transform: `perspective(1000px) rotateX(${(1 - progress) * -90}deg)`,
        transformOrigin: "center bottom",
        opacity: progress > 0.5 ? 1 : progress * 2,
      };
    case "fade":
    default:
      return { opacity: progress };
  }
};

// シーンコンテンツ
const SceneContent: React.FC<{
  scene: SceneData;
  crossFadeInDuration?: number;
  crossFadeOutDuration?: number;
  crossFadeTransition: TransitionType;
}> = ({ scene, crossFadeInDuration, crossFadeOutDuration, crossFadeTransition }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const durationFrames = Math.round(fps * scene.duration);
  const trimBeforeFrames = Math.round(fps * scene.trimBefore);

  const effectOpacity = calculateEffectOpacity(
    frame,
    fps,
    0,
    durationFrames,
    scene.effects
  );

  let transitionInProgress = 1;
  if (crossFadeInDuration) {
    const crossFadeFrames = fps * crossFadeInDuration;
    transitionInProgress = interpolate(frame, [0, crossFadeFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  let transitionOutProgress = 1;
  if (crossFadeOutDuration) {
    const crossFadeFrames = fps * crossFadeOutDuration;
    transitionOutProgress = interpolate(
      frame,
      [durationFrames - crossFadeFrames, durationFrames],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  const useGridTransition =
    crossFadeInDuration && isGridTransition(crossFadeTransition);

  const transitionStyle =
    crossFadeInDuration &&
    !useGridTransition &&
    crossFadeTransition !== "fade"
      ? calculateTransitionStyle(transitionInProgress, crossFadeTransition)
      : {};

  let finalOpacity = effectOpacity;
  if (
    crossFadeInDuration &&
    (crossFadeTransition === "fade" || useGridTransition)
  ) {
    finalOpacity *= useGridTransition ? 1 : transitionInProgress;
  }
  if (crossFadeOutDuration) {
    finalOpacity *= transitionOutProgress;
  }

  const baseVolume = scene.volume ?? 1;

  const volumeFunction = (f: number) => {
    const maxFadeIn = fps * 5;
    const maxFadeOut = fps * 3;
    const totalFade = maxFadeIn + maxFadeOut;
    const ratio = Math.min(1, durationFrames / totalFade);
    const fadeInFrames = Math.floor(maxFadeIn * ratio);
    const fadeOutFrames = Math.floor(maxFadeOut * ratio);

    if (durationFrames <= 2) {
      return baseVolume;
    }

    const fadeOutStart = Math.max(
      fadeInFrames + 1,
      durationFrames - fadeOutFrames
    );
    const fadeMultiplier = interpolate(
      f,
      [0, fadeInFrames, fadeOutStart, durationFrames],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return baseVolume * fadeMultiplier;
  };

  // displayModeをパースしてスタイルを取得
  const parsedDisplayMode = parseDisplayMode(scene.displayMode);
  const videoContainerStyle = getDisplayModeContainerStyle(parsedDisplayMode, scene.backgroundColor);
  const mediaStyle = getDisplayModeMediaStyle(parsedDisplayMode, "cover");

  // 動画コンポーネント（ループ有効時はHtml5Video、無効時はOffthreadVideo）
  const videoContent = scene.file ? (
    <div style={videoContainerStyle}>
      {scene.loop ? (
        <Html5Video
          src={staticFile(scene.file)}
          trimBefore={trimBeforeFrames}
          volume={volumeFunction}
          style={mediaStyle}
          loop
        />
      ) : (
        <OffthreadVideo
          src={staticFile(scene.file)}
          trimBefore={trimBeforeFrames}
          volume={volumeFunction}
          style={mediaStyle}
        />
      )}
    </div>
  ) : scene.image ? (
    <div style={videoContainerStyle}>
      <Img
        src={staticFile(scene.image)}
        style={mediaStyle}
      />
    </div>
  ) : scene.backgroundColor ? (
    <div
      style={{
        ...videoContainerStyle,
        backgroundColor: scene.backgroundColor,
      }}
    />
  ) : null;

  return (
    <>
      {useGridTransition ? (
        <GridTransition
          progress={transitionInProgress}
          transition={crossFadeTransition}
          gridSize={6}
        >
          <AbsoluteFill
            style={{ opacity: effectOpacity * transitionOutProgress }}
          >
            {videoContent}
          </AbsoluteFill>
        </GridTransition>
      ) : (
        <AbsoluteFill style={{ opacity: finalOpacity, ...transitionStyle }}>
          {videoContent}
        </AbsoluteFill>
      )}

      {scene.wipes.map((wipe, index) => (
        <WipeRenderer
          key={index}
          wipe={wipe}
          sceneDuration={scene.duration}
          index={index}
        />
      ))}

      {/* シーン固定要素 */}
      {scene.fixedElements.length > 0 && (
        <FixedElementRenderer elements={scene.fixedElements} />
      )}

      {scene.telops.map((telop, index) => (
        <TelopRenderer key={index} telop={telop} allTelops={scene.telops} />
      ))}
    </>
  );
};

// シーンコンポーネント（Sequenceでラップ）
export const SceneRenderer: React.FC<{
  scene: SceneData;
  crossFadeInDuration?: number;
  crossFadeOutDuration?: number;
  crossFadeTransition?: TransitionType;
}> = ({
  scene,
  crossFadeInDuration,
  crossFadeOutDuration,
  crossFadeTransition = "fade",
}) => {
  const { fps } = useVideoConfig();
  const startFrame = Math.round(fps * scene.startTime);
  // durationが0以下の場合は1フレーム以上を保証
  const durationFrames = Math.max(1, Math.round(fps * scene.duration));

  return (
    <Sequence from={startFrame} durationInFrames={durationFrames}>
      <SceneContent
        scene={scene}
        crossFadeInDuration={crossFadeInDuration}
        crossFadeOutDuration={crossFadeOutDuration}
        crossFadeTransition={crossFadeTransition}
      />
    </Sequence>
  );
};
