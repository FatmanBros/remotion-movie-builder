import { interpolate } from "remotion";

/**
 * Rise Out Effect - Text rises up and disappears
 *
 * @param frame - Current frame number
 * @param fps - Frames per second
 * @param charIndex - Index of the character (0-based)
 * @param totalChars - Total number of characters
 * @param durationFrames - Duration of the exit animation in frames
 * @returns Style object with opacity and transform values
 */
export function riseOut(
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

  // Opacity: Fade out as it rises
  const opacity = interpolate(
    localFrame,
    [0, durationFrames * 0.5, durationFrames],
    [1, 0.8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // TranslateY: Rise up smoothly
  const translateY = interpolate(
    localFrame,
    [0, durationFrames],
    [0, -100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scale: Slightly shrink as it rises
  const scale = interpolate(
    localFrame,
    [0, durationFrames],
    [1, 0.7],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return {
    opacity,
    transform: `translateY(${translateY}px) scale(${scale})`,
  };
}
