import React from "react";
import { Sequence, useVideoConfig, useCurrentFrame, interpolate, Audio, staticFile } from "remotion";
import { AnimatedEmoji, EmojiName } from "@remotion/animated-emoji";
import { TelopData } from "../types";
import { EffectedText } from "../../components/EffectedText";
import { DoubleStrokeText } from "../../components/DoubleStrokeText";
import { parseColorToRgb } from "../utils/colorUtils";
import {
  parseTelopPosition,
  calculateStackOffset,
  getTelopPositionStyle,
} from "../utils/telopPosition";

// テロップコンポーネント
export const TelopRenderer: React.FC<{
  telop: TelopData;
  allTelops: TelopData[];
}> = ({ telop, allTelops }) => {
  const { fps, width } = useVideoConfig();
  const frame = useCurrentFrame();

  const telopStartFrame = Math.round(fps * telop.startTime);
  // durationが0以下の場合は1フレーム以上を保証
  const telopDurationFrames = Math.max(1, Math.round(fps * telop.duration));

  const telopOpacity = interpolate(
    frame,
    [
      telopStartFrame,
      telopStartFrame + fps * 0.3,
      telopStartFrame + telopDurationFrames - fps * 0.3,
      telopStartFrame + telopDurationFrames,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const isVisible =
    frame >= telopStartFrame && frame < telopStartFrame + telopDurationFrames;

  const hasEffects =
    telop.effects &&
    (telop.effects.enter || telop.effects.exit || telop.effects.emphasis);

  const stackOffset = calculateStackOffset(telop, allTelops, frame, fps, width);
  const parsedPosition = parseTelopPosition(telop.position);
  const positionStyle = getTelopPositionStyle(parsedPosition, stackOffset);

  // フォントサイズ（デフォルト: 48）
  const fontSize = telop.fontSize ?? 48;

  const overlayType = telop.overlay?.type ?? "gradient";
  const overlayColor = parseColorToRgb(telop.overlay?.color ?? "#000000");
  const overlayOpacity = telop.overlay?.opacity ?? 0.7;

  // グラデーションオーバーレイ（画面端からのグラデーション）
  const getGradientOverlayStyle = () => {
    if (!telop.overlay || overlayType !== "gradient") return null;

    const height = telop.overlay.height ?? "50%";

    if (telop.position === "top") {
      return {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        height,
        background: `linear-gradient(to bottom, rgba(${overlayColor},0.95) 0%, rgba(${overlayColor},0.7) 40%, rgba(${overlayColor},0) 100%)`,
        pointerEvents: "none" as const,
      };
    }

    return {
      position: "absolute" as const,
      bottom: -1,
      left: 0,
      right: 0,
      height,
      background: `linear-gradient(to top, rgba(${overlayColor},0.95) 0%, rgba(${overlayColor},0.7) 40%, rgba(${overlayColor},0) 100%)`,
      pointerEvents: "none" as const,
    };
  };

  // ボックスオーバーレイ（テキストの後ろに矩形）
  const getTextBackgroundStyle = (): React.CSSProperties | null => {
    if (!telop.overlay || overlayType !== "box") return null;

    const padding = telop.overlay.padding ?? 16;
    const borderRadius = telop.overlay.borderRadius ?? 8;

    return {
      backgroundColor: `rgba(${overlayColor}, ${overlayOpacity})`,
      padding: `${padding * 0.5}px ${padding}px`,
      borderRadius,
    };
  };

  // シャドーオーバーレイ用のtext-shadow（文字の形でぼかし）
  const getShadowTextShadow = (): string | null => {
    if (!telop.overlay || overlayType !== "shadow") return null;

    const blur = telop.overlay.padding ?? 16; // blurの大きさ
    // 複数方向にぼかしシャドーをかけて文字の形を強調
    return `
      0 0 ${blur}px rgba(${overlayColor}, ${overlayOpacity}),
      0 0 ${blur * 2}px rgba(${overlayColor}, ${overlayOpacity * 0.8}),
      0 0 ${blur * 3}px rgba(${overlayColor}, ${overlayOpacity * 0.6}),
      0 0 ${blur * 4}px rgba(${overlayColor}, ${overlayOpacity * 0.4})
    `;
  };

  const gradientOverlayStyle = getGradientOverlayStyle();
  const textBackgroundStyle = getTextBackgroundStyle();
  const shadowTextShadow = getShadowTextShadow();

  return (
    <>
      {telop.sfx && (
        <Sequence from={telopStartFrame} durationInFrames={telopDurationFrames}>
          <Audio src={staticFile(telop.sfx.file)} volume={telop.sfx.volume} />
        </Sequence>
      )}

      {isVisible && (
        <>
          {/* グラデーションオーバーレイ（画面端から） */}
          {gradientOverlayStyle && (
            <div style={{ ...gradientOverlayStyle, opacity: telopOpacity }} />
          )}

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              padding: "0 40px",
              opacity: telopOpacity,
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
              ...positionStyle,
            }}
          >
            {/* ボックスオーバーレイ（テキストの後ろ） */}
            <span style={textBackgroundStyle ?? undefined}>
              {/* 二重縁取り（outerStroke指定時）はSVGで描画 */}
              {telop.color?.outerStroke ? (
                <DoubleStrokeText
                  text={telop.text}
                  fontSize={fontSize}
                  fillColor={telop.color.text ?? "#ffdd00"}
                  innerStroke={telop.color.stroke ?? "#ffffff"}
                  innerStrokeWidth={telop.color.strokeWidth ?? 8}
                  outerStroke={telop.color.outerStroke}
                  outerStrokeWidth={telop.color.outerStrokeWidth ?? 16}
                  shadow={overlayType === "shadow" ? {
                    color: overlayColor,
                    opacity: overlayOpacity,
                    blur: telop.overlay?.padding ?? 16,
                  } : undefined}
                />
              ) : (
                <p
                  style={{
                    color: telop.color?.text ?? "#ffffff",
                    fontSize,
                    fontWeight: "bold",
                    margin: 0,
                    textShadow: shadowTextShadow
                      ? shadowTextShadow
                      : telop.color?.shadow
                        ? (telop.color.shadow.includes(",") ? telop.color.shadow : `3px 3px 6px ${telop.color.shadow}`)
                        : telop.color?.stroke
                          ? `2px 2px 4px rgba(0,0,0,0.5)`
                          : `3px 3px 6px rgba(0,0,0,0.8)`,
                    WebkitTextStroke: telop.color?.stroke
                      ? `${telop.color.strokeWidth ?? 2}px ${telop.color.stroke}`
                      : undefined,
                    WebkitTextFillColor: telop.color?.stroke
                      ? telop.color.text ?? "#ffffff"
                      : undefined,
                    paintOrder: telop.color?.stroke ? "stroke fill" : undefined,
                    letterSpacing: telop.color?.stroke
                      ? `${(telop.color.strokeWidth ?? 2) * 0.5}px`
                      : undefined,
                    fontFamily:
                      '"Noto Sans JP", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
                  }}
                >
                  {hasEffects ? (
                    <EffectedText
                      text={telop.text}
                      startFrame={telopStartFrame}
                      durationFrames={telopDurationFrames}
                      effects={telop.effects!}
                      color={telop.color}
                    />
                  ) : (
                    telop.text
                  )}
                </p>
              )}
            </span>
            {telop.emoji && (
              <AnimatedEmoji
                emoji={telop.emoji as EmojiName}
                style={{ height: fontSize }}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};
