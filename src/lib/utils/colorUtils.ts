/**
 * 色関連のユーティリティ関数
 */

/**
 * 色をRGB形式に変換
 * - "#ffffff" → "255,255,255"
 * - "#fff" → "255,255,255"
 * - "255,255,255" → "255,255,255"（そのまま）
 */
export const parseColorToRgb = (color: string): string => {
  // すでにRGB形式の場合はそのまま返す
  if (color.includes(",")) {
    return color;
  }

  // #hex形式の場合
  if (color.startsWith("#")) {
    let hex = color.slice(1);
    // 3桁の場合は6桁に展開
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `${r},${g},${b}`;
  }

  // それ以外はデフォルトで黒
  return "0,0,0";
};
