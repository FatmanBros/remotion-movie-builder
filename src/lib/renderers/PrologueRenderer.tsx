import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  Img,
  staticFile,
} from "remotion";
import { TelopData, EffectType, DisplayMode } from "../types";
import { TelopRenderer } from "./TelopRenderer";
import {
  parseDisplayMode,
  getDisplayModeContainerStyle,
  getDisplayModeMediaStyle,
} from "../utils/displayMode";

// オープニング・エンディングコンポーネント
export const OpeningEndingRenderer: React.FC<{
  type: "opening" | "ending";
  data: {
    duration: number;
    image: string;
    effect?: EffectType;
    telops: TelopData[];
    displayMode?: DisplayMode;
  };
  startTime: number;
}> = ({ data, startTime }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const startFrame = Math.round(fps * startTime);
  // durationが0以下の場合は1フレーム以上を保証
  const durationFrames = Math.max(1, Math.round(fps * data.duration));

  const hasFadeIn = data.effect === "fadeIn";
  const hasFadeOut = data.effect === "fadeOut";
  const fadeFrames = fps * 0.5;

  let opacity = 1;

  if (hasFadeIn) {
    opacity = interpolate(
      frame,
      [startFrame, startFrame + fadeFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  if (hasFadeOut) {
    const endFrame = startFrame + durationFrames;
    opacity = interpolate(
      frame,
      [endFrame - fadeFrames, endFrame],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  // displayModeをパースしてスタイルを取得
  const parsedDisplayMode = parseDisplayMode(data.displayMode ?? "contain");
  const containerStyle = getDisplayModeContainerStyle(parsedDisplayMode, "#1a1a2e");
  const mediaStyle = getDisplayModeMediaStyle(parsedDisplayMode, "contain");

  return (
    <Sequence from={startFrame} durationInFrames={durationFrames}>
      <AbsoluteFill
        style={{
          ...containerStyle,
          opacity,
        }}
      >
        <Img
          src={staticFile(data.image)}
          style={mediaStyle}
        />
      </AbsoluteFill>

      {data.telops.map((telop, index) => (
        <TelopRenderer key={index} telop={telop} allTelops={data.telops} />
      ))}
    </Sequence>
  );
};
