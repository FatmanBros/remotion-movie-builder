# Remotion Movie Builder 設計レビュー

## 総合評価: 7/10

実用的なビルダーパターンを持つが、型安全性とDRY原則に改善余地あり。

---

## 評価サマリー

| 観点 | スコア | コメント |
|------|--------|---------|
| ビルダーパターン一貫性 | 8/10 | トランジションAPIが2系統ある |
| 型安全性 | 6/10 | 文字列ベースのパース多用 |
| API設計の直感性 | 7/10 | 複数形式が混在 |
| 責務分離 (SRP) | 7/10 | TelopRenderer, SceneRenderer が肥大化 |
| 拡張性 | 6/10 | 新機能追加時の修正箇所が多い |
| DRY原則 | 5/10 | 重複コードあり |
| 命名規則 | 7/10 | 位置指定形式が不統一 |

---

## 強み

### 1. 直感的なビルダーAPI

```typescript
const movie = new Movie();
movie.bgm("bgm.mp3", { volume: 0.5 });
const scene = movie.scene("video.mp4", { duration: 5 });
scene.telop("テキスト");
scene.wipe("presenter.mp4", { position: "bottom-right" });
```

### 2. メソッドシグネチャのオーバーロード

opening/endingが複数形式に対応し、柔軟性が高い。

### 3. 階層的なデフォルト統合

Movie設定がScene→Telop→OpeningEndingまで自動伝搬。

### 4. レンダラーの責務分離

各コンポーネントが単一責務に集中（MovieRenderer, SceneRenderer, TelopRenderer等）。

---

## 課題

### 1. 型安全性の欠如

```typescript
// 現状: 文字列でなんでも許可
export type SplitDisplayMode = string;
export type TelopPosition = string;

// 問題: 実行時パースに依存
displayMode: "2/3 80% top"  // 型チェックなし
```

### 2. トランジションAPIの重複

```typescript
// 方式1: Sceneメソッド
scene1.transitionTo(scene2, { transition: Transitions.gridFlipLeft });

// 方式2: Movieメソッド（命名も不統一）
movie.crossFade(scene1, scene2, 3, Transitions.gridFlipLeft);
movie.transition(scene1, scene2, Transitions.slideUp, 2);
```

### 3. DRY違反

| 重複箇所 | ファイル |
|----------|----------|
| calculateTelopDuration | Scene.ts, OpeningEnding.ts |
| _addTelop | Scene.ts, OpeningEnding.ts |
| 位置パース | TelopRenderer, FixedElementRenderer |

### 4. コンポーネントの肥大化

- **TelopRenderer (358行)**: 位置計算、オーバーレイ、エフェクト、効果音が混在
- **SceneRenderer (322行)**: トランジション計算ロジックが複雑

### 5. エフェクト関数シグネチャの不統一

```typescript
// 位置引数
drop(frame, fps, charIndex, totalChars): EffectStyle

// オブジェクト形式
typewriter({ frame, fps, charIndex, totalChars }): EffectStyle
```

### 6. 拡張性の制限

トランジション追加時に3箇所修正が必要:
1. `types.ts` の TransitionType
2. `SceneRenderer.tsx` の calculateTransitionStyle
3. 関連する条件分岐

---

## 改善案

### 1. テロップ計算の統一

```typescript
// utils/telopUtils.ts に統合
export function calculateTelopDuration(text: string): number {
  const fullWidthChars = text.match(/[^\x00-\x7F]/g)?.length ?? 0;
  const halfWidthChars = text.length - fullWidthChars;
  return Math.max(2, (fullWidthChars * 0.15) + (halfWidthChars * 0.08) + 1);
}
```

### 2. トランジションAPI統一

```typescript
// scene.transitionTo() に統一、movie.crossFade/transition は廃止
scene1.transitionTo(scene2, {
  duration: 3,
  transition: Transitions.wipeLeft
});
```

### 3. displayMode の型安全化

```typescript
type DisplayModePreset = "cover" | "contain" | "fitWidth" | "fitHeight"
  | "vista" | "cinemascope" | "european" | "imax";

type DisplayModeSplit = {
  height: `${number}/${number}` | `${number}%`;
  width?: `${number}%`;
  position?: "center" | "top" | "bottom";
};

type DisplayMode = DisplayModePreset | DisplayModeSplit;
```

### 4. TelopRenderer の分割

```typescript
// 責務ごとに分割
export const TelopPositioner: React.FC<...>  // 位置計算
export const TelopOverlay: React.FC<...>     // オーバーレイ描画
export const TelopText: React.FC<...>        // テキスト+エフェクト
export const TelopRenderer: React.FC<...>    // 統合のみ
```

### 5. effectMapの活用

```typescript
// EffectedText.tsx の switch文を置き換え
function getEffect(type: 'enter' | 'exit' | 'emphasis', name: string) {
  return effectMap[type]?.[name];
}
```

### 6. 位置指定の型統一

```typescript
type Position =
  | "top-left" | "top-center" | "top-right"
  | "center-left" | "center" | "center-right"
  | "bottom-left" | "bottom-center" | "bottom-right";
```

### 7. トランジション拡張性の改善

```typescript
// レジストリパターンで動的追加可能に
const transitionRegistry = new Map<string, TransitionFunction>();

export function registerTransition(name: string, fn: TransitionFunction) {
  transitionRegistry.set(name, fn);
}

// 使用時
const transitionFn = transitionRegistry.get(transitionType);
```

---

## 優先度

| 優先度 | 改善項目 | 理由 | 状態 |
|--------|----------|------|------|
| 高 | calculateTelopDuration統一 | バグの温床 | ✅ 完了 |
| 高 | トランジションAPI統一 | 混乱を招く | ✅ @deprecated追加 |
| 中 | displayMode型安全化 | 実行時エラー削減 | ✅ 完了 |
| 中 | TelopRenderer分割 | 保守性向上 | ✅ 完了 |
| 低 | effectMap活用 | コード削減 | ✅ 完了 |
| 低 | 位置指定型統一 | 一貫性向上 | ✅ 完了 |

---

## ファイル構成（リファクタリング後）

```
src/lib/
├── Movie.ts              # ビルダー
├── Scene.ts              # シーン
├── OpeningEnding.ts      # プロローグ/エピローグ
├── Effects.ts            # プリセット定義
├── MovieRenderer.tsx     # 統合レンダラー
├── RmbComposition.tsx    # Remotion統合
├── types.ts              # 型定義（改善済み）
├── index.ts              # エクスポート
├── utils/
│   ├── displayMode.ts      # 表示モードパース
│   ├── colorUtils.ts       # 色変換ユーティリティ ← NEW
│   ├── telopUtils.ts       # テロップ計算ユーティリティ ← NEW
│   ├── telopPosition.ts    # テロップ位置ユーティリティ ← NEW
│   └── transitionUtils.ts  # トランジション計算ユーティリティ ← NEW
├── renderers/
│   ├── SceneRenderer.tsx    # 225行（-97行）
│   ├── TelopRenderer.tsx    # 215行（-143行）
│   ├── WipeRenderer.tsx     # 122行
│   ├── AudioRenderer.tsx    # 90行
│   ├── PrologueRenderer.tsx # 88行
│   └── FixedElementRenderer.tsx # 90行
└── effects/
    ├── types.ts
    ├── common.ts
    ├── index.ts          # effectMap完全版
    ├── enter/   # 14ファイル
    ├── exit/    # 10ファイル
    └── emphasis/ # 10ファイル
```
