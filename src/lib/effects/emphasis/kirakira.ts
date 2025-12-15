import React from "react";

export interface EmphasisEffectParams {
  frame: number;
  fps: number;
  charIndex: number;
  totalChars: number;
}

/**
 * Kirakira (sparkle) effect - Adds sparkle/glitter effect to text
 * Characters have a subtle shimmer with varying brightness
 */
export function kirakiraEffect({
  frame,
  fps,
  charIndex,
  totalChars,
}: EmphasisEffectParams): React.CSSProperties {
  // Create a shimmering effect with phase offset per character
  const phase = (frame / fps) * 4 + charIndex * 0.5;
  const shimmer = Math.sin(phase) * 0.3 + 0.7; // 0.4 to 1.0 range

  // Add subtle scale pulse
  const scalePulse = 1 + Math.sin(phase * 1.5) * 0.02; // 0.98 to 1.02

  // Golden glow effect
  const glowIntensity = Math.sin(phase * 2) * 5 + 8; // 3 to 13

  return {
    filter: `brightness(${shimmer + 0.3}) drop-shadow(0 0 ${glowIntensity}px rgba(255, 215, 0, 0.6))`,
    transform: `scale(${scalePulse})`,
  };
}
