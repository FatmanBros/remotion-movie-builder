import { parseSrt } from "@remotion/captions";
import { Scene } from "./Scene";
import { OpeningEnding } from "./OpeningEnding";
import {
  OpeningEndingOptions,
  SceneOptions,
  OpeningEndingData,
  SceneData,
  CrossFadeData,
  AudioData,
  AudioOptions,
  BgmOptions,
  MovieData,
  MovieOptions,
  TransitionType,
  TelopDefaults,
  FixedElementData,
  FixedImageOptions,
  FixedTextOptions,
  VideoSize,
  SubtitleOptions,
  SubtitleData,
} from "./types";

export class Movie {
  private _fps: number;
  private _width: number;
  private _height: number;
  private _opening?: OpeningEnding;
  private _ending?: OpeningEnding;
  private _scenes: Scene[] = [];
  private _crossFades: CrossFadeData[] = [];
  private _audios: AudioData[] = [];
  private _fixedElements: FixedElementData[] = [];
  private _subtitles?: SubtitleData;
  private _currentTime: number = 0;
  private _defaultTelop?: TelopDefaults;
  private _defaultTransitionType?: TransitionType;
  private _defaultTransitionDuration: number;

  constructor(options?: MovieOptions) {
    this._fps = options?.fps ?? 30;
    // size プリセットがあればそちらを優先
    if (options?.size) {
      const preset = VideoSize[options.size];
      this._width = preset.width;
      this._height = preset.height;
    } else {
      this._width = options?.width ?? 1920;
      this._height = options?.height ?? 1080;
    }
    this._defaultTelop = options?.telop;
    this._defaultTransitionType = options?.transition?.type;
    this._defaultTransitionDuration = options?.transition?.duration ?? 3;
  }

  /**
   * オープニングを設定
   * @param durationOrOptions 秒数、またはオプション（省略時はテロップ長から自動計算）
   * @param options オプション（第1引数が秒数の場合）
   */
  opening(durationOrOptions: number | OpeningEndingOptions, options?: OpeningEndingOptions): OpeningEnding {
    if (typeof durationOrOptions === "number") {
      // opening(duration, options) の形式
      const mergedOptions = this._mergeDefaultsToOptions(options!);
      this._opening = new OpeningEnding(durationOrOptions, mergedOptions);
    } else {
      // opening(options) の形式（duration自動計算）
      const mergedOptions = this._mergeDefaultsToOptions(durationOrOptions);
      this._opening = new OpeningEnding(undefined, mergedOptions);
    }
    return this._opening;
  }

  /**
   * オプションにMovieのデフォルト設定をマージ
   */
  private _mergeDefaultsToOptions<T extends { telop?: TelopDefaults }>(options: T): T {
    // Movieのデフォルトtelopがなければそのまま返す
    if (!this._defaultTelop) {
      return options;
    }

    // オプションのtelopとMovieのデフォルトtelopをマージ
    const mergedTelop: TelopDefaults = {
      ...this._defaultTelop,
      ...options.telop,
    };

    return {
      ...options,
      telop: mergedTelop,
    };
  }

  /**
   * シーンを追加
   * @param fileOrOptions 動画/画像ファイル名、またはオプション（メディアなしの場合）
   * @param options シーンのオプション（第1引数がファイル名の場合）
   */
  scene(fileOrOptions?: string | SceneOptions, options?: SceneOptions): Scene {
    let file: string | undefined;
    let image: string | undefined;
    let opts: SceneOptions;

    // 画像ファイルの拡張子
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg"];

    if (typeof fileOrOptions === "string") {
      // scene("file.mp4", options) または scene("image.png", options) の形式
      const ext = fileOrOptions.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";
      if (imageExtensions.includes(ext)) {
        image = fileOrOptions;
      } else {
        file = fileOrOptions;
      }
      opts = options ?? {};
    } else {
      // scene(options) または scene() の形式（メディアなし）
      opts = fileOrOptions ?? {};
    }

    // keyはシーン番号を含めて一意にする
    const sceneIndex = this._scenes.length;
    const mediaFile = file ?? image;
    const baseName = mediaFile ? mediaFile.replace(/\.[^.]+$/, "") : "scene";
    const key = `${baseName}_${sceneIndex}`;

    // Movieのデフォルトエフェクトをマージ
    const mergedOpts = this._mergeDefaultsToOptions(opts);

    const scene = new Scene(key, file, image, mergedOpts);
    this._scenes.push(scene);

    return scene;
  }

