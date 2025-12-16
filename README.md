# Remotion Movie Builder

> ⚠️ **重要**: このライブラリは[Remotion](https://remotion.dev)を使用しています。Remotionは商用利用に**有料ライセンス**が必要です。本ライブラリ自体はMITライセンスですが、Remotionのライセンス条項に従う必要があります。詳細は[Remotion Licensing](https://remotion.dev/license)を参照してください。
>
> ⚠️ **Important**: This library uses [Remotion](https://remotion.dev) which requires a **commercial license** for business use. This library itself is MIT licensed, but you must comply with Remotion's licensing terms. See [Remotion Licensing](https://remotion.dev/license).

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
| Demo11 | オーディオ | BGM、ダッキング、フェードイン/アウト |
| Demo12 | フォントサイズ | fontSize、階層的な設定、優先順位 |
| Demo13 | SRT字幕 | WhisperX形式、話者ID変換、色分け |

## APIリファレンス

詳細なAPIリファレンスは **[APIリファレンス](docs/API_REFERENCE.md)** を参照してください。

---

## API Overview

### Movie

動画全体を構築するメインクラス。

```typescript
import { Movie, Transitions, TelopPresets } from "./lib";

// 基本
const movie = new Movie();

// オプション付き
const movie = new Movie({
  size: "shorts",  // 縦長動画 (1080x1920)
  transition: { type: Transitions.fade, duration: 1 },  // デフォルトトランジション
  telop: {
    effects: TelopPresets.simple,
    position: "bottom 20%",
    fontSize: 56,
  },
});
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
| `subtitle(srt, options?)` | SRT字幕を追加 | `this` |
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
});

// 画像シーン（拡張子で自動判別）
const imageScene = movie.scene("photo.jpg", { duration: 5 });

// メディアなしシーン
const textScene = movie.scene({ duration: 3 });

// テロップのデフォルト設定付きシーン
const styledScene = movie.scene("video.mp4", {
  telop: {
    position: "bottom 20%",
    fontSize: 56,
    overlay: { type: "gradient" },
  },
});
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
  bgmVolume?: number;         // このシーン中のBGM音量
  displayMode?: DisplayMode;  // 表示モード
  telop?: TelopDefaults;      // テロップのデフォルト設定
};

type TelopDefaults = {
  effects?: TelopEffects;     // デフォルトエフェクト
  overlay?: OverlayOptions;   // デフォルトオーバーレイ（デフォルト: shadow）
  position?: TelopPosition;   // デフォルト位置
  charDuration?: number;      // 1文字あたりの表示秒数
  fontSize?: number;          // フォントサイズ（デフォルト: 48）
  color?: TelopColor;         // デフォルト色設定
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
  fontSize?: number;          // フォントサイズ（デフォルト: 48）
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

### SubtitleOptions

```typescript
type SubtitleOptions = {
  effects?: TelopEffects;     // エフェクト設定
  position?: TelopPosition;   // 表示位置（デフォルト: "bottom 10%"）
  color?: TelopColor;         // 色設定
  fontSize?: number;          // フォントサイズ（デフォルト: 42）
  overlay?: OverlayOptions;   // オーバーレイ設定
};
```

---

## 字幕（SRT）

SRTファイルまたはSRT形式の文字列から字幕を追加できます。シーンをまたいで動画全体に表示されます。

### 文字列で指定

```typescript
const srtContent = `
1
00:00:01,000 --> 00:00:04,000
こんにちは

2
00:00:05,000 --> 00:00:08,000
これはサンプルです
`;

movie.subtitle(srtContent, {
  position: "bottom 10%",
  effects: TelopPresets.simple,
});
```

### ファイルパスで指定

`public/` フォルダにSRTファイルを配置し、ファイル名で指定します。

```typescript
// public/subtitles.srt に配置
movie.subtitle("subtitles.srt", {
  position: "bottom 10%",
  color: { text: "#ffffff" },
});
```

### オプション

| オプション | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| `position` | `TelopPosition` | `"bottom 10%"` | 表示位置 |
| `effects` | `TelopEffects` | - | エフェクト設定 |
| `color` | `TelopColor` | - | 色設定 |
| `fontSize` | `number` | `42` | フォントサイズ |
| `overlay` | `OverlayOptions` | - | オーバーレイ設定 |
| `speakers` | `Record<string, SpeakerStyle>` | - | 話者別スタイル（名前変換含む） |
| `showSpeakerName` | `boolean` | `false` | 話者名を表示するか |
| `prefix` | `string` | - | 字幕の前に付けるテキスト |
| `suffix` | `string` | - | 字幕の後に付けるテキスト |

### 話者別スタイル

SRTファイルに話者情報を含めると、話者ごとに色などを変えられます。

**対応フォーマット:**
- `[話者名] テキスト`
- `（話者名）テキスト`
- `(話者名) テキスト`

```typescript
const srtContent = `
1
00:00:01,000 --> 00:00:04,000
[田中] こんにちは

2
00:00:05,000 --> 00:00:08,000
[山田] はい、こんにちは
`;

movie.subtitle(srtContent, {
  speakers: {
    "田中": { color: { text: "#ffdd00" } },
    "山田": { color: { text: "#00ddff" } },
  },
});
```

### 話者ID→名前の変換（WhisperX対応）

WhisperXなどで生成されたSRTファイルの `SPEAKER_00` などのIDを名前に変換できます。
`speakers` オブジェクトの `name` プロパティで話者IDから表示名への変換を指定します。

```typescript
// WhisperXで生成されたSRT
const srtContent = `
1
00:00:01,000 --> 00:00:04,000
[SPEAKER_00] こんにちは

2
00:00:05,000 --> 00:00:08,000
[SPEAKER_01] はい、こんにちは
`;

movie.subtitle(srtContent, {
  // 話者ID→名前変換 & スタイル設定を一箇所で
  speakers: {
    "SPEAKER_00": {
      name: "田中",  // 表示名
      color: { text: "#ffdd00" },
    },
    "SPEAKER_01": {
      name: "山田",
      color: { text: "#00ddff" },
    },
  },
  prefix: "{{$speaker}}「",
  suffix: "」",
});
// 表示例: 田中「こんにちは」
```

### prefix/suffix で表示形式をカスタマイズ

`{{$speaker}}` プレースホルダーで話者名を挿入できます。

```typescript
movie.subtitle(srtContent, {
  speakers: {
    "SPEAKER_00": { name: "田中", color: { text: "#ffdd00" } },
    "SPEAKER_01": { name: "山田", color: { text: "#00ddff" } },
  },
  prefix: "{{$speaker}}「",
  suffix: "」",
});
// 表示例: 田中「こんにちは」
```

---

## フォントサイズ

テロップのフォントサイズを柔軟に指定できます。

### Movie全体のデフォルト

```typescript
const movie = new Movie({
  telop: { fontSize: 64 },  // 全テロップに適用（デフォルト: 48）
});
```

### シーン単位のデフォルト

```typescript
const scene = movie.scene("video.mp4", {
  telop: { fontSize: 56 },  // このシーンのテロップに適用
});
```

### Opening/Ending単位

```typescript
const opening = movie.opening({
  image: "title.png",
  telop: { fontSize: 72 },  // オープニングのテロップに適用
});
```

### 個別テロップ

```typescript
scene.telop("大きいテロップ", { fontSize: 80 });
scene.telop("小さいテロップ", { fontSize: 32 });
```

### 優先順位

1. テロップ個別の `fontSize`
2. シーン/Opening/Ending の `telop.fontSize`
3. Movie の `telop.fontSize`
4. デフォルト値 `48`

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
  type TelopDefaults,
  type TransitionType,
  type TransitionDefaults,
  type SceneOptions,
  type WipeOptions,
  type WipePosition,
  type ChromaKeyOptions,
  type TelopOptions,
  type TelopColor,
  type AudioOptions,
  type BgmOptions,
  type SubtitleOptions,
  type MovieData,
  // ...
} from "./lib";
```

---

## ライセンスについて / License

このライブラリは [Remotion](https://www.remotion.dev/) を使用しています。

**重要**: Remotionは商用利用の場合、ライセンス購入が必要です。

- **無料で利用可能**: 個人利用、教育目的、オープンソースプロジェクト
- **有料ライセンスが必要**: 企業での利用、商用利用、クライアントワーク

詳細は [Remotion Licensing](https://www.remotion.dev/license) を確認してください。

本ライブラリ（Remotion Movie Builder）自体はRemotionのラッパーであり、Remotionのライセンス条項に従う必要があります。

---

This library uses [Remotion](https://www.remotion.dev/).

**Important**: Remotion requires a license for commercial use.

- **Free to use**: Personal use, educational purposes, open-source projects
- **License required**: Company use, commercial use, client work

See [Remotion Licensing](https://www.remotion.dev/license) for details.

This library (Remotion Movie Builder) is a wrapper around Remotion and is subject to Remotion's licensing terms.

