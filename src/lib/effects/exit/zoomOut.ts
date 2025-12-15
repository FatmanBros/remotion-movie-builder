import { interpolate } from "remotion";

/**
 * Zoom Out Effect - Text shrinks and disappears
 *
 * @param frame - Current frame number
 * @param fps - Frames per second
 * @param charIndex - Index of the character (0-based)
 * @param totalChars - Total number of characters
 * @param durationFrames - Duration of the exit animation in frames
 * @returns Style object with opacity and transform values
 */
export function zoomOut(
  frame: number,
  fps: number,
  charIndex: number,
  totalChars: number,
  durationFrames: number
): React.CSSProperties {
  // Stagger the animation - each character starts slightly after the previous one
  const delayPerChar = 1;
  const charStartFrame = charIndex * delayPerChar;
  const localFrame = frame - charStartFrame;

  // Opacity: Fade out quickly at the end
  const opacity = interpolate(
    localFrame,
    [0, durationFrames * 0.6, durationFrames],
    [1, 0.8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scale: Shrink to nothing
  const scale = interpolate(
    localFrame,
    [0, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Slight rotation for more dynamic effect
  const rotate = interpolate(
    localFrame,
    [0, durationFrames],
    [0, -20],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return {
    opacity,
    transform: `scale(${scale}) rotate(${rotate}deg)`,
  };
}
