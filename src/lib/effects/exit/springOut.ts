import { interpolate } from "remotion";

/**
 * Spring Out Effect - Text shrinks with spring-like motion
 *
 * @param frame - Current frame number
 * @param fps - Frames per second
 * @param charIndex - Index of the character (0-based)
 * @param totalChars - Total number of characters
 * @param durationFrames - Duration of the exit animation in frames
 * @returns Style object with opacity and transform values
 */
export function springOut(
  frame: number,
  fps: number,
  charIndex: number,
  totalChars: number,
  durationFrames: number
): React.CSSProperties {
  // Stagger the animation - each character starts slightly after the previous one
  const delayPerChar = 2;
  const charStartFrame = charIndex * delayPerChar;
  const localFrame = frame - charStartFrame;

  // Opacity: Fade out
  const opacity = interpolate(
    localFrame,
    [0, 8],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scale: Shrink
  const scale = interpolate(
    localFrame,
    [0, 8],
    [1, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return {
    opacity,
    transform: `scale(${scale})`,
  };
}
