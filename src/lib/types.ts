// 基本エフェクトの種類（シーン用）
export type EffectType = "fadeIn" | "fadeOut";

// 表示モード
export type DisplayModeBasic =
  | "cover"      // 画面全体を埋める（はみ出し部分はクロップ）デフォルト
  | "contain"    // 全体を表示（アスペクト比維持、レターボックス）
  | "fitWidth"   // 左右ぴったり（上下に黒帯の可能性）
  | "fitHeight"; // 上下ぴったり（左右に黒帯の可能性）

// 映画風アスペクト比プリセット
export type CinematicMode =
  | "vista"        // ヴィスタサイズ (1.85:1)
  | "cinemascope"  // シネマスコープ (2.35:1)
  | "european"     // ヨーロピアンヴィスタ (1.66:1)
  | "imax";        // IMAX (1.43:1)

// 分割表示（文字列パターン）
// "2/3" - 高さ2/3で中央配置
// "1/3 80%" - 高さ1/3、幅80%で中央配置
// "2/3 top" - 高さ2/3で上寄せ（下をクロップ）
// "2/3 bottom" - 高さ2/3で下寄せ（上をクロップ）
export type SplitDisplayMode = string;

// オブジェクト形式の詳細指定
export type DisplayModeObject = {
  height?: string;       // "2/3", "50%", "300px" など
  width?: string;        // "80%", "100%" など
  position?: "center" | "top" | "bottom"; // 垂直配置（デフォルト: center）
  aspectRatio?: string;  // "16:9", "2.35:1" などカスタムアスペクト比
};

// 統合された表示モード型
export type DisplayMode =
  | DisplayModeBasic
  | CinematicMode
  | SplitDisplayMode
  | DisplayModeObject;

// 出現エフェクトの種類
export type EnterEffectType =
  | "drop"
  | "rise"
  | "slideInLeft"
  | "slideInRight"
  | "zoomIn"
  | "bounce"
  | "typewriter"
  | "spring"
  | "blur"
  | "rotate"
  | "elastic"
  | "fadeIn"
  | "swing"
  | "flip";

// 消失エフェクトの種類
export type ExitEffectType =
  | "dropOut"
  | "riseOut"
  | "slideOutLeft"
  | "slideOutRight"
  | "zoomOut"
  | "dissolve"
  | "scatter"
  | "springOut"
  | "fadeOut"
  | "shrink"
  | "flipOut";

// 強調エフェクトの種類
export type EmphasisEffectType =
  | "pulse"
  | "shake"
  | "glow"
  | "wave"
  | "rainbow"
  | "neon"
  | "kirakira"
  | "float"
  | "spin"
  | "twinkle";

// テロップエフェクト設定
export type TelopEffects = {
  enter?: EnterEffectType;
  exit?: ExitEffectType;
  emphasis?: EmphasisEffectType;
};

// オープニング・エンディングのオプション
export type OpeningEndingOptions = {
  image: string;
  effect?: EffectType;
  effects?: TelopEffects; // デフォルトテロップエフェクト
  overlay?: OverlayOptions; // デフォルトオーバーレイ
  telopPosition?: TelopPosition; // デフォルトテロップ位置（"bottom", "top 20%"など）
  displayMode?: DisplayMode; // 表示モード（デフォルト: cover）
};

// ムービー全体のオプション
export type MovieOptions = {
  effects?: TelopEffects; // デフォルトテロップエフェクト（全シーン・プロローグ・エピローグに適用）
  transition?: TransitionType; // デフォルトトランジション（全シーン間に適用）
  transitionDuration?: number; // デフォルトトランジション秒数（デフォルト: 3）
  overlay?: OverlayOptions; // デフォルトオーバーレイ（全テロップに適用）
  telopPosition?: TelopPosition; // デフォルトテロップ位置（"bottom", "top 20%"など）
};

// シーンのオプション
export type SceneOptions = {
  duration?: number; // 秒数（省略時はテロップ長から自動計算）
  effect?: EffectType[];
  trimBefore?: number; // 動画の開始位置（秒）
  overlay?: OverlayOptions; // デフォルトオーバーレイ（全テロップに適用）
  effects?: TelopEffects; // デフォルトテロップエフェクト（全テロップに適用）
  telopPosition?: TelopPosition; // デフォルトテロップ位置（"bottom", "top 20%"など）
  bgmVolume?: number; // このシーン中のBGM音量（0-1、省略時はグローバル設定）
  volume?: number; // 動画の音量（0-1、デフォルト1）
  loop?: boolean; // シーンより短い動画をループ再生（デフォルト: true）
  backgroundColor?: string; // 背景色（例: "#ffffff", "#000000"）
  displayMode?: DisplayMode; // 表示モード（デフォルト: cover）
};

