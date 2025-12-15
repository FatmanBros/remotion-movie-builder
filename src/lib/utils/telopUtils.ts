/**
 * テロップ関連のユーティリティ関数
 */

/**
 * 文字数からテロップのdurationを計算
 * - 基本: 0.2秒/文字
 * - 10文字増える毎に0.01秒短縮（最小0.15秒/文字）
 * - 1バイト文字（英数字など）は0.5倍の時間
 * - 最低2秒、エフェクト用に+1秒
 */
export function calculateTelopDuration(text: string): number {
  const effectTime = 1; // エフェクト用の余白

  // 全角・半角を分けてカウント
  let fullWidthCount = 0;
  let halfWidthCount = 0;

  for (const char of text) {
    // 1バイト文字（ASCII 0-127）かどうか
    if (char.charCodeAt(0) <= 127) {
      halfWidthCount++;
    } else {
      fullWidthCount++;
    }
  }

  // 文字数に基づいて1文字あたりの時間を計算
  // 基本: 0.2秒/文字、10文字毎に0.01秒短縮、最小0.15秒
  const totalChars = fullWidthCount + halfWidthCount;
  const reduction = Math.floor(totalChars / 10) * 0.01;
  const timePerChar = Math.max(0.15, 0.2 - reduction);

  // 全角文字は基本時間、半角文字は0.5倍
  const readingTime = fullWidthCount * timePerChar + halfWidthCount * timePerChar * 0.5;

  return Math.max(2, readingTime + effectTime);
}

/**
 * SFXオプションをノーマライズ
 * string形式を { file, volume } 形式に変換
 */
export function normalizeSfx(
  sfx: string | { file: string; volume?: number } | undefined
): { file: string; volume: number } | undefined {
  if (!sfx) return undefined;
  if (typeof sfx === "string") {
    return { file: sfx, volume: 1 };
  }
  return { file: sfx.file, volume: sfx.volume ?? 1 };
}
