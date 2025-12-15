import { interpolate } from "remotion";

/**
 * 共通のエフェクトパラメータ
 */
export interface EffectParams {
  frame: number;
  fps: number;
  charIndex: number;
  totalChars: number;
}

/**
 * 出現・消失エフェクトのパラメータ（durationFrames付き）
 */
export interface ExitEffectParams extends EffectParams {
  durationFrames: number;
}

/**
 * エフェクトのスタイル出力
 */
export interface EffectStyle {
  opacity: number;
  transform: string;
  filter?: string;
  color?: string;
  textShadow?: string;
}

/**
 * 強調エフェクトのスタイル出力（opacityはオプション）
 */
export interface EmphasisStyle {
  transform?: string;
  filter?: string;
  color?: string;
  textShadow?: string;
  display?: string;
}

/**
 * interpolateの共通オプション（両端をclamp）
 */
export const CLAMP_OPTIONS = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/**
 * 文字ごとのスタガー遅延を計算
 */
export const calculateStaggerDelay = (
  charIndex: number,
  delayPerChar: number = 2
): number => {
  return charIndex * delayPerChar;
};

/**
 * 文字ごとの遅延フレーム数を計算（totalCharsベース）
 */
export const charDelay = (
  charIndex: number,
  totalChars: number,
  baseDelay: number = 2
): number => {
  return charIndex * baseDelay;
};

/**
 * ローカルフレーム（遅延を考慮したフレーム）を計算
 */
export const getLocalFrame = (
  frame: number,
  charIndex: number,
  delayPerChar: number = 2
): number => {
  return Math.max(0, frame - calculateStaggerDelay(charIndex, delayPerChar));
};

/**
 * 基本的なフェードイン opacity を計算
 */
export const calculateFadeIn = (
  localFrame: number,
  duration: number = 10
): number => {
  return interpolate(localFrame, [0, duration], [0, 1], CLAMP_OPTIONS);
};

/**
 * 基本的なフェードアウト opacity を計算
 */
export const calculateFadeOut = (
  localFrame: number,
  durationFrames: number,
  fadeStartRatio: number = 0.3
): number => {
  return interpolate(
    localFrame,
    [0, durationFrames * fadeStartRatio, durationFrames],
    [1, 1 - fadeStartRatio, 0],
    CLAMP_OPTIONS
  );
};

/**
 * 循環アニメーション用の進行度を計算
 */
export const getCycleProgress = (
  frame: number,
  cycleDuration: number,
  phaseOffset: number = 0
): number => {
  const adjustedFrame = frame + phaseOffset;
  return (adjustedFrame % cycleDuration) / cycleDuration;
};

/**
 * 決定論的な擬似乱数を生成（charIndexベース）
 */
export const getPseudoRandom = (
  charIndex: number,
  seed: number = 137.5
): number => {
  return (charIndex * seed) % 360;
};
