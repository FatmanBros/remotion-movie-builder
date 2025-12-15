import { interpolate } from "remotion";
import { charDelay } from "../common";

export const fadeIn = (
  frame: number,
  fps: number,
  charIndex: number,
  totalChars: number
) => {
  const delay = charDelay(charIndex, totalChars);
  const duration = fps * 0.4;
  const localFrame = frame - delay;

  const opacity = interpolate(localFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    opacity,
    transform: "none",
  };
};
