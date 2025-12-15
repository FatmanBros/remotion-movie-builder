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
 * Rotate effect - Text rotates while appearing
 * Characters spin in from a rotated angle while fading in
 */
export const rotate = ({
  frame,
  fps,
  charIndex,
  totalChars,
}: EnterEffectParams): EnterEffectStyle => {
  const delayPerChar = 2; // frames between each character
  const appearDuration = fps * 0.5; // duration for rotation (0.5 seconds)

  const charStartFrame = charIndex * delayPerChar;
  const localFrame = frame - charStartFrame;

  // Opacity interpolation
  const opacity = interpolate(
    localFrame,
    [0, appearDuration * 0.3, appearDuration],
    [0, 1, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Rotation interpolation - spins from 180 degrees to 0
  const rotation = interpolate(
    localFrame,
    [0, appearDuration],
    [180, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Scale effect - grows into place
  const scale = interpolate(
    localFrame,
    [0, appearDuration],
    [0.5, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Vertical translation for added movement
  const translateY = interpolate(
    localFrame,
    [0, appearDuration],
    [20, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return {
    opacity,
    transform: `rotate(${rotation}deg) scale(${scale}) translateY(${translateY}px)`,
  };
};
