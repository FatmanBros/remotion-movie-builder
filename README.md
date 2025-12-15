# Remotion Movie Builder

Remotionを使った動画生成のためのビルダーパターンライブラリ。

## インストール

```bash
npm install
```

## デモ

Remotion Studioを起動してデモを確認できます。

```bash
npm run start
```

ブラウザで `http://localhost:3000` を開くと、各種デモを確認できます。

| デモ | 内容 | 主な機能 |
|------|------|----------|
| Demo1 | 基本的なシーン | 動画シーン、テロップ、オープニング/エンディング |
| Demo2 | 画像シーン | 画像ファイルでシーン作成、duration自動計算 |
| Demo3 | テロップエフェクト | プリセット、出現/消失/強調エフェクト |
| Demo4 | トランジション | シーン切替エフェクト、transitionTo() |
| Demo5 | ワイプ（PiP） | ワイプ動画、位置・サイズ・タイミング制御 |
| Demo6 | テロップ配列 | 一括追加、同時表示、afterオプション |
| Demo7 | テロップ色 | TelopColorsプリセット、縁取り、グラデーション |
| Demo8 | オーバーレイ | gradient、box、shadow |
| Demo9 | 固定要素 | ロゴ、ウォーターマーク、位置指定 |
| Demo10 | 表示モード | displayMode、テロップ位置（position） |

## APIリファレンス

詳細なAPIリファレンスは **[APIリファレンス](docs/API_REFERENCE.md)** を参照してください。

---

## API Overview

### Movie

動画全体を構築するメインクラス。

```typescript
import { Movie } from "./lib";

const movie = new Movie();
```

| メソッド | 説明 | 戻り値 |
|---------|------|--------|
| `opening(options)` | オープニングを設定 | `OpeningEnding` |
| `scene(file?, options?)` | シーンを追加 | `Scene` |
| `ending(options)` | エンディングを設定 | `OpeningEnding` |
| `crossFade(...)` | ⚠️ 非推奨: `scene.transitionTo()` を使用 | `this` |
| `transition(...)` | ⚠️ 非推奨: `scene.transitionTo()` を使用 | `this` |
| `audio(file, options?)` | グローバルオーディオを追加 | `this` |
| `bgm(file, options?)` | BGMを追加（ダッキング対応） | `this` |
| `build()` | MovieDataを構築 | `MovieData` |

### Scene

個々のシーンを表すクラス。

```typescript
// 動画シーン
const scene = movie.scene("video.mp4", {
  duration: 10,
  trimBefore: 5,
  volume: 0.5,
  effect: [Effects.fadeIn],
  overlay: { color: "0,0,0" },
});

// 画像シーン（拡張子で自動判別）
const imageScene = movie.scene("photo.jpg", { duration: 5 });

// メディアなしシーン
const textScene = movie.scene({ duration: 3 });
```

| メソッド | 説明 | 戻り値 |
|---------|------|--------|
| `telop(text, options?)` | テロップを追加 | `this` |
| `wipe(file, options?)` | ワイプ動画を追加 | `this` |
| `audio(file, options?)` | シーン内オーディオを追加 | `this` |
| `transitionTo(scene, options?)` | 次シーンへのトランジション設定 | `this` |

| プロパティ | 型 | 説明 |
|-----------|-----|------|
| `key` | `string` | シーンのキー |
| `file` | `string?` | 動画ファイルパス |
| `image` | `string?` | 画像ファイルパス |
| `duration` | `number` | 秒数 |
| `volume` | `number?` | 動画の音量（0-1） |
| `trimBefore` | `number` | 先頭のトリム秒数 |
| `telops` | `TelopData[]` | テロップ一覧 |
| `wipes` | `WipeData[]` | ワイプ一覧 |
| `audios` | `AudioData[]` | オーディオ一覧 |

### OpeningEnding

オープニング・エンディングを表すクラス。

```typescript
const opening = movie.opening({
  image: "background.webp",
  effect: Effects.fadeOut,
});
```

