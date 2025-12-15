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
 * Elastic effect - Text stretches like a rubber band
 * Characters bounce in with an elastic overshoot effect
 */
export const elastic = ({
  frame,
  fps,
  charIndex,
  totalChars,
}: EnterEffectParams): EnterEffectStyle => {
  const delayPerChar = 2; // frames between each character
  const appearDuration = fps * 0.6; // duration for elastic animation (0.6 seconds)

  const charStartFrame = charIndex * delayPerChar;
  const localFrame = frame - charStartFrame;

  // Opacity interpolation
  const opacity = interpolate(
    localFrame,
    [0, appearDuration * 0.2],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Elastic scale effect with overshoot and bounce
  // Creates a rubber band effect: 0 -> overshoot -> settle
  const scaleX = interpolate(
    localFrame,
    [0, appearDuration * 0.3, appearDuration * 0.5, appearDuration * 0.7, appearDuration],
    [0, 1.3, 0.9, 1.05, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const scaleY = interpolate(
    localFrame,
    [0, appearDuration * 0.3, appearDuration * 0.5, appearDuration * 0.7, appearDuration],
    [0, 0.8, 1.1, 0.95, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Vertical bounce
  const translateY = interpolate(
    localFrame,
    [0, appearDuration * 0.4, appearDuration * 0.6, appearDuration],
    [-30, 5, -2, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return {
    opacity,
    transform: `scaleX(${scaleX}) scaleY(${scaleY}) translateY(${translateY}px)`,
  };
};
