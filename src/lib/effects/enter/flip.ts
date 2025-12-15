import { interpolate, Easing } from "remotion";
import { charDelay } from "../common";

export const flip = (
  frame: number,
  fps: number,
  charIndex: number,
  totalChars: number
) => {
  const delay = charDelay(charIndex, totalChars);
  const duration = fps * 0.4;
  const localFrame = frame - delay;

  const progress = interpolate(localFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const rotateY = interpolate(localFrame, [0, duration], [-90, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return {
    opacity: progress,
    transform: `perspective(400px) rotateY(${rotateY}deg)`,
  };
};
