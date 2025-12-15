import { interpolate } from 'remotion';

export interface PulseEffectParams {
  frame: number;
  fps: number;
  charIndex?: number;
  totalChars?: number;
}

export const pulseEffect = ({
  frame,
  fps,
  charIndex = 0,
  totalChars = 1,
}: PulseEffectParams): React.CSSProperties => {
  const cycleDuration = fps * 0.8; // Pulse every 0.8 seconds
  const progress = (frame % cycleDuration) / cycleDuration;

  // Create a smooth pulse that goes from 1 -> 1.2 -> 1
  const scale = interpolate(progress, [0, 0.5, 1], [1, 1.2, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return {
    transform: `scale(${scale})`,
    display: 'inline-block',
  };
};