| メソッド | 説明 | 戻り値 |
|---------|------|--------|
| `telop(text, options?)` | テロップを追加 | `this` |

### MovieRenderer

構築したMovieDataをレンダリングするReactコンポーネント。

```tsx
import { MovieRenderer } from "./lib";

<MovieRenderer movieData={movieData} />
```

---

## 型定義

### SceneOptions

```typescript
type SceneOptions = {
  duration?: number;          // 秒数（省略時はテロップ長から自動計算）
  trimBefore?: number;        // 先頭トリム秒数
  volume?: number;            // 動画の音量（0-1）
  effect?: EffectType[];      // エフェクト配列
  overlay?: OverlayOptions;   // オーバーレイ設定
  bgmVolume?: number;         // このシーン中のBGM音量
};
```

### WipeOptions

```typescript
type WipeOptions = {
  position?: WipePosition;    // "top-left" | "top-right" | "bottom-left" | "bottom-right"
  size?: number;              // サイズ比率（0-1、デフォルト0.3）
  volume?: number;            // 音量（0-1）
  trimBefore?: number;        // 動画開始位置（秒）
  borderRadius?: number;      // 角丸（px）
  margin?: number;            // 画面端からの余白（px）
  before?: number;            // シーン開始からの秒数
  duration?: number;          // 表示秒数
  chromaKey?: boolean | ChromaKeyOptions;  // クロマキー
};

type ChromaKeyOptions = {
  color?: "green" | "blue" | string;  // キーカラー
  similarity?: number;         // 類似度（0-1）
  smoothness?: number;         // 滑らかさ（0-1）
};
```

### TelopOptions

```typescript
type TelopOptions = {
  duration?: number;          // 表示秒数（省略時は文字数から自動計算）
  before?: number;            // 開始時間（秒）
  effects?: TelopEffects;     // エフェクトシステム
  position?: TelopPosition;   // "top" | "center" | "bottom"
  overlay?: OverlayOptions;   // オーバーレイ
  emoji?: string;             // 絵文字
  color?: TelopColor;         // 色設定
  sfx?: string | TelopSfxOptions;  // 効果音
};
```

### TelopEffects

```typescript
type TelopEffects = {
  enter?: EnterEffectType;      // 出現エフェクト
  exit?: ExitEffectType;        // 消失エフェクト
  emphasis?: EmphasisEffectType; // 強調エフェクト
};
```

### AudioOptions / BgmOptions

```typescript
type AudioOptions = {
  volume?: number;    // 音量（0-1）
  fadeIn?: number;    // フェードイン秒数
  fadeOut?: number;   // フェードアウト秒数
  loop?: boolean;     // ループ再生
};

type BgmOptions = {
  volume?: number;    // 音量（0-1）
  fadeIn?: number;    // フェードイン秒数
  fadeOut?: number;   // フェードアウト秒数
  ducking?: number;   // シーン中の音量（デフォルトは30%）
};
```

### TransitionOptions

```typescript
type TransitionOptions = {
  duration?: number;          // トランジション秒数（デフォルト: 3）
  transition?: TransitionType; // トランジション種類（デフォルト: "fade"）
};
```

---

## エクスポート

```typescript
import {
  // クラス
  Movie,
  Scene,
  OpeningEnding,
  MovieRenderer,

  // エフェクト
  Effects,
  TelopPresets,
  Transitions,
  TelopColors,

  // エフェクト関数
  EnterEffects,
  ExitEffects,
  EmphasisEffects,
  effectMap,

  // 型
  type EffectType,
  type EnterEffectType,
  type ExitEffectType,
  type EmphasisEffectType,
  type TelopEffects,
  type TransitionType,
  type SceneOptions,
  type WipeOptions,
  type WipePosition,
  type ChromaKeyOptions,
  type TelopOptions,
  type TelopColor,
  type AudioOptions,
  type BgmOptions,
  type MovieData,
  // ...
} from "./lib";
```