// ワイプの位置
export type WipePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

// 固定要素の位置
export type FixedPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

// 固定要素のオプション
export type FixedElementOptions = {
  position?: FixedPosition; // 位置（デフォルト: top-right）
  margin?: number; // 画面端からの余白（px）デフォルト: 20
  opacity?: number; // 不透明度（0-1）デフォルト: 1
  scale?: number; // 拡大率（デフォルト: 1）
};

// 固定画像のオプション
export type FixedImageOptions = FixedElementOptions & {
  width?: number; // 幅（px）
  height?: number; // 高さ（px）
};

// 固定テロップのオプション
export type FixedTextOptions = FixedElementOptions & {
  fontSize?: number; // フォントサイズ（デフォルト: 24）
  color?: string; // 文字色（デフォルト: #ffffff）
  backgroundColor?: string; // 背景色（オプション）
  padding?: number; // パディング（px）
  borderRadius?: number; // 角丸（px）
};

// 固定要素データ（内部用）
export type FixedElementData = {
  type: "image" | "text";
  content: string; // 画像パスまたはテキスト
  position: FixedPosition;
  margin: number;
  opacity: number;
  scale: number;
  // 画像用
  width?: number;
  height?: number;
  // テキスト用
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  padding?: number;
  borderRadius?: number;
};

// クロマキー設定
export type ChromaKeyOptions = {
  color?: "green" | "blue" | string; // キーカラー（デフォルト: green）
  similarity?: number; // 類似度（0-1、デフォルト: 0.4）
  smoothness?: number; // 境界の滑らかさ（0-1、デフォルト: 0.1）
};

// ワイプのオプション
export type WipeOptions = {
  position?: WipePosition; // 位置（デフォルト: bottom-right）
  size?: number; // サイズ比率（0-1、デフォルト: 0.3）
  volume?: number; // 音量（0-1、デフォルト: 1）
  trimBefore?: number; // 動画の開始位置（秒）
  borderRadius?: number; // 角丸（px、デフォルト: 12）
  margin?: number; // 画面端からの余白（px、デフォルト: 20）
  before?: number; // シーン開始からの秒数
  duration?: number; // 表示秒数（省略時はシーン終了まで）
  chromaKey?: boolean | ChromaKeyOptions; // クロマキー（背景除去）
};

// ワイプのデータ
export type WipeData = {
  file: string;
  position: WipePosition;
  size: number;
  volume: number;
  trimBefore: number;
  borderRadius: number;
  margin: number;
  startTime: number; // シーン内での開始時間（秒）
  duration?: number; // 表示秒数（省略時はシーン終了まで）
  chromaKey?: {
    color: string;
    similarity: number;
    smoothness: number;
  };
};

// オーバーレイの設定
export type OverlayType = "gradient" | "box" | "shadow";

export type OverlayOptions = {
  type?: OverlayType; // オーバーレイの種類（デフォルト: gradient）
  color?: string; // 色（"#000000" or "0,0,0"形式）デフォルト #000000
  height?: string; // gradient用: 高さ、デフォルト 50%
  padding?: number; // box用: パディング, shadow用: ぼかしサイズ（px）デフォルト 16
  borderRadius?: number; // box用: 角丸（px）デフォルト 8
  opacity?: number; // 不透明度（0-1）デフォルト 0.7
};

// テロップの位置
// 基本: "bottom" | "center" | "top"
// 拡張: "bottom 20%" | "top 15%" | "80px" など
export type TelopPosition = string;

// AnimatedEmoji の名前（@remotion/animated-emoji）
export type EmojiName = string;

// テロップの色設定
export type TelopColor = {
  text?: string;       // テキスト色（デフォルト: #ffffff）
  shadow?: string;     // 影の色（デフォルト: rgba(0,0,0,0.8)）
  stroke?: string;     // 縁取りの色（オプション）
  strokeWidth?: number; // 縁取りの太さ（デフォルト: 0）
  // 二重縁取り用（SVGで描画）
  outerStroke?: string;     // 外側縁取りの色
  outerStrokeWidth?: number; // 外側縁取りの太さ
};

// テロップ効果音のオプション
export type TelopSfxOptions = {
  file: string; // 効果音ファイル
  volume?: number; // 音量（0-1、デフォルト1）
};

