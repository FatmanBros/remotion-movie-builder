import React, { useEffect, useState } from "react";
import {
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  delayRender,
  continueRender,
  staticFile,
} from "remotion";
import { parseSrt } from "@remotion/captions";
import { SubtitleData, CaptionData, SpeakerStyle, TelopColor } from "../types";
import { EffectedText } from "../../components/EffectedText";
import { parseColorToRgb } from "../utils/colorUtils";
import {
  parseTelopPosition,
  getTelopPositionStyle,
} from "../utils/telopPosition";

/**
 * テキストから話者情報をパースする
 * 対応フォーマット: [話者名], （話者名）, (話者名)
 */
const parseSpeaker = (
  text: string
): { speaker: string | null; content: string } => {
  // [話者名] 形式
  const bracketMatch = text.match(/^\[([^\]]+)\]\s*/);
  if (bracketMatch) {
    return {
      speaker: bracketMatch[1],
      content: text.slice(bracketMatch[0].length),
    };
  }

  // （話者名） 形式（全角括弧）
  const fullWidthMatch = text.match(/^（([^）]+)）\s*/);
  if (fullWidthMatch) {
    return {
      speaker: fullWidthMatch[1],
      content: text.slice(fullWidthMatch[0].length),
    };
  }

  // (話者名) 形式（半角括弧）
  const parenMatch = text.match(/^\(([^)]+)\)\s*/);
  if (parenMatch) {
    return {
      speaker: parenMatch[1],
      content: text.slice(parenMatch[0].length),
    };
  }

  return { speaker: null, content: text };
};

/**
 * SRTファイルを非同期でロードするフック
 */
