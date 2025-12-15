import { interpolate } from 'remotion';

export interface GlowEffectParams {
  frame: number;
  fps: number;
  charIndex?: number;
  totalChars?: number;
}

export const glowEffect = ({
  frame,
  fps,
  charIndex = 0,
  totalChars = 1,
}: GlowEffectParams): React.CSSProperties => {
  const cycleDuration = fps * 1.5; // Glow cycle every 1.5 seconds
  const progress = (frame % cycleDuration) / cycleDuration;

  // Interpolate glow intensity from 0 to max and back
  const glowIntensity = interpolate(progress, [0, 0.5, 1], [0, 20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const glowBlur = interpolate(progress, [0, 0.5, 1], [0, 30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return {
    textShadow: `
      0 0 ${glowIntensity}px rgba(255, 255, 255, 0.8),
      0 0 ${glowBlur}px rgba(255, 255, 255, 0.6),
      0 0 ${glowBlur * 1.5}px rgba(255, 255, 255, 0.4)
    `,
    display: 'inline-block',
  };
};
