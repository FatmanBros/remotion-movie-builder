import { interpolate, Easing } from "remotion";
import { charDelay } from "../common";

export const swing = (
  frame: number,
  fps: number,
  charIndex: number,
  totalChars: number
) => {
  const delay = charDelay(charIndex, totalChars);
  const duration = fps * 0.5;
  const localFrame = frame - delay;

  const progress = interpolate(localFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const rotation = interpolate(localFrame, [0, duration * 0.3, duration * 0.6, duration], [-30, 15, -5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    opacity: progress,
    transform: `rotate(${rotation}deg)`,
  };
};
