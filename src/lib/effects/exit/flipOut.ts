import { interpolate, Easing } from "remotion";
import { charDelay } from "../common";

export const flipOut = (
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

  const rotateY = interpolate(progress, [0, 1], [0, 90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    opacity: 1 - progress,
    transform: `perspective(400px) rotateY(${rotateY}deg)`,
  };
};
