export { Movie } from "./Movie";
export { Scene, type TransitionOptions } from "./Scene";
export { OpeningEnding } from "./OpeningEnding";
export { Effects, TelopPresets, Transitions, TelopColors } from "./Effects";
export { MovieRenderer } from "./MovieRenderer";

// 新しいエフェクトシステム
export * as TelopEffects from "./effects";
export {
  EnterEffects,
  ExitEffects,
  EmphasisEffects,
  effectMap,
} from "./effects";

export type {
  EffectType,
  EnterEffectType,
  ExitEffectType,
  EmphasisEffectType,
  TelopEffects as TelopEffectsType,
  TransitionType,
  MovieOptions,
  OpeningEndingOptions,
  SceneOptions,
  OverlayOptions,
  TelopPosition,
  TelopColor,
  TelopSfxOptions,
  TelopOptions,
  TelopData,
  WipePosition,
  WipeOptions,
  WipeData,
  AudioOptions,
  BgmOptions,
  AudioData,
  SceneData,
  CrossFadeData,
  OpeningEndingData,
  MovieData,
  FixedPosition,
  FixedElementOptions,
  FixedImageOptions,
  FixedTextOptions,
  FixedElementData,
  DisplayMode,
} from "./types";
