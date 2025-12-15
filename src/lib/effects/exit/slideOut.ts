import { interpolate } from "remotion";

/**
 * Slide Out Effect - Text slides out to left or right
 *
 * @param frame - Current frame number
 * @param fps - Frames per second
 * @param charIndex - Index of the character (0-based)
 * @param totalChars - Total number of characters
 * @param durationFrames - Duration of the exit animation in frames
 * @param direction - Direction to slide: 'left' or 'right' (default: 'right')
 * @returns Style object with opacity and transform values
 */
export function slideOut(
  frame: number,
  fps: number,
  charIndex: number,
  totalChars: number,
  durationFrames: number,
  direction: "left" | "right" = "right"
): React.CSSProperties {
  // Stagger the animation - each character starts slightly after the previous one
  const delayPerChar = 1.5;
  const charStartFrame = charIndex * delayPerChar;
  const localFrame = frame - charStartFrame;

  // Opacity: Quick fade out
  const opacity = interpolate(
    localFrame,
    [0, durationFrames * 0.7, durationFrames],
    [1, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // TranslateX: Slide out in the specified direction
  const distance = direction === "right" ? 150 : -150;
  const translateX = interpolate(
    localFrame,
    [0, durationFrames],
    [0, distance],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return {
    opacity,
    transform: `translateX(${translateX}px)`,
  };
}
