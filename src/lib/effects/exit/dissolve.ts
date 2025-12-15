import { interpolate } from "remotion";

/**
 * Dissolve Effect - Text fades out with dissolve effect
 *
 * @param frame - Current frame number
 * @param fps - Frames per second
 * @param charIndex - Index of the character (0-based)
 * @param totalChars - Total number of characters
 * @param durationFrames - Duration of the exit animation in frames
 * @returns Style object with opacity and transform values
 */
export function dissolve(
  frame: number,
  fps: number,
  charIndex: number,
  totalChars: number,
  durationFrames: number
): React.CSSProperties {
  // Randomize the start frame for each character to create a dissolve effect
  // Use charIndex for deterministic randomness
  const randomDelay = ((charIndex * 7) % totalChars) * 1.5;
  const charStartFrame = randomDelay;
  const localFrame = frame - charStartFrame;

  // Opacity: Fade out at different rates for each character
  const opacity = interpolate(
    localFrame,
    [0, durationFrames * 0.3, durationFrames * 0.8],
    [1, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scale: Randomly scale up or down slightly
  const scaleDirection = charIndex % 2 === 0 ? 1.2 : 0.8;
  const scale = interpolate(
    localFrame,
    [0, durationFrames],
    [1, scaleDirection],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Slight vertical movement
  const translateY = interpolate(
    localFrame,
    [0, durationFrames],
    [0, (charIndex % 3 - 1) * 20],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Add blur effect for dissolve
  const blur = interpolate(
    localFrame,
    [0, durationFrames * 0.5, durationFrames],
    [0, 2, 5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return {
    opacity,
    transform: `scale(${scale}) translateY(${translateY}px)`,
    filter: `blur(${blur}px)`,
  };
}