  /**
   * クロスフェード/トランジションを設定
   * @deprecated scene.transitionTo() を使用してください
   * @example scene1.transitionTo(scene2, { duration: 3, transition: "fade" })
   */
  crossFade(
    scene1: Scene,
    scene2: Scene,
    duration: number = 3,
    transition: TransitionType = "fade"
  ): this {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Movie] crossFade() is deprecated. Use scene.transitionTo() instead.\n" +
        "Example: scene1.transitionTo(scene2, { duration: 3, transition: \"fade\" })"
      );
    }
    this._crossFades.push({
      scene1Key: scene1.key,
      scene2Key: scene2.key,
      duration,
      transition,
    });
    return this;
  }

  /**
   * トランジションを設定（crossFadeのエイリアス）
   * @deprecated scene.transitionTo() を使用してください
   * @example scene1.transitionTo(scene2, { duration: 3, transition: "slideLeft" })
   */
  transition(
    scene1: Scene,
    scene2: Scene,
    transition: TransitionType,
    duration: number = 3
  ): this {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Movie] transition() is deprecated. Use scene.transitionTo() instead.\n" +
        "Example: scene1.transitionTo(scene2, { duration: 3, transition: \"slideLeft\" })"
      );
    }
    return this.crossFade(scene1, scene2, duration, transition);
  }

  /**
   * エンディングを設定
   * @param durationOrOptions 秒数、またはオプション（省略時はテロップ長から自動計算）
   * @param options オプション（第1引数が秒数の場合）
   */
  ending(durationOrOptions: number | OpeningEndingOptions, options?: OpeningEndingOptions): OpeningEnding {
    if (typeof durationOrOptions === "number") {
      // ending(duration, options) の形式
      const mergedOptions = this._mergeDefaultsToOptions(options!);
      this._ending = new OpeningEnding(durationOrOptions, mergedOptions);
    } else {
      // ending(options) の形式（duration自動計算）
      const mergedOptions = this._mergeDefaultsToOptions(durationOrOptions);
      this._ending = new OpeningEnding(undefined, mergedOptions);
    }
    return this._ending;
  }

  /**
   * グローバルオーディオを追加（動画全体で再生）
   * @param file オーディオファイル名
   * @param options オーディオのオプション
   */
  audio(file: string, options: AudioOptions = {}): this {
    const audioData: AudioData = {
      file,
      startTime: 0, // 動画開始から
      duration: undefined, // 最後まで再生
      volume: options.volume ?? 1,
      fadeIn: options.fadeIn ?? 0,
      fadeOut: options.fadeOut ?? 0,
      loop: options.loop ?? false,
    };

    this._audios.push(audioData);
    return this;
  }

  /**
   * BGMを追加（シーン中はダッキングで音量を下げる）
   * @param file オーディオファイル名
   * @param options BGMのオプション
   */
  bgm(file: string, options: BgmOptions = {}): this {
    const audioData: AudioData = {
      file,
      startTime: 0,
      duration: undefined,
      volume: options.volume ?? 1,
      fadeIn: options.fadeIn ?? 2,
      fadeOut: options.fadeOut ?? 2,
      loop: true,
      ducking: options.ducking ?? (options.volume ?? 1) * 0.3, // デフォルトは30%に下げる
    };

    this._audios.push(audioData);
    return this;
  }

  /**
   * 固定画像を追加（ムービー全体で表示）
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
   * 固定テキストを追加（ムービー全体で表示）
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
   * SRT字幕を追加（ムービー全体で表示）
   * @param srtPathOrContent SRTファイルパス（.srt拡張子）またはSRT形式の文字列
   * @param options 字幕のオプション
   * @example
   * // ファイルパスで指定（public/フォルダに配置）
   * movie.subtitle("subtitles.srt", { position: "bottom 10%" });
   *
   * // 文字列で指定
   * const srtContent = fs.readFileSync("subtitles.srt", "utf-8");
   * movie.subtitle(srtContent, { effects: TelopPresets.simple });
   */
  subtitle(srtPathOrContent: string, options: SubtitleOptions = {}): this {
    // .srt 拡張子ならファイルパスと判断
    const isSrtFile = srtPathOrContent.trim().endsWith(".srt");

    if (isSrtFile) {
      // ファイルパスの場合はレンダリング時に非同期ロード
      this._subtitles = {
        file: srtPathOrContent,
        options,
      };
    } else {
      // 文字列の場合は即座にパース
      const { captions } = parseSrt({ input: srtPathOrContent });
      this._subtitles = {
        captions: captions.map((c) => ({
          text: c.text,
          startMs: c.startMs,
          endMs: c.endMs,
        })),
        options,
      };
    }
    return this;
  }

  /**
   * ムービーデータを構築
   */
  build(): MovieData {
    let currentTime = 0;

    // オープニングの時間
    if (this._opening) {
      currentTime = this._opening.duration;
    }

    // シーンの開始時間を計算
    const scenesData: SceneData[] = [];
    const sceneStartTimes = new Map<string, number>();

    for (let i = 0; i < this._scenes.length; i++) {
      const scene = this._scenes[i];

      // クロスフェードを考慮した開始時間
      let startTime = currentTime;
      let transitionDuration: number | undefined;

      // 前のシーンとのクロスフェードがあるか確認
      if (i > 0) {
        const prevScene = this._scenes[i - 1];

        // movie.crossFade() で設定されたトランジション
        const crossFade = this._crossFades.find(
          (cf) =>
            cf.scene1Key === prevScene.key && cf.scene2Key === scene.key
        );

        // scene.transitionTo() で設定されたトランジション
        const sceneTransition = prevScene.transitions.find(
          (t) => t.toSceneKey === scene.key
        );

        // 明示的なトランジションがない場合、デフォルトを使用
        transitionDuration = crossFade?.duration ?? sceneTransition?.duration ??
          (this._defaultTransitionType ? this._defaultTransitionDuration : undefined);

        if (transitionDuration) {
          // トランジション分だけ早く開始
          startTime -= transitionDuration;
        }
      }

      sceneStartTimes.set(scene.key, startTime);

      // シーンのオーディオの startTime を絶対時間に変換
      const sceneAudios = scene.audios.map((audio) => ({
        ...audio,
        startTime: startTime + audio.startTime,
      }));

      // クロスフェードがある場合、テロップの開始時間をオフセット
      // （クロスフェード中にテロップが表示されないように）
      const telopOffset = transitionDuration ?? 0;
      const telops = scene.telops.map((telop) => ({
        ...telop,
        startTime: telop.startTime + telopOffset,
      }));

      // シーンのdurationにもオフセット分を加算
      const sceneDuration = scene.duration + telopOffset;

      scenesData.push({
        key: scene.key,
        file: scene.file,
        image: scene.image,
        backgroundColor: scene.backgroundColor,
        duration: sceneDuration,
        startTime,
        trimBefore: scene.trimBefore,
        effects: scene.effects,
        telops,
        wipes: scene.wipes,
        audios: sceneAudios,
        fixedElements: scene.fixedElements,
        bgmVolume: scene.bgmVolume,
        volume: scene.volume,
        loop: scene.loop,
        displayMode: scene.displayMode,
      });

      currentTime = startTime + sceneDuration;
    }

    // エンディングの時間
    if (this._ending) {
      currentTime += this._ending.duration;
    }

    // OpeningEnding インスタンスから OpeningEndingData に変換
    const openingData: OpeningEndingData | undefined = this._opening
      ? {
          duration: this._opening.duration,
          image: this._opening.image,
          effect: this._opening.effect,
          telops: this._opening.telops,
          displayMode: this._opening.displayMode,
        }
      : undefined;

    const endingData: OpeningEndingData | undefined = this._ending
      ? {
          duration: this._ending.duration,
          image: this._ending.image,
          effect: this._ending.effect,
          telops: this._ending.telops,
          displayMode: this._ending.displayMode,
        }
      : undefined;

    // シーンからのトランジションを収集してマージ
    const allCrossFades: CrossFadeData[] = [...this._crossFades];
    for (const scene of this._scenes) {
      for (const transition of scene.transitions) {
        // 重複チェック（同じシーン間のトランジションは上書きしない）
        const exists = allCrossFades.some(
          (cf) => cf.scene1Key === scene.key && cf.scene2Key === transition.toSceneKey
        );
        if (!exists) {
          allCrossFades.push({
            scene1Key: scene.key,
            scene2Key: transition.toSceneKey,
            duration: transition.duration,
            transition: transition.transition,
          });
        }
      }
    }

    // デフォルトトランジションを連続するシーン間に追加
    if (this._defaultTransitionType) {
      for (let i = 0; i < this._scenes.length - 1; i++) {
        const scene1 = this._scenes[i];
        const scene2 = this._scenes[i + 1];
        // 既に設定されていなければデフォルトを追加
        const exists = allCrossFades.some(
          (cf) => cf.scene1Key === scene1.key && cf.scene2Key === scene2.key
        );
        if (!exists) {
          allCrossFades.push({
            scene1Key: scene1.key,
            scene2Key: scene2.key,
            duration: this._defaultTransitionDuration,
            transition: this._defaultTransitionType,
          });
        }
      }
    }

    return {
      fps: this._fps,
      width: this._width,
      height: this._height,
      durationInFrames: Math.ceil(currentTime * this._fps),
      totalDuration: currentTime,
      opening: openingData,
      ending: endingData,
      scenes: scenesData,
      crossFades: allCrossFades,
      audios: this._audios,
      fixedElements: this._fixedElements,
      subtitles: this._subtitles,
    };
  }
}
