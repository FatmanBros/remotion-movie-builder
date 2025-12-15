import { EmphasisEffectParams } from "./kirakira";

export const floatEffect = ({
  frame,
  fps,
  charIndex,
}: EmphasisEffectParams): React.CSSProperties => {
  const speed = 0.8;
  const amplitude = 5;
  const offset = charIndex * 0.3;
  const y = Math.sin((frame / fps) * Math.PI * 2 * speed + offset) * amplitude;

  return {
    transform: `translateY(${y}px)`,
  };
};
