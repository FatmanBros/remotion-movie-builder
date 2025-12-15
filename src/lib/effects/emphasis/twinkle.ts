import { EmphasisEffectParams } from "./kirakira";

export const twinkleEffect = ({
  frame,
  fps,
  charIndex,
}: EmphasisEffectParams): React.CSSProperties => {
  const speed = 2;
  const offset = charIndex * 0.5;
  const phase = (frame / fps) * Math.PI * 2 * speed + offset;
  const opacity = 0.7 + Math.sin(phase) * 0.3;
  const brightness = 1 + Math.sin(phase * 1.5) * 0.3;

  return {
    opacity,
    filter: `brightness(${brightness})`,
  };
};
