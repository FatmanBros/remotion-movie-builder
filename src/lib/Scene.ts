import {
  EffectType,
  TelopData,
  TelopOptions,
  TelopEffects,
  AudioData,
  AudioOptions,
  OverlayOptions,
  SceneOptions,
  TransitionType,
  WipeData,
  WipeOptions,
  FixedElementData,
  FixedImageOptions,
  FixedTextOptions,
  DisplayMode,
} from "./types";
import { calculateTelopDuration, normalizeSfx } from "./utils/telopUtils";

// トランジションオプション
export type TransitionOptions = {
  duration?: number;
  transition?: TransitionType;
};

// トランジションデータ（内部用）
export type SceneTransition = {
  toSceneKey: string;
  duration: number;
  transition: TransitionType;
};

export class Scene {
  readonly key: string;
  readonly file?: string;
  readonly image?: string;
  readonly backgroundColor?: string;
  private _explicitDuration?: number;
  readonly trimBefore: number;
  readonly effects: EffectType[];
  readonly defaultOverlay?: OverlayOptions;
  readonly defaultEffects?: TelopEffects;
  readonly defaultTelopPosition?: string;
  readonly defaultCharDuration?: number;
  readonly defaultFontSize?: number;
  readonly bgmVolume?: number;
  readonly volume?: number;
  readonly loop?: boolean;
  readonly displayMode?: DisplayMode;
  private _telops: TelopData[] = [];
  private _wipes: WipeData[] = [];
  private _audios: AudioData[] = [];
  private _transitions: SceneTransition[] = [];
  private _fixedElements: FixedElementData[] = [];
  private _currentTime: number = 0; // 次のテロップの開始時間を追跡

  constructor(key: string, file: string | undefined, image: string | undefined, options: SceneOptions) {
    this.key = key;
    this.file = file;
    this.image = image;
    this.backgroundColor = options.backgroundColor;
    this._explicitDuration = options.duration;
    this.trimBefore = options.trimBefore ?? 0;
    this.effects = options.effect ?? [];
    this.defaultOverlay = options.overlay;
    this.defaultEffects = options.effects;
    this.defaultTelopPosition = options.telopPosition;
    this.defaultCharDuration = options.charDuration;
    this.defaultFontSize = options.fontSize;
    this.bgmVolume = options.bgmVolume;
    this.volume = options.volume;
    // trimBeforeがある場合はloopを無効化（Loopコンポーネントで負のdurationになる問題回避）
    this.loop = options.loop ?? (options.trimBefore ? false : true);
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
   * 動画内の終了位置（trimBefore + duration）
   */
  get trimEnd(): number {
    return this.trimBefore + this.duration;
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
    // before: シーン開始からの絶対秒数
    // after: 前のテロップ終了後からの相対秒数
    // どちらも未指定: 前のテロップの終了後（after: 0と同じ）
    let startTime: number;
    if (options.before !== undefined) {
      startTime = options.before;
    } else if (options.after !== undefined) {
      startTime = this._currentTime + options.after;
    } else {
      startTime = this._currentTime;
    }
    this._addTelop(text, startTime, options);
    return this;
  }

  /**
   * テロップを内部的に追加
   */
  private _addTelop(text: string, startTime: number, options: TelopOptions): void {
    const charDuration = options.charDuration ?? this.defaultCharDuration;
    const duration = options.duration ?? calculateTelopDuration(text, charDuration);
    const sfx = normalizeSfx(options.sfx);

    const telopData: TelopData = {
      text,
      startTime,
      duration,
      effects: options.effects ?? this.defaultEffects,
      position: options.position ?? this.defaultTelopPosition ?? "bottom",
      overlay: options.overlay ?? this.defaultOverlay,
      emoji: options.emoji,
      color: options.color,
      sfx,
      fontSize: options.fontSize ?? this.defaultFontSize,
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

  /**
   * ワイプ動画を追加
   * @param file 動画ファイル名
   * @param options ワイプのオプション
   */
  wipe(file: string, options: WipeOptions = {}): this {
    // クロマキー設定を処理
    let chromaKey: WipeData["chromaKey"];
    if (options.chromaKey) {
      const chromaOpts = options.chromaKey === true ? {} : options.chromaKey;
      const colorMap: Record<string, string> = {
        green: "#00ff00",
        blue: "#0000ff",
      };
      const colorInput = chromaOpts.color ?? "green";
      chromaKey = {
        color: colorMap[colorInput] ?? colorInput,
        similarity: chromaOpts.similarity ?? 0.4,
        smoothness: chromaOpts.smoothness ?? 0.1,
      };
    }

    const wipeData: WipeData = {
      file,
      position: options.position ?? "bottom-right",
      size: options.size ?? 0.3,
      volume: options.volume ?? 1,
      trimBefore: options.trimBefore ?? 0,
      borderRadius: options.borderRadius ?? 12,
      margin: options.margin ?? 20,
      startTime: options.before ?? 0,
      duration: options.duration,
      chromaKey,
    };

    this._wipes.push(wipeData);
    return this;
  }

  /**
   * ワイプ一覧を取得
   */
  get wipes(): WipeData[] {
    return [...this._wipes];
  }

  /**
   * オーディオを追加（シーン内で再生）
   * @param file オーディオファイル名
   * @param options オーディオのオプション
   */
  audio(file: string, options: AudioOptions = {}): this {
    const audioData: AudioData = {
      file,
      startTime: 0, // シーン内での開始時間（build時に絶対時間に変換）
      duration: options.loop ? undefined : this.duration,
      volume: options.volume ?? 1,
      fadeIn: options.fadeIn ?? 0,
      fadeOut: options.fadeOut ?? 0,
      loop: options.loop ?? false,
    };

    this._audios.push(audioData);
    return this;
  }

  /**
   * オーディオ一覧を取得
   */
  get audios(): AudioData[] {
    return [...this._audios];
  }

  /**
   * 次のシーンへのトランジションを設定
   * @param toScene 遷移先のシーン
   * @param options トランジションオプション
   */
  transitionTo(toScene: Scene, options: TransitionOptions = {}): this {
    this._transitions.push({
      toSceneKey: toScene.key,
      duration: options.duration ?? 3,
      transition: options.transition ?? "fade",
    });
    return this;
  }

  /**
   * トランジション一覧を取得
   */
  get transitions(): SceneTransition[] {
    return [...this._transitions];
  }

  /**
   * 固定画像を追加
   * @param file 画像ファイル名
   * @param options オプション
   */
  fixedImage(file: string, options: FixedImageOptions = {}): this {
    this._fixedElements.push({
      type: "image",
      content: file,
      position: options.position ?? "top-right",
      margin: options.margin ?? 20,
      opacity: options.opacity ?? 1,
      scale: options.scale ?? 1,
      width: options.width,
      height: options.height,
    });
    return this;
  }

  /**
   * 固定テキストを追加
   * @param text テキスト
   * @param options オプション
   */
  fixedText(text: string, options: FixedTextOptions = {}): this {
    this._fixedElements.push({
      type: "text",
      content: text,
      position: options.position ?? "top-right",
      margin: options.margin ?? 20,
      opacity: options.opacity ?? 1,
      scale: options.scale ?? 1,
      fontSize: options.fontSize ?? 24,
      color: options.color ?? "#ffffff",
      backgroundColor: options.backgroundColor,
      padding: options.padding ?? 8,
      borderRadius: options.borderRadius ?? 4,
    });
    return this;
  }

  /**
   * 固定要素一覧を取得
   */
  get fixedElements(): FixedElementData[] {
    return [...this._fixedElements];
  }
}
