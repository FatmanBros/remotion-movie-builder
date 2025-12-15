import { interpolate } from "remotion";

/**
 * Scatter Effect - Characters scatter in random directions
 *
 * @param frame - Current frame number
 * @param fps - Frames per second
 * @param charIndex - Index of the character (0-based)
 * @param totalChars - Total number of characters
 * @param durationFrames - Duration of the exit animation in frames
 * @returns Style object with opacity and transform values
 */
export function scatter(
  frame: number,
  fps: number,
  charIndex: number,
  totalChars: number,
  durationFrames: number
): React.CSSProperties {
  // Each character has a unique delay
  const delayPerChar = 1;
  const charStartFrame = charIndex * delayPerChar;
  const localFrame = frame - charStartFrame;

  // Opacity: Fade out
  const opacity = interpolate(
    localFrame,
    [0, durationFrames * 0.4, durationFrames],
    [1, 0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Generate pseudo-random direction for each character
  // Using charIndex for deterministic randomness
  const angle = ((charIndex * 137.5) % 360) * (Math.PI / 180); // Golden angle for good distribution
  const distance = 80 + ((charIndex * 43) % 60); // Distance varies between 80-140

  // Calculate X and Y movement based on angle
  const translateX = interpolate(
    localFrame,
    [0, durationFrames],
    [0, Math.cos(angle) * distance],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateY = interpolate(
    localFrame,
    [0, durationFrames],
    [0, Math.sin(angle) * distance],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Rotation: Each character rotates as it scatters
  const rotate = interpolate(
    localFrame,
    [0, durationFrames],
    [0, ((charIndex % 2 === 0 ? 1 : -1) * (180 + (charIndex * 23) % 180))],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scale: Characters shrink as they scatter
  const scale = interpolate(
    localFrame,
    [0, durationFrames * 0.5, durationFrames],
    [1, 0.8, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return {
    opacity,
    transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
  };
}
