import { interpolate } from "remotion";

/**
 * Drop Out Effect - Text falls down and disappears
 *
 * @param frame - Current frame number
 * @param fps - Frames per second
 * @param charIndex - Index of the character (0-based)
 * @param totalChars - Total number of characters
 * @param durationFrames - Duration of the exit animation in frames
 * @returns Style object with opacity and transform values
 */
export function dropOut(
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

  // Opacity: Fade out as it falls
  const opacity = interpolate(
    localFrame,
    [0, durationFrames * 0.3, durationFrames],
    [1, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // TranslateY: Fall down with acceleration
  const translateY = interpolate(
    localFrame,
    [0, durationFrames],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Slight rotation as it falls
  const rotate = interpolate(
    localFrame,
    [0, durationFrames],
    [0, 15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return {
    opacity,
    transform: `translateY(${translateY}px) rotate(${rotate}deg)`,
  };
}
