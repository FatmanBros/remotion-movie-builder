import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { TransitionType } from "../lib/types";

type Props = {
  progress: number; // 0-1
  transition: TransitionType;
  gridSize?: number; // グリッドの分割数（デフォルト: 8）
  children: React.ReactNode;
};

// グリッドセルのスタイルを計算
const calculateCellStyle = (
  progress: number,
  transition: TransitionType,
  row: number,
  col: number,
  totalRows: number,
  totalCols: number
): React.CSSProperties => {
  // セルごとの遅延を計算（0-0.5の範囲）
  let delay = 0;

  switch (transition) {
    case "gridFlipLeft":
      // 左から右へ（列ベース）
      delay = (col / totalCols) * 0.5;
      break;
    case "gridFlipRight":
      // 右から左へ
      delay = ((totalCols - 1 - col) / totalCols) * 0.5;
      break;
    case "gridFlipUp":
      // 上から下へ（行ベース）
      delay = (row / totalRows) * 0.5;
      break;
    case "gridFlipDown":
      // 下から上へ
      delay = ((totalRows - 1 - row) / totalRows) * 0.5;
      break;
    case "gridShrink":
      // 中心から外側へ
      const centerRow = (totalRows - 1) / 2;
      const centerCol = (totalCols - 1) / 2;
      const distance = Math.sqrt(
        Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
      );
      const maxDistance = Math.sqrt(
        Math.pow(centerRow, 2) + Math.pow(centerCol, 2)
      );
      delay = (distance / maxDistance) * 0.5;
      break;
    case "gridRandom":
      // 擬似ランダム（決定論的）
      delay = ((row * 7 + col * 13) % (totalRows * totalCols)) / (totalRows * totalCols) * 0.6;
      break;
    default:
      delay = 0;
  }

  // 遅延を考慮した進行度
  const adjustedProgress = interpolate(
    progress,
    [delay, delay + 0.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 回転と縮小のアニメーション
  const rotateX = transition.includes("Up") || transition.includes("Down")
    ? interpolate(adjustedProgress, [0, 1], [0, 90])
    : 0;
  const rotateY = transition.includes("Left") || transition.includes("Right")
    ? interpolate(adjustedProgress, [0, 1], [0, 90])
    : 0;

  const scale = transition === "gridShrink" || transition === "gridRandom"
    ? interpolate(adjustedProgress, [0, 1], [1, 0])
    : interpolate(adjustedProgress, [0, 0.5, 1], [1, 0.8, 0]);

  const opacity = interpolate(
    adjustedProgress,
    [0, 0.7, 1],
    [1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  return {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
    opacity,
    transformOrigin: getTransformOrigin(transition, row, col, totalRows, totalCols),
    backfaceVisibility: "hidden" as const,
  };
};

// 回転の基点を取得
const getTransformOrigin = (
  transition: TransitionType,
  row: number,
  col: number,
  totalRows: number,
  totalCols: number
): string => {
  switch (transition) {
    case "gridFlipLeft":
      return "left center";
    case "gridFlipRight":
      return "right center";
    case "gridFlipUp":
      return "center top";
    case "gridFlipDown":
      return "center bottom";
    case "gridShrink":
    case "gridRandom":
    default:
      return "center center";
  }
};

// グリッドトランジションかどうかを判定
export const isGridTransition = (transition: TransitionType): boolean => {
  return transition.startsWith("grid");
};

export const GridTransition: React.FC<Props> = ({
  progress,
  transition,
  gridSize = 8,
  children,
}) => {
  const rows = gridSize;
  const cols = gridSize;
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;

  // 新しいシーンが見えるようになる進行度（グリッドの透明度が上がるにつれて）
  const newSceneOpacity = interpolate(progress, [0, 0.5, 1], [0, 0.5, 1]);

  return (
    <AbsoluteFill>
      {/* グリッドセル */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          zIndex: 1,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const cellStyle = calculateCellStyle(
            progress,
            transition,
            row,
            col,
            rows,
            cols
          );

          return (
            <div
              key={index}
              style={{
                position: "relative",
                overflow: "hidden",
                ...cellStyle,
              }}
            >
              {/* セル内のコンテンツ（クリップ） */}
              <div
                style={{
                  position: "absolute",
                  width: `${cols * 100}%`,
                  height: `${rows * 100}%`,
                  left: `${-col * 100}%`,
                  top: `${-row * 100}%`,
                }}
              >
                {children}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
