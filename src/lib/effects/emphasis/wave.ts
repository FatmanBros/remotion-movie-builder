import { interpolate } from 'remotion';

export interface WaveEffectParams {
  frame: number;
  fps: number;
  charIndex?: number;
  totalChars?: number;
}

export const waveEffect = ({
  frame,
  fps,
  charIndex = 0,
  totalChars = 1,
}: WaveEffectParams): React.CSSProperties => {
  const cycleDuration = fps * 2; // Complete wave cycle every 2 seconds

  // Offset each character based on its position
  const phaseOffset = (charIndex / Math.max(totalChars - 1, 1)) * cycleDuration * 0.3;
  const adjustedFrame = frame + phaseOffset;
  const progress = (adjustedFrame % cycleDuration) / cycleDuration;

  // Create a sine wave motion
  const translateY = interpolate(
    progress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, -15, 0, 15, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return {
    transform: `translateY(${translateY}px)`,
    display: 'inline-block',
  };
};
