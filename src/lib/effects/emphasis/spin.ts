import { EmphasisEffectParams } from "../types";

export const spinEffect = ({
  frame,
  fps,
  charIndex,
}: EmphasisEffectParams): React.CSSProperties => {
  const speed = 0.3;
  const offset = charIndex * 0.2;
  const rotation = ((frame / fps) * 360 * speed + offset * 360) % 360;

  return {
    transform: `rotateY(${rotation}deg)`,
    transformStyle: "preserve-3d",
  };
};
