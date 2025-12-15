import { interpolate } from 'remotion';

export interface NeonEffectParams {
  frame: number;
  fps: number;
  charIndex?: number;
  totalChars?: number;
}

export const neonEffect = ({
  frame,
  fps,
  charIndex = 0,
  totalChars = 1,
}: NeonEffectParams): React.CSSProperties => {
  const cycleDuration = fps * 0.15; // Fast flicker cycle
  const progress = (frame % cycleDuration) / cycleDuration;

  // Create random-looking flicker by using multiple interpolation points
  const flickerPattern = [1, 0.4, 1, 0.7, 1, 0.3, 1, 0.9, 1];
  const points = flickerPattern.map((_, i) => i / (flickerPattern.length - 1));

  const opacity = interpolate(progress, points, flickerPattern, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Base neon glow
  const glowIntensity = 20 * opacity;
  const glowBlur = 30 * opacity;

  // Occasional bright flash
  const flashCycle = fps * 2;
  const flashProgress = (frame % flashCycle) / flashCycle;
  const flash = flashProgress < 0.05 ? 1.5 : 1;

  return {
    color: `rgba(0, 255, 255, ${opacity})`,
    textShadow: `
      0 0 ${glowIntensity * flash}px rgba(0, 255, 255, ${0.8 * opacity}),
      0 0 ${glowBlur * flash}px rgba(0, 255, 255, ${0.6 * opacity}),
      0 0 ${glowBlur * 1.5 * flash}px rgba(0, 255, 255, ${0.4 * opacity}),
      0 0 ${glowBlur * 2 * flash}px rgba(0, 255, 255, ${0.2 * opacity})
    `,
    display: 'inline-block',
  };
};
