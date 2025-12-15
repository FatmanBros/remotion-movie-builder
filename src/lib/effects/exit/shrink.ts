import { interpolate, Easing } from "remotion";
import { charDelay } from "../common";

export const shrink = (
  frame: number,
  fps: number,
  charIndex: number,
  totalChars: number,
  duration: number
) => {
  const delay = charDelay(charIndex, totalChars) * 0.5;
  const localFrame = frame - delay;

  const progress = interpolate(localFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const scale = interpolate(progress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    opacity: 1 - progress,
    transform: `scale(${scale})`,
  };
};
