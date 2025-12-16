# Remotion Movie Builder API Reference

## Movie クラス

動画を構築するためのメインクラス。

### コンストラクタ

```typescript
const movie = new Movie(options?: MovieOptions);
```

#### MovieOptions

```typescript
type MovieOptions = {
  fontSize?: number;    // テロップのデフォルトフォントサイズ（デフォルト: 48）
};
```

#### FileDefinition（従来形式）

```typescript
type FileDefinition = {
  key: string;    // シーンで参照するためのキー
  file: string;   // 動画ファイルのパス
};
```

### メソッド

#### `opening(options)` / `opening(duration, options)`

オープニングを追加する。

```typescript
const opening = movie.opening(options: OpeningEndingOptions);
// または
const opening = movie.opening(duration: number, options: OpeningEndingOptions);
```

| パラメータ | 型 | 説明 |
|-----------|------|------|
| `duration` | `number` | 表示秒数（省略時はテロップ長から自動計算） |
| `options.image` | `string` | 表示する画像ファイル |
| `options.effect` | `EffectType` | フェードエフェクト（`fadeIn` / `fadeOut`） |
| `options.displayMode` | `DisplayMode` | 表示モード |
| `options.telopPosition` | `string` | テロップのデフォルト位置 |
| `options.fontSize` | `number` | テロップのフォントサイズ（デフォルト: 48） |

#### `scene(key, options)`

シーンを追加する。

```typescript
const scene = movie.scene(key: string, options: SceneOptions);
```

| パラメータ | 型 | 説明 |
|-----------|------|------|
| `key` | `string` | ファイル定義のキー |
| `options.duration` | `number` | 表示秒数 |
| `options.trimBefore` | `number` | 動画の開始位置（秒） |
| `options.effect` | `EffectType \| EffectType[]` | エフェクト |
| `options.overlay` | `OverlayOptions` | オーバーレイ設定 |
| `options.fontSize` | `number` | テロップのフォントサイズ（デフォルト: 48） |

#### `ending(options)` / `ending(duration, options)`

エンディングを追加する。

```typescript
const ending = movie.ending(options: OpeningEndingOptions);
// または
const ending = movie.ending(duration: number, options: OpeningEndingOptions);
```

パラメータは `opening` と同様。

#### `audio(file, options)`

グローバルオーディオ（BGM等）を追加する。

```typescript
movie.audio(file: string, options?: AudioOptions);
```

| パラメータ | 型 | デフォルト | 説明 |
|-----------|------|-----------|------|
| `file` | `string` | - | 音声ファイルパス |
| `options.volume` | `number` | `1` | 音量（0-1） |
| `options.fadeIn` | `number` | `0` | フェードイン秒数 |
| `options.fadeOut` | `number` | `0` | フェードアウト秒数 |
| `options.loop` | `boolean` | `false` | ループ再生 |

#### `crossFade(scene1, scene2, duration, transition?)` ⚠️ 非推奨

> **@deprecated**: `scene.transitionTo()` を使用してください。

2つのシーン間にクロスフェードを設定する。

```typescript
movie.crossFade(scene1: Scene, scene2: Scene, duration: number, transition?: TransitionType);
```

#### `transition(scene1, scene2, transition, duration)` ⚠️ 非推奨

> **@deprecated**: `scene.transitionTo()` を使用してください。

2つのシーン間にトランジションを設定する。

```typescript
movie.transition(scene1: Scene, scene2: Scene, transition: TransitionType, duration: number);
```

#### `build()`

MovieDataを生成する。

```typescript
const movieData = movie.build();
```

---

## Scene クラス

シーンを表すクラス。`movie.scene()` で取得。

### メソッド

#### `telop(text, options)`

テロップを追加する。

```typescript
scene.telop(text: string, options: TelopOptions);
```

| パラメータ | 型 | 説明 |
|-----------|------|------|
| `text` | `string` | テロップテキスト |
| `options.duration` | `number` | 表示秒数（必須） |
| `options.before` | `number` | シーン開始からの秒数 |
| `options.effect` | `EffectType` | 従来のエフェクト |
| `options.effects` | `TelopEffects` | 新エフェクトシステム |
| `options.position` | `"bottom" \| "center" \| "top"` | 表示位置 |
| `options.overlay` | `OverlayOptions` | オーバーレイ設定 |
| `options.emoji` | `string` | 絵文字名 |
| `options.fontSize` | `number` | フォントサイズ（デフォルト: 48） |

#### `audio(file, options)`

シーン内オーディオを追加する。

```typescript
scene.audio(file: string, options?: AudioOptions);
```

#### `transitionTo(nextScene, options)`

次のシーンへのトランジションを設定する（推奨）。

```typescript
scene.transitionTo(nextScene: Scene, options: TransitionOptions);
```

| パラメータ | 型 | 説明 |
|-----------|------|------|
| `nextScene` | `Scene` | 遷移先のシーン |
| `options.duration` | `number` | トランジション秒数 |
| `options.transition` | `TransitionType` | トランジション種類 |

---

## Transitions（トランジション）

### パフォーマンス比較

