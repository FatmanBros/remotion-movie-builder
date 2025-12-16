export { Movie, Movie as Rmb } from "./Movie";
export { Scene, type TransitionOptions } from "./Scene";
export { OpeningEnding } from "./OpeningEnding";
export { Effects, TelopPresets, Transitions, TelopColors } from "./Effects";
export { MovieRenderer } from "./MovieRenderer";
export { RmbComposition, rmbProps, type RmbCompositionProps } from "./RmbComposition";
export { VideoSize } from "./types";

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
  TelopDefaults,
  TransitionDefaults,
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
  VideoSizePreset,
  SubtitleOptions,
  SubtitleData,
  CaptionData,
  SpeakerStyle,
} from "./types";