const useSrtFile = (filePath: string | undefined) => {
  const [captions, setCaptions] = useState<CaptionData[]>([]);
  const [handle] = useState(() => (filePath ? delayRender() : null));

  useEffect(() => {
    if (!filePath || !handle) return;

    fetch(staticFile(filePath))
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch SRT file: ${filePath}`);
        }
        return res.text();
      })
      .then((text) => {
        const { captions: parsed } = parseSrt({ input: text });
        setCaptions(
          parsed.map((c) => ({
            text: c.text,
            startMs: c.startMs,
            endMs: c.endMs,
          }))
        );
        continueRender(handle);
      })
      .catch((err) => {
        console.error("[SubtitleRenderer] Error loading SRT file:", err);
        continueRender(handle);
      });
  }, [filePath, handle]);

  return captions;
};

/**
 * 字幕レンダラーコンポーネント
 * SRT字幕をムービー全体のタイムラインで表示
 */
export const SubtitleRenderer: React.FC<{
  subtitles: SubtitleData;
}> = ({ subtitles }) => {
  const { fps, width } = useVideoConfig();
  const frame = useCurrentFrame();

  // ファイルパスの場合は非同期ロード
  const loadedCaptions = useSrtFile(subtitles.file);

  // キャプションリスト（パース済みまたはロード済み）
  const captions = subtitles.captions ?? loadedCaptions;

  // キャプションがない場合は何も表示しない
  if (captions.length === 0) {
    return null;
  }

  // 現在の時間（ミリ秒）
  const currentTimeMs = (frame / fps) * 1000;

  // 現在のフレームで表示すべき字幕を探す
  const currentCaption = captions.find(
    (c) => currentTimeMs >= c.startMs && currentTimeMs < c.endMs
  );

  if (!currentCaption) {
    return null;
  }

  // フレーム計算
  const startFrame = Math.round((currentCaption.startMs / 1000) * fps);
  const endFrame = Math.round((currentCaption.endMs / 1000) * fps);
  const durationFrames = endFrame - startFrame;

  // フェードイン・フェードアウトのフレーム数（0.2秒）
  const fadeFrames = Math.round(fps * 0.2);

  // オパシティ計算
  const opacity = interpolate(
    frame,
    [
      startFrame,
      startFrame + fadeFrames,
      endFrame - fadeFrames,
      endFrame,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // オプション
  const { effects, position, color, fontSize, overlay, speakers, showSpeakerName, prefix, suffix } = subtitles.options;
  const hasEffects = effects && (effects.enter || effects.exit || effects.emphasis);

  // 話者情報をパース
  const { speaker: rawSpeaker, content: captionContent } = parseSpeaker(currentCaption.text);

  // 話者別スタイルを取得
  const speakerStyle: SpeakerStyle | undefined = rawSpeaker && speakers ? speakers[rawSpeaker] : undefined;

  // 話者名（style.name があれば変換、なければ元の名前を使用）
  const speaker = speakerStyle?.name ?? rawSpeaker;

  // スタイルをマージ（話者別スタイル > デフォルトスタイル）
  const mergedColor: TelopColor | undefined = speakerStyle?.color ?? color;
  const mergedPosition = speakerStyle?.position ?? position ?? "bottom 10%";
  const mergedFontSize = speakerStyle?.fontSize ?? fontSize ?? 42;

  // prefix/suffix のプレースホルダーを置換
  const replacePlaceholder = (text: string) => {
    return text.replace(/\{\{\$speaker\}\}/g, speaker ?? "");
  };

  // 表示テキストを構築
  let displayText = captionContent;

  // showSpeakerName が true の場合は話者名も表示（prefix/suffix がない場合のデフォルト動作）
  if (showSpeakerName && speaker && !prefix && !suffix) {
    displayText = `${speaker}: ${captionContent}`;
  }

  // prefix/suffix が指定されている場合
  if (prefix || suffix) {
    const prefixText = prefix ? replacePlaceholder(prefix) : "";
    const suffixText = suffix ? replacePlaceholder(suffix) : "";
    displayText = `${prefixText}${captionContent}${suffixText}`;
  }

  // 位置スタイル
  const parsedPosition = parseTelopPosition(mergedPosition);
  const positionStyle = getTelopPositionStyle(parsedPosition, 0);

  // フォントサイズ
  const textFontSize = mergedFontSize;

  // オーバーレイ設定
  const overlayType = overlay?.type ?? "shadow";
  const overlayColor = parseColorToRgb(overlay?.color ?? "#000000");
  const overlayOpacity = overlay?.opacity ?? 0.7;

  // グラデーションオーバーレイ
  const getGradientOverlayStyle = () => {
    if (!overlay || overlayType !== "gradient") return null;

    const height = overlay.height ?? "30%";

    if (position?.toString().startsWith("top")) {
      return {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        height,
        background: `linear-gradient(to bottom, rgba(${overlayColor},0.9) 0%, rgba(${overlayColor},0.5) 50%, rgba(${overlayColor},0) 100%)`,
        pointerEvents: "none" as const,
      };
    }

    return {
      position: "absolute" as const,
      bottom: -1,
      left: 0,
      right: 0,
      height,
      background: `linear-gradient(to top, rgba(${overlayColor},0.9) 0%, rgba(${overlayColor},0.5) 50%, rgba(${overlayColor},0) 100%)`,
      pointerEvents: "none" as const,
    };
  };

  const gradientOverlayStyle = getGradientOverlayStyle();

  return (
    <>
      {/* グラデーションオーバーレイ */}
      {gradientOverlayStyle && (
        <div style={{ ...gradientOverlayStyle, opacity }} />
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 60px",
          opacity,
          zIndex: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          ...positionStyle,
        }}
      >
        <p
          style={{
            color: mergedColor?.text ?? "#ffffff",
            fontSize: textFontSize,
            fontWeight: "bold",
            margin: 0,
            textShadow: mergedColor?.shadow
              ? mergedColor.shadow.includes(",")
                ? mergedColor.shadow
                : `2px 2px 4px ${mergedColor.shadow}`
              : mergedColor?.stroke
                ? `2px 2px 4px rgba(0,0,0,0.5)`
                : `2px 2px 6px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)`,
            WebkitTextStroke: mergedColor?.stroke
              ? `${mergedColor.strokeWidth ?? 2}px ${mergedColor.stroke}`
              : undefined,
            WebkitTextFillColor: mergedColor?.stroke
              ? mergedColor.text ?? "#ffffff"
              : undefined,
            paintOrder: mergedColor?.stroke ? "stroke fill" : undefined,
            fontFamily:
              '"Noto Sans JP", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
            lineHeight: 1.4,
            maxWidth: width - 120,
          }}
        >
          {hasEffects ? (
            <EffectedText
              text={displayText}
              startFrame={startFrame}
              durationFrames={durationFrames}
              effects={effects!}
              color={mergedColor}
            />
          ) : (
            displayText
          )}
        </p>
      </div>
    </>
  );
};
