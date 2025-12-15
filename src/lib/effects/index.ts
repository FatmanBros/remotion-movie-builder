/**
 * Telop Effects System
 *
 * テロップ（字幕）用のアニメーションエフェクトシステム
 *
 * 使用例:
 * ```typescript
 * import { EnterEffects, ExitEffects, EmphasisEffects } from './effects';
 *
 * // 出現エフェクト
 * const enterStyle = EnterEffects.drop(frame, fps, charIndex, totalChars);
 *
 * // 消失エフェクト
 * const exitStyle = ExitEffects.dropOut(frame, fps, charIndex, totalChars, durationFrames);
 *
 * // 強調エフェクト
 * const emphasisStyle = EmphasisEffects.pulseEffect({ frame, fps, charIndex, totalChars });
 * ```
 */

// 型定義
export * from "./types";

// 共通ユーティリティ
export * from "./common";

// 出現エフェクト
import * as EnterEffects from "./enter";
export { EnterEffects };
export {
  drop,
  rise,
  slideIn,
  zoomIn,
  bounce,
  typewriter,
  blur,
  rotate,
  elastic,
} from "./enter";
export type { EnterEffectParams, EnterEffectStyle, SlideDirection } from "./enter";

// 消失エフェクト
import * as ExitEffects from "./exit";
export { ExitEffects };
export {
  dropOut,
  riseOut,
  slideOut,
  zoomOut,
  dissolve,
  scatter,
} from "./exit";

// 強調エフェクト
import * as EmphasisEffects from "./emphasis";
export { EmphasisEffects };
export {
  pulseEffect,
  shakeEffect,
  glowEffect,
  waveEffect,
  rainbowEffect,
  neonEffect,
} from "./emphasis";
export type {
  PulseEffectParams,
  ShakeEffectParams,
  GlowEffectParams,
  WaveEffectParams,
  RainbowEffectParams,
  NeonEffectParams,
} from "./emphasis";

/**
 * エフェクト名からエフェクト関数を取得するマップ
 * EffectedText.tsxで使用
 */
export const effectMap = {
  // 出現エフェクト
  enter: {
    drop: EnterEffects.drop,
    rise: EnterEffects.rise,
    slideInLeft: (frame: number, fps: number, charIndex: number, totalChars: number) =>
      EnterEffects.slideIn(frame, fps, charIndex, totalChars, "left"),
    slideInRight: (frame: number, fps: number, charIndex: number, totalChars: number) =>
      EnterEffects.slideIn(frame, fps, charIndex, totalChars, "right"),
    zoomIn: EnterEffects.zoomIn,
    bounce: EnterEffects.bounce,
    typewriter: (frame: number, fps: number, charIndex: number, totalChars: number) =>
      EnterEffects.typewriter({ frame, fps, charIndex, totalChars }),
    blur: (frame: number, fps: number, charIndex: number, totalChars: number) =>
      EnterEffects.blur({ frame, fps, charIndex, totalChars }),
    rotate: (frame: number, fps: number, charIndex: number, totalChars: number) =>
      EnterEffects.rotate({ frame, fps, charIndex, totalChars }),
    elastic: (frame: number, fps: number, charIndex: number, totalChars: number) =>
      EnterEffects.elastic({ frame, fps, charIndex, totalChars }),
    spring: EnterEffects.spring,
    fadeIn: EnterEffects.fadeIn,
    swing: EnterEffects.swing,
    flip: EnterEffects.flip,
  },
  // 消失エフェクト
  exit: {
    dropOut: ExitEffects.dropOut,
    riseOut: ExitEffects.riseOut,
    slideOutLeft: (frame: number, fps: number, charIndex: number, totalChars: number, durationFrames: number) =>
      ExitEffects.slideOut(frame, fps, charIndex, totalChars, durationFrames, "left"),
    slideOutRight: (frame: number, fps: number, charIndex: number, totalChars: number, durationFrames: number) =>
      ExitEffects.slideOut(frame, fps, charIndex, totalChars, durationFrames, "right"),
    zoomOut: ExitEffects.zoomOut,
    dissolve: ExitEffects.dissolve,
    scatter: ExitEffects.scatter,
    springOut: ExitEffects.springOut,
    fadeOut: ExitEffects.fadeOut,
    shrink: ExitEffects.shrink,
    flipOut: ExitEffects.flipOut,
  },
  // 強調エフェクト
  emphasis: {
    pulse: EmphasisEffects.pulseEffect,
    shake: EmphasisEffects.shakeEffect,
    glow: EmphasisEffects.glowEffect,
    wave: EmphasisEffects.waveEffect,
    rainbow: EmphasisEffects.rainbowEffect,
    neon: EmphasisEffects.neonEffect,
    kirakira: EmphasisEffects.kirakiraEffect,
    float: EmphasisEffects.floatEffect,
    spin: EmphasisEffects.spinEffect,
    twinkle: EmphasisEffects.twinkleEffect,
  },
} as const;
