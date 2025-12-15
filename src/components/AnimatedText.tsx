import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

type Props = {
  text: string;
  startFrame?: number;
  durationFrames?: number; // テロップの表示フレーム数
  style?: React.CSSProperties;
};

// キラキラパーティクル
const Sparkle: React.FC<{
  delay: number;
  x: number;
  y: number;
}> = ({ delay, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delay;
  if (localFrame < 0 || localFrame > fps * 0.8) return null;

  const opacity = interpolate(
    localFrame,
    [0, fps * 0.2, fps * 0.6, fps * 0.8],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const scale = interpolate(
    localFrame,
    [0, fps * 0.3, fps * 0.8],
    [0.5, 1.2, 0.3],
    { extrapolateRight: "clamp" }
  );

  return (
    <span
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        transform: `scale(${scale})`,
        pointerEvents: "none",
        display: "inline-block",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path
          d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
          fill="#FFD700"
        />
      </svg>
    </span>
  );
};

export const AnimatedText: React.FC<Props> = ({
  text,
  startFrame = 0,
  durationFrames,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const characters = text.split("");
  const delayPerChar = 2; // フレーム間隔

  // フェードアウト開始フレーム（終了の0.5秒前から）
  const fadeOutStartFrame = durationFrames
    ? startFrame + durationFrames - fps * 0.5
    : Infinity;

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        ...style,
      }}
    >
      {characters.map((char, index) => {
        const charDelay = startFrame + index * delayPerChar;
        const localFrame = frame - charDelay;

        // フェードアウト用のディレイ（左から順に消える）
        const charFadeOutDelay = fadeOutStartFrame + index * delayPerChar;
        const fadeOutLocalFrame = frame - charFadeOutDelay;

        // スプリングアニメーション（出現時）
        const scaleValue = spring({
          frame: localFrame,
          fps,
          config: {
            damping: 12,
            stiffness: 200,
            mass: 0.5,
          },
        });

        // 出現時のopacity
        const fadeInOpacity = interpolate(
          localFrame,
          [0, 3],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // 消失時のopacity
        const fadeOutOpacity =
          durationFrames && frame >= fadeOutStartFrame
            ? interpolate(
                fadeOutLocalFrame,
                [0, 8],
                [1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )
            : 1;

        // 消失時のスケール（小さくなりながら消える）
        const fadeOutScale =
          durationFrames && frame >= fadeOutStartFrame
            ? interpolate(
                fadeOutLocalFrame,
                [0, 8],
                [1, 0.5],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )
            : 1;

        const opacity = fadeInOpacity * fadeOutOpacity;
        const scale = scaleValue * fadeOutScale;

        const translateY = interpolate(
          localFrame,
          [0, 8],
          [20, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // キラキラの位置をランダムに
        const sparkleX = ((index * 37) % 30) - 15;
        const sparkleY = ((index * 53) % 20) - 30;

        // 消失時もキラキラを表示
        const showFadeOutSparkle =
          durationFrames &&
          fadeOutLocalFrame >= 0 &&
          fadeOutLocalFrame < fps * 0.3;

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              opacity,
              transform: `scale(${scale}) translateY(${translateY}px)`,
              whiteSpace: char === " " ? "pre" : "normal",
              position: "relative",
            }}
          >
            {char}
            {/* 出現時キラキラエフェクト */}
            <Sparkle delay={charDelay + 2} x={sparkleX} y={sparkleY} />
            {/* 消失時キラキラエフェクト */}
            {showFadeOutSparkle && (
              <Sparkle delay={charFadeOutDelay} x={-sparkleX} y={sparkleY - 10} />
            )}
          </span>
        );
      })}
    </span>
  );
};
