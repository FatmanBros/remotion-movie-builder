import { EffectType, TelopEffects, TransitionType, TelopColor } from "./types";

// 基本エフェクト定義（シーン用）
export const Effects = {
  fadeIn: "fadeIn" as EffectType,
  fadeOut: "fadeOut" as EffectType,
} as const;

/**
 * テロップカラーのプリセット
 * 使用例: scene.telop("テキスト", { duration: 5, color: TelopColors.yellow })
 */
export const TelopColors = {
  // 基本色
  white: {
    text: "#ffffff",
    shadow: "rgba(0,0,0,0.8)",
  } as TelopColor,

  yellow: {
    text: "#FFD700",
    shadow: "rgba(0,0,0,0.8)",
  } as TelopColor,

  pink: {
    text: "#FF69B4",
    shadow: "rgba(0,0,0,0.8)",
  } as TelopColor,

  cyan: {
    text: "#00FFFF",
    shadow: "rgba(0,0,0,0.8)",
  } as TelopColor,

  green: {
    text: "#00FF7F",
    shadow: "rgba(0,0,0,0.8)",
  } as TelopColor,

  orange: {
    text: "#FFA500",
    shadow: "rgba(0,0,0,0.8)",
  } as TelopColor,

  red: {
    text: "#FF4444",
    shadow: "rgba(0,0,0,0.8)",
  } as TelopColor,

  purple: {
    text: "#DA70D6",
    shadow: "rgba(0,0,0,0.8)",
  } as TelopColor,

  blue: {
    text: "#4169E1",
    shadow: "rgba(0,0,0,0.8)",
  } as TelopColor,

  // 縁取り付き（TV字幕風：白文字＋色付き縁取り）
  blackOutline: {
    text: "#ffffff",
    stroke: "#000000",
    strokeWidth: 20,
  } as TelopColor,

  yellowOutline: {
    text: "#ffffff",
    stroke: "#FFD700",
    strokeWidth: 20,
  } as TelopColor,

  pinkOutline: {
    text: "#ffffff",
    stroke: "#FF69B4",
    strokeWidth: 20,
  } as TelopColor,

  cyanOutline: {
    text: "#ffffff",
    stroke: "#00FFFF",
    strokeWidth: 20,
  } as TelopColor,

  blueOutline: {
    text: "#ffffff",
    stroke: "#4169E1",
    strokeWidth: 20,
  } as TelopColor,

  redOutline: {
    text: "#ffffff",
    stroke: "#FF4444",
    strokeWidth: 20,
  } as TelopColor,

  greenOutline: {
    text: "#ffffff",
    stroke: "#00FF7F",
    strokeWidth: 20,
  } as TelopColor,

  orangeOutline: {
    text: "#ffffff",
    stroke: "#FFA500",
    strokeWidth: 20,
  } as TelopColor,

  purpleOutline: {
    text: "#ffffff",
    stroke: "#DA70D6",
    strokeWidth: 20,
  } as TelopColor,

  // グラデーション風（影の色で表現）
  sunset: {
    text: "#FF6B6B",
    shadow: "rgba(255,165,0,0.8)",
  } as TelopColor,

  ocean: {
    text: "#4ECDC4",
    shadow: "rgba(0,100,150,0.8)",
  } as TelopColor,

  neon: {
    text: "#39FF14",
    shadow: "rgba(57,255,20,0.5)",
  } as TelopColor,

  gold: {
    text: "#FFD700",
    shadow: "rgba(218,165,32,0.8)",
  } as TelopColor,

  // TV字幕風二重縁取り（色文字 + 白縁取り + 黒外枠）SVG描画
  doubleYellow: {
    text: "#ffdd00",
    stroke: "#ffffff",
    strokeWidth: 8,
    outerStroke: "#000000",
    outerStrokeWidth: 16,
  } as TelopColor,

  doublePink: {
    text: "#ff69b4",
    stroke: "#ffffff",
    strokeWidth: 8,
    outerStroke: "#000000",
    outerStrokeWidth: 16,
  } as TelopColor,

  doublePurple: {
    text: "#9933ff",
    stroke: "#ffffff",
    strokeWidth: 8,
    outerStroke: "#000000",
    outerStrokeWidth: 16,
  } as TelopColor,

  doubleRed: {
    text: "#ff0000",
    stroke: "#ffffff",
    strokeWidth: 8,
    outerStroke: "#000000",
    outerStrokeWidth: 16,
  } as TelopColor,

  doubleBlue: {
    text: "#0066ff",
    stroke: "#ffffff",
    strokeWidth: 8,
    outerStroke: "#000000",
    outerStrokeWidth: 16,
  } as TelopColor,

  doubleGreen: {
    text: "#00cc66",
    stroke: "#ffffff",
    strokeWidth: 8,
    outerStroke: "#000000",
    outerStrokeWidth: 16,
  } as TelopColor,

  doubleOrange: {
    text: "#ff8800",
    stroke: "#ffffff",
    strokeWidth: 8,
    outerStroke: "#000000",
    outerStrokeWidth: 16,
  } as TelopColor,

  doubleBrown: {
    text: "#8B4513",
    stroke: "#ffffff",
    strokeWidth: 8,
    outerStroke: "#000000",
    outerStrokeWidth: 16,
  } as TelopColor,

  // TV字幕風（白文字 + 黒縁取り）
  tvStyle: {
    text: "#ffffff",
    stroke: "#000000",
    strokeWidth: 6,
  } as TelopColor,
} as const;

