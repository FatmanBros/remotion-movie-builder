import React from "react";
import { DisplayMode, DisplayModeObject } from "../types";

// 映画風アスペクト比のプリセット値
export const CINEMATIC_RATIOS: Record<string, number> = {
  vista: 1.85,        // ヴィスタサイズ
  cinemascope: 2.35,  // シネマスコープ
  european: 1.66,     // ヨーロピアンヴィスタ
  imax: 1.43,         // IMAX
};

// パース済みの表示モード設定
export type ParsedDisplayMode = {
  type: "basic" | "cinematic" | "split";
  // basic用
  basicMode?: "cover" | "contain" | "fitWidth" | "fitHeight";
  // cinematic/split用
  heightRatio?: number;    // 高さの比率 (0-1)
  widthRatio?: number;     // 幅の比率 (0-1)
  position?: "center" | "top" | "bottom";
  aspectRatio?: number;    // アスペクト比 (width/height)
};

// 分数文字列をパース ("2/3" -> 0.666...)
export const parseFraction = (str: string): number | null => {
  const fractionMatch = str.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const [, num, denom] = fractionMatch;
    return parseInt(num) / parseInt(denom);
  }
  const percentMatch = str.match(/^(\d+(?:\.\d+)?)%$/);
  if (percentMatch) {
    return parseFloat(percentMatch[1]) / 100;
  }
  return null;
};

// displayModeをパースして統一形式に変換
export const parseDisplayMode = (displayMode: DisplayMode = "cover"): ParsedDisplayMode => {
  // オブジェクト形式
  if (typeof displayMode === "object") {
    const obj = displayMode as DisplayModeObject;
    let aspectRatio: number | undefined;
    if (obj.aspectRatio) {
      const ratioMatch = obj.aspectRatio.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
      if (ratioMatch) {
        aspectRatio = parseFloat(ratioMatch[1]) / parseFloat(ratioMatch[2]);
      } else {
        aspectRatio = parseFloat(obj.aspectRatio);
      }
    }
    return {
      type: "split",
      heightRatio: obj.height ? parseFraction(obj.height) ?? 1 : 1,
      widthRatio: obj.width ? parseFraction(obj.width) ?? 1 : 1,
      position: obj.position ?? "center",
      aspectRatio,
    };
  }

  // 文字列形式
  const mode = displayMode as string;

  // 基本モード
  if (["cover", "contain", "fitWidth", "fitHeight"].includes(mode)) {
    return { type: "basic", basicMode: mode as ParsedDisplayMode["basicMode"] };
  }

  // 映画風プリセット
  // 16:9 (1.78:1) 画面で指定アスペクト比を表示するための高さ/幅を計算
  if (mode in CINEMATIC_RATIOS) {
    const targetRatio = CINEMATIC_RATIOS[mode];
    const screenRatio = 16 / 9; // 1.78

    if (targetRatio > screenRatio) {
      // 目標が横長（例: cinemascope 2.35:1）→ 高さを狭める、上下に黒帯
      const heightRatio = screenRatio / targetRatio;
      return {
        type: "cinematic",
        heightRatio,
        widthRatio: 1,
        position: "center",
      };
    } else {
      // 目標が縦長（例: imax 1.43:1）→ 幅を狭める、左右に黒帯
      const widthRatio = targetRatio / screenRatio;
      return {
        type: "cinematic",
        heightRatio: 1,
        widthRatio,
        position: "center",
      };
    }
  }

  // 分割表示パターンをパース
  // "2/3" - 高さ2/3、中央配置
  // "1/3 80%" - 高さ1/3、幅80%、中央配置
  // "2/3 top" - 高さ2/3、上寄せ
  // "2/3 bottom" - 高さ2/3、下寄せ
  const parts = mode.split(/\s+/);
  let heightRatio = 1;
  let widthRatio = 1;
  let position: "center" | "top" | "bottom" = "center";

  for (const part of parts) {
    if (part === "top" || part === "bottom" || part === "center") {
      position = part;
    } else {
      const ratio = parseFraction(part);
      if (ratio !== null) {
        // 最初の数値は高さ、2番目は幅
        if (heightRatio === 1) {
          heightRatio = ratio;
        } else {
          widthRatio = ratio;
        }
      }
    }
  }

  return {
    type: "split",
    heightRatio,
    widthRatio,
    position,
  };
};

// 表示モードに基づいたコンテナスタイルを取得
export const getDisplayModeContainerStyle = (
  parsed: ParsedDisplayMode,
  backgroundColor?: string
): React.CSSProperties => {
  if (parsed.type === "basic") {
    return {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
  }

  // cinematic または split
  let alignItems: "center" | "flex-start" | "flex-end" = "center";
  if (parsed.position === "top") alignItems = "flex-start";
  if (parsed.position === "bottom") alignItems = "flex-end";

  return {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems,
    backgroundColor: backgroundColor ?? "#000000",
  };
};

// 表示モードに基づいたメディアスタイルを取得
export const getDisplayModeMediaStyle = (
  parsed: ParsedDisplayMode,
  defaultMode: "cover" | "contain" = "cover"
): React.CSSProperties => {
  if (parsed.type === "basic") {
    switch (parsed.basicMode) {
      case "contain":
        return {
          width: "100%",
          height: "100%",
          objectFit: "contain",
        };
      case "fitWidth":
        return {
          width: "100%",
          height: "auto",
          objectFit: "contain",
        };
      case "fitHeight":
        return {
          width: "auto",
          height: "100%",
          objectFit: "contain",
        };
      case "cover":
      default:
        if (defaultMode === "contain") {
          return {
            width: "100%",
            height: "100%",
            objectFit: "contain",
          };
        }
        return {
          height: `${100 / 0.9}%`,
          objectFit: "cover",
        };
    }
  }

  // cinematic または split
  const heightPercent = (parsed.heightRatio ?? 1) * 100;
  const widthPercent = (parsed.widthRatio ?? 1) * 100;

  // 分割表示・映画風（高さ/幅の比率指定）
  return {
    width: `${widthPercent}%`,
    height: `${heightPercent}%`,
    objectFit: "cover" as const,
  };
};
