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
 * Typewriter effect - Characters appear one by one like typing
 * Each character fades in quickly with a slight delay based on its index
 */
export const typewriter = ({
  frame,
  fps,
  charIndex,
  totalChars,
}: EnterEffectParams): EnterEffectStyle => {
  const delayPerChar = 3; // frames between each character
  const appearDuration = 5; // frames for each character to fully appear

  const charStartFrame = charIndex * delayPerChar;
  const localFrame = frame - charStartFrame;

  // Opacity interpolation - quick fade in
  const opacity = interpolate(
    localFrame,
    [0, appearDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Slight scale up effect as it appears
  const scale = interpolate(
    localFrame,
    [0, appearDuration],
    [0.8, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return {
    opacity,
    transform: `scale(${scale})`,
  };
};