export type Effects = (typeof Effects)[keyof typeof Effects];

/**
 * テロップエフェクトのプリセット
 * 使用例: scene.telop("テキスト", { duration: 5, effects: TelopPresets.dropRainbow })
 */
export const TelopPresets = {
  // エフェクトなし（デフォルト）
  none: {} as TelopEffects,

  // ドロップ + 虹色
  dropRainbow: {
    enter: "drop",
    exit: "dropOut",
    emphasis: "rainbow",
  } as TelopEffects,

  // バウンス + パルス
  bouncePulse: {
    enter: "bounce",
    exit: "zoomOut",
    emphasis: "pulse",
  } as TelopEffects,

  // スライドイン + グロー
  slideGlow: {
    enter: "slideInLeft",
    exit: "slideOutRight",
    emphasis: "glow",
  } as TelopEffects,

  // ズーム + ネオン
  zoomNeon: {
    enter: "zoomIn",
    exit: "zoomOut",
    emphasis: "neon",
  } as TelopEffects,

  // タイプライター + ウェーブ
  typeWave: {
    enter: "typewriter",
    exit: "dissolve",
    emphasis: "wave",
  } as TelopEffects,

  // エラスティック + シェイク
  elasticShake: {
    enter: "elastic",
    exit: "scatter",
    emphasis: "shake",
  } as TelopEffects,

  // ブラー + グロー（フォーカス効果）
  blurGlow: {
    enter: "blur",
    exit: "dissolve",
    emphasis: "glow",
  } as TelopEffects,

  // 回転 + 虹色（派手な演出）
  rotateRainbow: {
    enter: "rotate",
    exit: "scatter",
    emphasis: "rainbow",
  } as TelopEffects,

  // 上昇 + パルス（穏やかな演出）
  risePulse: {
    enter: "rise",
    exit: "riseOut",
    emphasis: "pulse",
  } as TelopEffects,

  // シンプル（エフェクト控えめ）
  simple: {
    enter: "zoomIn",
    exit: "zoomOut",
  } as TelopEffects,

  // スプリング（弾むように出現 + キラキラ）
  spring: {
    enter: "spring",
    exit: "springOut",
    emphasis: "kirakira",
  } as TelopEffects,
} as const;

/**
 * トランジション（シーン切替）のプリセット
 * 使用例: movie.crossFade(scene1, scene2, 3, Transitions.wipeLeft)
 * または: movie.transition(scene1, scene2, Transitions.slideLeft, 2)
 */
export const Transitions = {
  // フェード系
  fade: "fade" as TransitionType,

  // ワイプ系
  wipeLeft: "wipeLeft" as TransitionType,
  wipeRight: "wipeRight" as TransitionType,
  wipeUp: "wipeUp" as TransitionType,
  wipeDown: "wipeDown" as TransitionType,

  // スライド系
  slideLeft: "slideLeft" as TransitionType,
  slideRight: "slideRight" as TransitionType,
  slideUp: "slideUp" as TransitionType,
  slideDown: "slideDown" as TransitionType,

  // ズーム系
  zoomIn: "zoomIn" as TransitionType,
  zoomOut: "zoomOut" as TransitionType,

  // 全体フリップ
  flipLeft: "flipLeft" as TransitionType,
  flipRight: "flipRight" as TransitionType,
  flipUp: "flipUp" as TransitionType,
  flipDown: "flipDown" as TransitionType,

  // グリッドパネル
  gridFlipLeft: "gridFlipLeft" as TransitionType,
  gridFlipRight: "gridFlipRight" as TransitionType,
  gridFlipUp: "gridFlipUp" as TransitionType,
  gridFlipDown: "gridFlipDown" as TransitionType,
  gridShrink: "gridShrink" as TransitionType,
  gridRandom: "gridRandom" as TransitionType,

  // その他
  blur: "blur" as TransitionType,
} as const;

// 新しいエフェクトシステムを再エクスポート
export * from "./effects";
