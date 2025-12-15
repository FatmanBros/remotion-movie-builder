import { interpolate } from 'remotion';

export interface RainbowEffectParams {
  frame: number;
  fps: number;
  charIndex?: number;
  totalChars?: number;
}

export const rainbowEffect = ({
  frame,
  fps,
  charIndex = 0,
  totalChars = 1,
}: RainbowEffectParams): React.CSSProperties => {
  const cycleDuration = fps * 3; // Complete rainbow cycle every 3 seconds

  // Offset each character to create a flowing rainbow effect
  const phaseOffset = (charIndex / Math.max(totalChars - 1, 1)) * cycleDuration * 0.2;
  const adjustedFrame = frame + phaseOffset;
  const progress = (adjustedFrame % cycleDuration) / cycleDuration;

  // Cycle through hue values (0-360 degrees)
  const hue = interpolate(progress, [0, 1], [0, 360]);

  return {
    color: `hsl(${hue}, 100%, 50%)`,
    display: 'inline-block',
  };
};
