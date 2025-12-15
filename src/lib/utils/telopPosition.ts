/**
 * テロップ位置関連のユーティリティ
 */

import { TelopData } from "../types";

// パース済みのテロップ位置
export type ParsedTelopPosition = {
  anchor: "top" | "bottom" | "center";
  offset: string; // "120px" | "20%" など
};

/**
 * テロップ位置をパース
 * "bottom" | "top" | "center" | "bottom 20%" | "top 15%" | "20%" | "80px"
 */
export const parseTelopPosition = (position: string): ParsedTelopPosition => {
  const defaultOffset = "120px";

  // 基本プリセット
  if (position === "bottom") {
    return { anchor: "bottom", offset: defaultOffset };
  }
  if (position === "top") {
    return { anchor: "top", offset: defaultOffset };
  }
  if (position === "center") {
    return { anchor: "center", offset: "0px" };
  }

  // 複合パターン: "bottom 20%" や "top 15%"
  const parts = position.split(/\s+/);
  let anchor: "top" | "bottom" | "center" = "bottom";
  let offset = defaultOffset;

  for (const part of parts) {
    if (part === "top" || part === "bottom" || part === "center") {
      anchor = part;
    } else if (part.match(/^\d+(\.\d+)?(%|px)$/)) {
      offset = part;
    }
  }

  return { anchor, offset };
};

/**
 * テロップの推定高さを計算（横幅と文字サイズから折り返し回数を計算）
 */
export const estimateTelopHeight = (text: string, containerWidth: number): number => {
  const fontSize = 48; // テロップの文字サイズ（px）
  const padding = 40 * 2; // 左右のパディング
  const lineHeight = fontSize * 1.4; // 行の高さ（文字サイズの1.4倍）
  const charWidth = fontSize; // 日本語はほぼ正方形

  const availableWidth = containerWidth - padding;
  const charsPerLine = Math.floor(availableWidth / charWidth);
  const lines = Math.ceil(text.length / charsPerLine);

  return lines * lineHeight;
};

/**
 * 同時に表示されるテロップの累積オフセットを計算
 */
export const calculateStackOffset = (
  telop: TelopData,
  allTelops: TelopData[],
  currentFrame: number,
  fps: number,
  containerWidth: number
): number => {
  const telopStart = telop.startTime * fps;
  const telopEnd = (telop.startTime + telop.duration) * fps;

  if (currentFrame < telopStart || currentFrame >= telopEnd) {
    return 0;
  }

  const visibleTelops = allTelops
    .filter((t) => {
      const start = t.startTime * fps;
      const end = (t.startTime + t.duration) * fps;
      return currentFrame >= start && currentFrame < end;
    })
    .sort((a, b) => a.startTime - b.startTime);

  const telopIndex = visibleTelops.findIndex((t) => t === telop);
  if (telopIndex <= 0) return 0;

  // 自分より前のテロップの高さを累積
  let offset = 0;
  for (let i = 0; i < telopIndex; i++) {
    offset += estimateTelopHeight(visibleTelops[i].text, containerWidth);
  }
  return offset;
};

/**
 * パース済み位置からCSSスタイルを生成
 */
export const getTelopPositionStyle = (
  parsed: ParsedTelopPosition,
  stackOffset: number
): React.CSSProperties => {
  const { anchor, offset } = parsed;
  const isPercent = offset.endsWith("%");
  const offsetValue = parseFloat(offset);

  if (anchor === "top") {
    if (isPercent) {
      return {
        top: `calc(${offset} + ${stackOffset}px)`,
        bottom: "auto",
      };
    }
    return { top: offsetValue + stackOffset, bottom: "auto" };
  }

  if (anchor === "center") {
    return {
      top: "50%",
      bottom: "auto",
      transform: `translateY(calc(-50% + ${stackOffset}px))`,
    };
  }

  // bottom（デフォルト）
  if (isPercent) {
    return {
      bottom: `calc(${offset} + ${stackOffset}px)`,
      top: "auto",
    };
  }
  return { bottom: offsetValue + stackOffset, top: "auto" };
};
