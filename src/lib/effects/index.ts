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
 */
export const effectMap = {
  // 出現エフェクト
  enter: {
    drop: EnterEffects.drop,
    rise: EnterEffects.rise,
    slideIn: EnterEffects.slideIn,
    zoomIn: EnterEffects.zoomIn,
    bounce: EnterEffects.bounce,
    typewriter: EnterEffects.typewriter,
    blur: EnterEffects.blur,
    rotate: EnterEffects.rotate,
    elastic: EnterEffects.elastic,
  },
  // 消失エフェクト
  exit: {
    dropOut: ExitEffects.dropOut,
    riseOut: ExitEffects.riseOut,
    slideOut: ExitEffects.slideOut,
    zoomOut: ExitEffects.zoomOut,
    dissolve: ExitEffects.dissolve,
    scatter: ExitEffects.scatter,
  },
  // 強調エフェクト
  emphasis: {
    pulse: EmphasisEffects.pulseEffect,
    shake: EmphasisEffects.shakeEffect,
    glow: EmphasisEffects.glowEffect,
    wave: EmphasisEffects.waveEffect,
    rainbow: EmphasisEffects.rainbowEffect,
    neon: EmphasisEffects.neonEffect,
  },
} as const;
