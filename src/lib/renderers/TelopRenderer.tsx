import React from "react";
import { Sequence, useVideoConfig, useCurrentFrame, interpolate, Audio, staticFile } from "remotion";
import { AnimatedEmoji, EmojiName } from "@remotion/animated-emoji";
import { TelopData } from "../types";
import { EffectedText } from "../../components/EffectedText";
import { DoubleStrokeText } from "../../components/DoubleStrokeText";

/**
 * 色をRGB形式に変換
 * - "#ffffff" → "255,255,255"
 * - "#fff" → "255,255,255"
 * - "255,255,255" → "255,255,255"（そのまま）
 */
const parseColorToRgb = (color: string): string => {
  // すでにRGB形式の場合はそのまま返す
  if (color.includes(",")) {
    return color;
  }

  // #hex形式の場合
  if (color.startsWith("#")) {
    let hex = color.slice(1);
    // 3桁の場合は6桁に展開
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `${r},${g},${b}`;
  }

  // それ以外はデフォルトで黒
  return "0,0,0";
};

// テロップの推定高さを計算（横幅と文字サイズから正確に折り返し回数を計算）
const estimateTelopHeight = (text: string, containerWidth: number): number => {
  const fontSize = 48; // テロップの文字サイズ（px）
  const padding = 40 * 2; // 左右のパディング
  const lineHeight = fontSize * 1.4; // 行の高さ（文字サイズの1.4倍）
  const charWidth = fontSize; // 日本語はほぼ正方形

  const availableWidth = containerWidth - padding;
  const charsPerLine = Math.floor(availableWidth / charWidth);
  const lines = Math.ceil(text.length / charsPerLine);

  return lines * lineHeight;
};

// テロップ位置をパース
// "bottom" | "top" | "center" | "bottom 20%" | "top 15%" | "20%" | "80px"
type ParsedTelopPosition = {
  anchor: "top" | "bottom" | "center";
  offset: string; // "120px" | "20%" など
};

const parseTelopPosition = (position: string): ParsedTelopPosition => {
  const defaultOffset = "120px";

  // 基本プリセット
  if (position === "bottom") {
    return { anchor: "bottom", offset: defaultOffset };
  }
  if (position === "top") {
    return { anchor: "top", offset: defaultOffset };
  }
  if (position === "center") {
    return { anchor: "center", offset: "0px" };
  }

  // 複合パターン: "bottom 20%" や "top 15%"
  const parts = position.split(/\s+/);
  let anchor: "top" | "bottom" | "center" = "bottom";
  let offset = defaultOffset;

  for (const part of parts) {
    if (part === "top" || part === "bottom" || part === "center") {
      anchor = part;
    } else if (part.match(/^\d+(\.\d+)?(%|px)$/)) {
      offset = part;
    }
  }

  return { anchor, offset };
};

// 同時に表示されるテロップの累積オフセットを計算
const calculateStackOffset = (
  telop: TelopData,
  allTelops: TelopData[],
  currentFrame: number,
  fps: number,
  containerWidth: number
): number => {
  const telopStart = telop.startTime * fps;
  const telopEnd = (telop.startTime + telop.duration) * fps;

  if (currentFrame < telopStart || currentFrame >= telopEnd) {
    return 0;
  }

  const visibleTelops = allTelops
    .filter((t) => {
      const start = t.startTime * fps;
      const end = (t.startTime + t.duration) * fps;
      return currentFrame >= start && currentFrame < end;
    })
    .sort((a, b) => a.startTime - b.startTime);

  const telopIndex = visibleTelops.findIndex((t) => t === telop);
  if (telopIndex <= 0) return 0;

  // 自分より前のテロップの高さを累積
  let offset = 0;
  for (let i = 0; i < telopIndex; i++) {
    offset += estimateTelopHeight(visibleTelops[i].text, containerWidth);
  }
  return offset;
};

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

  const getPositionStyle = (): React.CSSProperties => {
    const parsed = parseTelopPosition(telop.position);
    const { anchor, offset } = parsed;

    // オフセットが%かpxか判定
    const isPercent = offset.endsWith("%");
    const offsetValue = parseFloat(offset);

    if (anchor === "top") {
      if (isPercent) {
        return {
          top: `calc(${offset} + ${stackOffset}px)`,
          bottom: "auto",
        };
      }
      return { top: offsetValue + stackOffset, bottom: "auto" };
    }

    if (anchor === "center") {
      return {
        top: "50%",
        bottom: "auto",
        transform: `translateY(calc(-50% + ${stackOffset}px))`,
      };
    }

    // bottom（デフォルト）
    if (isPercent) {
      return {
        bottom: `calc(${offset} + ${stackOffset}px)`,
        top: "auto",
      };
    }
    return { bottom: offsetValue + stackOffset, top: "auto" };
  };

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
              ...getPositionStyle(),
            }}
          >
            {/* ボックスオーバーレイ（テキストの後ろ） */}
            <span style={textBackgroundStyle ?? undefined}>
              {/* 二重縁取り（outerStroke指定時）はSVGで描画 */}
              {telop.color?.outerStroke ? (
                <DoubleStrokeText
                  text={telop.text}
                  fontSize={48}
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
                    fontSize: 48,
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
                style={{ height: 48 }}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};