| 種類 | 負荷 | 理由 |
|------|------|------|
| `fade`（基本） | 軽い | opacity変更のみ、GPU加速 |
| `wipe*` | 軽い | clipPathのみ |
| `slide*` | 軽い | transform(translate)のみ |
| `zoom*` | 軽い | scale + opacity |
| `flip*` | 中程度 | 3D変換（perspective + rotate） |
| `blur` | **重い** | フィルター処理は毎フレーム計算 |
| `grid*` | **かなり重い** | 6x6=36個のセルそれぞれに3D変換＋動画コンテンツを36回レンダリング |

> **パフォーマンスが気になる場合**: `fade`, `wipe*`, `slide*` を推奨。`grid*` は見た目は良いがレンダリング時間が大幅に増加する。

### 一覧

#### フェード系

| 名前 | 説明 | 負荷 |
|------|------|------|
| `fade` | 通常のクロスフェード（デフォルト） | 軽い |

#### ワイプ系

| 名前 | 説明 | 負荷 |
|------|------|------|
| `wipeLeft` | 左からワイプ | 軽い |
| `wipeRight` | 右からワイプ | 軽い |
| `wipeUp` | 上からワイプ | 軽い |
| `wipeDown` | 下からワイプ | 軽い |

#### スライド系

| 名前 | 説明 | 負荷 |
|------|------|------|
| `slideLeft` | 左にスライド | 軽い |
| `slideRight` | 右にスライド | 軽い |
| `slideUp` | 上にスライド | 軽い |
| `slideDown` | 下にスライド | 軽い |

#### ズーム系

| 名前 | 説明 | 負荷 |
|------|------|------|
| `zoomIn` | ズームイン | 軽い |
| `zoomOut` | ズームアウト | 軽い |

#### フリップ系

| 名前 | 説明 | 負荷 |
|------|------|------|
| `flipLeft` | 左端を軸に回転 | 中程度 |
| `flipRight` | 右端を軸に回転 | 中程度 |
| `flipUp` | 上端を軸に回転 | 中程度 |
| `flipDown` | 下端を軸に回転 | 中程度 |

#### グリッドパネル（パタパタ）

| 名前 | 説明 | 負荷 |
|------|------|------|
| `gridFlipLeft` | 左から右へパタパタ回転 | 重い |
| `gridFlipRight` | 右から左へパタパタ回転 | 重い |
| `gridFlipUp` | 上から下へパタパタ回転 | 重い |
| `gridFlipDown` | 下から上へパタパタ回転 | 重い |
| `gridShrink` | 中心から外へ縮小 | 重い |
| `gridRandom` | ランダムに消える | 重い |

#### その他

| 名前 | 説明 | 負荷 |
|------|------|------|
| `blur` | ブラー | 重い |

---

## Effects（エフェクト）

### EffectType

シーンやオープニング/エンディングに適用するエフェクト。

| 名前 | 説明 |
|------|------|
| `fadeIn` | フェードイン |
| `fadeOut` | フェードアウト |
| `kirakira` | キラキラ（テロップ用） |

---

## TelopPresets（テロッププリセット）

### プリセット一覧

| 名前 | enter | exit | emphasis |
|------|-------|------|----------|
| `dropRainbow` | drop | dropOut | rainbow |
| `bouncePulse` | bounce | zoomOut | pulse |
| `slideGlow` | slideInLeft | slideOutRight | glow |
| `zoomNeon` | zoomIn | zoomOut | neon |
| `typeWave` | typewriter | dissolve | wave |
| `elasticShake` | elastic | scatter | shake |
| `blurGlow` | blur | dissolve | glow |
| `rotateRainbow` | rotate | scatter | rainbow |
| `risePulse` | rise | riseOut | pulse |
| `simple` | zoomIn | zoomOut | - |

### 出現エフェクト（Enter Effects）

| 名前 | 説明 |
|------|------|
| `drop` | 上から落下 |
| `rise` | 下から浮上 |
| `slideInLeft` | 左からスライドイン |
| `slideInRight` | 右からスライドイン |
| `zoomIn` | 拡大して出現 |
| `bounce` | バウンドしながら出現 |
| `typewriter` | タイプライター風 |
| `kirakira` | キラキラ |
| `blur` | ぼやけからクリアに |
| `rotate` | 回転しながら出現 |
| `elastic` | ゴムのように伸縮 |

### 消失エフェクト（Exit Effects）

| 名前 | 説明 |
|------|------|
| `dropOut` | 下に落ちて消える |
| `riseOut` | 上に消える |
| `slideOutLeft` | 左にスライドアウト |
| `slideOutRight` | 右にスライドアウト |
| `zoomOut` | 縮小して消える |
| `dissolve` | 溶けるように消える |
| `scatter` | バラバラに散る |
| `kirakiraOut` | キラキラして消える |

### 強調エフェクト（Emphasis Effects）

| 名前 | 説明 |
|------|------|
| `pulse` | 脈打つように拡大縮小 |
| `shake` | 揺れる |
| `glow` | 光る/輝く |
| `wave` | 文字が波打つ |
| `rainbow` | 虹色に変化 |
| `neon` | ネオンサインのように点滅 |

---

## MovieRenderer コンポーネント

ビルドしたMovieDataをレンダリングするReactコンポーネント。

```tsx
import { MovieRenderer } from "./lib";

const movieData = movie.build();

<MovieRenderer movieData={movieData} />
```

### Props

| Prop | 型 | 説明 |
|------|------|------|
| `movieData` | `MovieData` | `movie.build()` で生成したデータ |
