import { interpolate } from "remotion";
import { charDelay } from "../common";

export const fadeOut = (
  frame: number,
  fps: number,
  charIndex: number,
  totalChars: number,
  duration: number
) => {
  const delay = charDelay(charIndex, totalChars) * 0.5;
  const localFrame = frame - delay;

  const opacity = interpolate(localFrame, [0, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    opacity,
    transform: "none",
  };
};
