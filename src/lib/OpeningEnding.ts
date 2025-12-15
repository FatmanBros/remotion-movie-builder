import { EffectType, TelopData, TelopOptions, TelopEffects, OpeningEndingOptions, DisplayMode } from "./types";

/**
 * 文字数からテロップのdurationを計算
 * 日本語の読みやすい速度: 約5文字/秒
 * 最低2秒、エフェクト用に+1秒
 */
function calculateTelopDuration(text: string): number {
  const charCount = text.length;
  const readingTime = charCount * 0.2; // 5文字/秒 = 0.2秒/文字
  const effectTime = 1; // エフェクト用の余白
  return Math.max(2, readingTime + effectTime);
}

export class OpeningEnding {
  private _explicitDuration?: number;
  readonly image: string;
  readonly effect?: EffectType;
  readonly defaultEffects?: TelopEffects;
  readonly defaultTelopPosition?: string;
  readonly displayMode?: DisplayMode;
  private _telops: TelopData[] = [];
  private _currentTime: number = 0;

  /**
   * @param duration 秒数（省略時はテロップ長から自動計算）
   * @param options オプション
   */
  constructor(duration: number | undefined, options: OpeningEndingOptions) {
    this._explicitDuration = duration;
    this.image = options.image;
    this.effect = options.effect;
    this.defaultEffects = options.effects;
    this.defaultTelopPosition = options.telopPosition;
    this.displayMode = options.displayMode;
  }

  /**
   * 長さを取得（明示的に指定されていない場合はテロップから自動計算）
   */
  get duration(): number {
    if (this._explicitDuration !== undefined) {
      return this._explicitDuration;
    }
    // テロップの終了時間の最大値を計算
    if (this._telops.length === 0) {
      return 0;
    }
    return Math.max(...this._telops.map(t => t.startTime + t.duration));
  }

  /**
   * テロップを追加（単一）
   * @param text テロップのテキスト
   * @param options テロップのオプション
   */
  telop(text: string, options?: TelopOptions): this;
  /**
   * テロップを一括追加
   * @param texts テロップのテキスト配列
   * @param startPositions シーン内での開始時間（秒）の配列
   * @param options 全テロップに適用するオプション
   */
  telop(texts: string[], startPositions: number[], options?: TelopOptions): this;
  telop(
    textOrTexts: string | string[],
    optionsOrStartPositions?: TelopOptions | number[],
    batchOptions?: TelopOptions
  ): this {
    // 配列パターン: telop(texts[], startPositions[], options?)
    if (Array.isArray(textOrTexts)) {
      const texts = textOrTexts;
      const startPositions = optionsOrStartPositions as number[];
      const options = batchOptions ?? {};

      for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        const startTime = startPositions[i] ?? this._currentTime;
        this._addTelop(text, startTime, options);
      }
      return this;
    }

    // 単一パターン: telop(text, options?)
    const text = textOrTexts;
    const options = (optionsOrStartPositions as TelopOptions) ?? {};
    const startTime = options.before ?? this._currentTime;
    this._addTelop(text, startTime, options);
    return this;
  }

  /**
   * テロップを内部的に追加
   */
  private _addTelop(text: string, startTime: number, options: TelopOptions): void {
    const duration = options.duration ?? calculateTelopDuration(text);

    const telopData: TelopData = {
      text,
      startTime,
      duration,
      effects: options.effects ?? this.defaultEffects,
      position: options.position ?? this.defaultTelopPosition ?? "bottom",
      overlay: options.overlay,
      emoji: options.emoji,
      color: options.color,
    };

    this._telops.push(telopData);

    // 次のテロップの開始時間を更新
    this._currentTime = startTime + duration;
  }

  /**
   * テロップ一覧を取得
   */
  get telops(): TelopData[] {
    return [...this._telops];
  }
}
