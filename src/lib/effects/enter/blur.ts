import { interpolate } from "remotion";

export interface EnterEffectParams {
  frame: number;
  fps: number;
  charIndex: number;
  totalChars: number;
}

export interface EnterEffectStyle {
  opacity: number;
  transform: string;
  filter?: string;
}

/**
 * Blur effect - Text starts blurry and becomes clear
 * Characters appear with a blur filter that gradually clears
 */
export const blur = ({
  frame,
  fps,
  charIndex,
  totalChars,
}: EnterEffectParams): EnterEffectStyle => {
  const delayPerChar = 2; // frames between each character
  const appearDuration = fps * 0.4; // duration for blur to clear (0.4 seconds)

  const charStartFrame = charIndex * delayPerChar;
  const localFrame = frame - charStartFrame;

  // Opacity interpolation
  const opacity = interpolate(
    localFrame,
    [0, appearDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Blur interpolation - starts very blurry and becomes clear
  const blurAmount = interpolate(
    localFrame,
    [0, appearDuration],
    [10, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Slight scale effect for added impact
  const scale = interpolate(
    localFrame,
    [0, appearDuration],
    [1.1, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return {
    opacity,
    transform: `scale(${scale})`,
    filter: `blur(${blurAmount}px)`,
  };
};
