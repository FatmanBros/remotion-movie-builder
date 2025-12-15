/**
 * トランジション関連のユーティリティ
 */

import React from "react";
import { interpolate } from "remotion";
import { EffectType, TransitionType } from "../types";

/**
 * シーンエフェクト（fadeIn/fadeOut）に基づいたopacityを計算
 */
export const calculateEffectOpacity = (
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

/**
 * トランジションタイプに基づいたCSSスタイルを計算
 * @param progress 進行度 (0-1)
 * @param transition トランジションタイプ
 */
export const calculateTransitionStyle = (
  progress: number,
  transition: TransitionType
): React.CSSProperties => {
  switch (transition) {
    // ワイプ系
    case "wipeLeft":
      return { clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` };
    case "wipeRight":
      return { clipPath: `inset(0 0 0 ${(1 - progress) * 100}%)` };
    case "wipeUp":
      return { clipPath: `inset(0 0 ${(1 - progress) * 100}% 0)` };
    case "wipeDown":
      return { clipPath: `inset(${(1 - progress) * 100}% 0 0 0)` };

    // スライド系
    case "slideLeft":
      return { transform: `translateX(${(1 - progress) * 100}%)` };
    case "slideRight":
      return { transform: `translateX(${(1 - progress) * -100}%)` };
    case "slideUp":
      return { transform: `translateY(${(1 - progress) * 100}%)` };
    case "slideDown":
      return { transform: `translateY(${(1 - progress) * -100}%)` };

    // ズーム系
    case "zoomIn":
      return { transform: `scale(${progress})`, opacity: progress };
    case "zoomOut":
      return {
        transform: `scale(${1 + (1 - progress) * 0.5})`,
        opacity: progress,
      };

    // ブラー
    case "blur":
      return { filter: `blur(${(1 - progress) * 20}px)`, opacity: progress };

    // フリップ系
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

    // フェード（デフォルト）
    case "fade":
    default:
      return { opacity: progress };
  }
};
