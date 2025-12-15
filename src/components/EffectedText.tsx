import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { TelopEffects, TelopColor } from "../lib/types";
import { effectMap } from "../lib/effects";

type Props = {
  text: string;
  startFrame: number;
  durationFrames: number;
  effects: TelopEffects;
  style?: React.CSSProperties;
  color?: TelopColor;
};

// キラキラパーティクル（星）
const Sparkle: React.FC<{
  delay: number;
  x: number;
  y: number;
  duration?: number;
}> = ({ delay, x, y, duration = 0.8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delay;
  if (localFrame < 0 || localFrame > fps * duration) return null;

  const opacity = interpolate(
    localFrame,
    [0, fps * 0.2, fps * (duration - 0.2), fps * duration],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const scale = interpolate(
    localFrame,
    [0, fps * 0.3, fps * duration],
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
        zIndex: 10,
        filter: `drop-shadow(0 0 4px #FFD700) drop-shadow(0 0 8px #FFA500) drop-shadow(0 0 12px #FFFFFF)`,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 16 16">
        <path
          d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
          fill="#FFFACD"
        />
      </svg>
    </span>
  );
};

export const EffectedText: React.FC<Props> = ({
  text,
  startFrame,
  durationFrames,
  effects,
  style = {},
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const characters = text.split("");
  const totalChars = characters.length;

  // エフェクトの適用期間を計算
  const enterDuration = fps * 0.5; // 出現エフェクト: 0.5秒
  const exitStartFrame = startFrame + durationFrames - fps * 0.5; // 消失開始: 終了0.5秒前

  const isKirakira = effects.emphasis === "kirakira";

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        ...style,
      }}
    >
      {characters.map((char, index) => {
        const localFrame = frame - startFrame;
        const charDelay = startFrame + index * 2;

        // 各エフェクトのスタイルを計算
        let enterStyle: React.CSSProperties = {};
        let exitStyle: React.CSSProperties = {};
        let emphasisStyle: React.CSSProperties = {};

        // 出現エフェクト
        if (effects.enter && localFrame < enterDuration + index * 2) {
          const effectFn = getEnterEffect(effects.enter);
          if (effectFn) {
            const result = effectFn(localFrame, fps, index, totalChars);
            enterStyle = {
              opacity: result.opacity,
              transform: result.transform,
              filter: (result as any).filter,
            };
          }
        }

        // 消失エフェクト
        if (effects.exit && frame >= exitStartFrame) {
          const exitLocalFrame = frame - exitStartFrame;
          const effectFn = getExitEffect(effects.exit);
          if (effectFn) {
            const result = effectFn(exitLocalFrame, fps, index, totalChars, fps * 0.5);
            exitStyle = result;
          }
        }

        // 強調エフェクト（出現後・消失前の間、kirakira以外）
        if (effects.emphasis && effects.emphasis !== "kirakira" && localFrame >= enterDuration && frame < exitStartFrame) {
          const effectFn = getEmphasisEffect(effects.emphasis);
          if (effectFn) {
            emphasisStyle = effectFn({
              frame: localFrame,
              fps,
              charIndex: index,
              totalChars,
            });
          }
        }

        // スタイルをマージ（優先順位: exit > emphasis > enter）
        const isEntering = localFrame < enterDuration + index * 2;
        const isExiting = frame >= exitStartFrame;

        // 色・縁取りスタイル
        const colorStyle: React.CSSProperties = color?.stroke
          ? {
              WebkitTextStroke: `${color.strokeWidth ?? 2}px ${color.stroke}`,
              WebkitTextFillColor: color.text ?? "#ffffff",
              paintOrder: "stroke fill",
              marginRight: `${(color.strokeWidth ?? 2) * 0.5}px`,
            }
          : {};

        let finalStyle: React.CSSProperties = {
          display: "inline-block",
          whiteSpace: char === " " ? "pre" : "normal",
          position: "relative",
          ...colorStyle,
        };

        if (isExiting && effects.exit) {
          finalStyle = { ...finalStyle, ...exitStyle };
        } else if (isEntering && effects.enter) {
          finalStyle = { ...finalStyle, ...enterStyle };
        } else if (effects.emphasis && effects.emphasis !== "kirakira") {
          finalStyle = { ...finalStyle, ...emphasisStyle };
        }

        // キラキラの位置をランダムに（決定論的）
        const sparkleX = ((index * 37) % 30) - 15;
        const sparkleY = ((index * 53) % 20) - 30;

        // 出現時のキラキラを表示するか
        const showEnterSparkle = isKirakira && isEntering && localFrame >= index * 2;

        // 消失時のキラキラを表示するか
        const exitLocalFrame = frame - exitStartFrame;
        const charFadeOutDelay = exitStartFrame + index * 2;
        const showExitSparkle = isKirakira && isExiting && exitLocalFrame >= 0 && exitLocalFrame < fps * 0.3;

        // 表示中のキラキラ（ループ）
        const emphasisPhase = localFrame >= enterDuration && frame < exitStartFrame;
        const sparkleInterval = fps * 1.5; // 1.5秒ごとにキラキラ
        const sparkleOffset = (index * 7) % Math.floor(sparkleInterval);
        const sparkleFrame = (localFrame - enterDuration + sparkleOffset) % sparkleInterval;
        const showEmphasisSparkle = isKirakira && emphasisPhase && sparkleFrame < fps * 0.5;

        return (
          <span key={index} style={finalStyle}>
            {char}
            {/* 出現時キラキラ */}
            {showEnterSparkle && (
              <Sparkle delay={charDelay + 2} x={sparkleX} y={sparkleY} />
            )}
            {/* 表示中キラキラ（ループ） */}
            {showEmphasisSparkle && (
              <Sparkle
                delay={startFrame + enterDuration - sparkleOffset + Math.floor((localFrame - enterDuration) / sparkleInterval) * sparkleInterval}
                x={-sparkleX + 5}
                y={sparkleY - 5}
                duration={0.5}
              />
            )}
            {/* 消失時キラキラ */}
            {showExitSparkle && (
              <Sparkle delay={charFadeOutDelay} x={-sparkleX} y={sparkleY - 10} />
            )}
          </span>
        );
      })}
    </span>
  );
};

// 出現エフェクト取得
function getEnterEffect(effectName: string) {
  return effectMap.enter[effectName as keyof typeof effectMap.enter] ?? null;
}

// 消失エフェクト取得
function getExitEffect(effectName: string) {
  return effectMap.exit[effectName as keyof typeof effectMap.exit] ?? null;
}

// 強調エフェクト取得
function getEmphasisEffect(effectName: string) {
  return effectMap.emphasis[effectName as keyof typeof effectMap.emphasis] ?? null;
}
