import { interpolate } from 'remotion';

export interface ShakeEffectParams {
  frame: number;
  fps: number;
  charIndex?: number;
  totalChars?: number;
}

export const shakeEffect = ({
  frame,
  fps,
  charIndex = 0,
  totalChars = 1,
}: ShakeEffectParams): React.CSSProperties => {
  const cycleDuration = fps * 0.1; // Fast shake cycle (0.1 seconds)
  const progress = (frame % cycleDuration) / cycleDuration;

  // Create a shake pattern: 0 -> 5 -> -5 -> 5 -> -5 -> 0
  const translateX = interpolate(
    progress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 5, -5, 5, -5, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return {
    transform: `translateX(${translateX}px)`,
    display: 'inline-block',
  };
};