// テロップのオプション
export type TelopOptions = {
  duration?: number; // 表示秒数（省略時は文字数から自動計算）
  before?: number; // シーン開始からの秒数（指定しない場合は前のテロップの終了後）
  after?: number; // 前のテロップ終了後からの秒数（例: after: 2 で前のテロップ終了2秒後）
  effects?: TelopEffects; // エフェクトシステム（enter/exit/emphasis）
  position?: TelopPosition; // テロップの位置、デフォルト bottom
  overlay?: OverlayOptions; // オーバーレイ設定（指定すると表示）
  emoji?: EmojiName; // AnimatedEmoji（テキストの後ろに表示）
  color?: TelopColor; // 色設定
  sfx?: string | TelopSfxOptions; // 効果音（ファイル名 or オプション）
};

// テロップのデータ
export type TelopData = {
  text: string;
  startTime: number; // シーン内での開始時間（秒）
  duration: number;
  effects?: TelopEffects; // エフェクトシステム
  position: TelopPosition;
  overlay?: OverlayOptions;
  emoji?: EmojiName;
  color?: TelopColor; // 色設定
  sfx?: { file: string; volume: number }; // 効果音
};

// オーディオのオプション
export type AudioOptions = {
  volume?: number; // 0-1、デフォルト1
  fadeIn?: number; // フェードイン秒数
  fadeOut?: number; // フェードアウト秒数
  loop?: boolean; // ループ再生
};

// BGMのオプション
export type BgmOptions = {
  volume?: number; // 0-1、デフォルト1
  fadeIn?: number; // フェードイン秒数
  fadeOut?: number; // フェードアウト秒数
  ducking?: number; // シーン再生中の音量（0-1、デフォルトはvolumeと同じ）
};

// オーディオのデータ
export type AudioData = {
  file: string;
  startTime: number; // 動画全体での開始時間（秒）
  duration?: number; // 再生時間（秒）、指定しない場合は最後まで
  volume: number;
  fadeIn: number;
  fadeOut: number;
  loop: boolean;
  ducking?: number; // シーン再生中の音量（BGM用）
};

// シーンのデータ
export type SceneData = {
  key: string;
  file?: string; // 動画ファイル
  image?: string; // 背景画像
  backgroundColor?: string; // 背景色
  duration: number;
  startTime: number; // 動画全体での開始時間（秒）
  trimBefore: number;
  effects: EffectType[];
  telops: TelopData[];
  wipes: WipeData[];
  audios: AudioData[];
  fixedElements: FixedElementData[]; // シーン固定要素
  bgmVolume?: number; // このシーン中のBGM音量
  volume?: number; // 動画の音量（0-1）
  loop?: boolean; // シーンより短い動画をループ再生
  displayMode?: DisplayMode; // 表示モード
};

// トランジションの種類
export type TransitionType =
  // === @remotion/transitions 公式（軽量・推奨） ===
  | "fade"            // 通常のクロスフェード
  | "wipeLeft"        // 左からワイプ
  | "wipeRight"       // 右からワイプ
  | "wipeUp"          // 上からワイプ
  | "wipeDown"        // 下からワイプ
  | "slideLeft"       // 左にスライド
  | "slideRight"      // 右にスライド
  | "slideUp"         // 上にスライド
  | "slideDown"       // 下にスライド
  | "flipLeft"        // 全体が左へ回転
  | "flipRight"       // 全体が右へ回転
  | "flipUp"          // 全体が上へ回転
  | "flipDown"        // 全体が下へ回転
  | "clockWipe"       // 時計回りに表示
  // === カスタム実装（MovieRenderer.tsxのみ対応、重い） ===
  | "zoomIn"          // ズームイン
  | "zoomOut"         // ズームアウト
  | "blur"            // ブラー（重い）
  | "gridFlipLeft"    // グリッドパネルが左から右へ回転（重い）
  | "gridFlipRight"   // グリッドパネルが右から左へ回転（重い）
  | "gridFlipUp"      // グリッドパネルが上から下へ回転（重い）
  | "gridFlipDown"    // グリッドパネルが下から上へ回転（重い）
  | "gridShrink"      // グリッドパネルが縮小（重い）
  | "gridRandom";     // グリッドパネルがランダムに消える（重い）

// クロスフェード/トランジションのデータ
export type CrossFadeData = {
  scene1Key: string;
  scene2Key: string;
  duration: number; // 秒
  transition?: TransitionType; // トランジション種類（デフォルト: fade）
};

// オープニング・エンディングのデータ
export type OpeningEndingData = {
  duration: number;
  image: string;
  effect?: EffectType;
  telops: TelopData[];
  displayMode?: DisplayMode; // 表示モード
};

// ムービー全体のデータ
export type MovieData = {
  opening?: OpeningEndingData;
  ending?: OpeningEndingData;
  scenes: SceneData[];
  crossFades: CrossFadeData[];
  audios: AudioData[]; // グローバルオーディオ（BGM等）
  fixedElements: FixedElementData[]; // ムービー全体の固定要素
  totalDuration: number;
};
