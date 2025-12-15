import React from "react";

type ShadowOptions = {
  color?: string;    // RGB形式: "0,0,0"
  opacity?: number;  // 0-1
  blur?: number;     // ぼかしサイズ（px）
};

type Props = {
  text: string;
  fontSize?: number;
  fillColor?: string;      // 文字色
  innerStroke?: string;    // 内側縁取り色
  innerStrokeWidth?: number;
  outerStroke?: string;    // 外側縁取り色
  outerStrokeWidth?: number;
  fontFamily?: string;
  shadow?: ShadowOptions;  // ぼかしシャドー
};

/**
 * TV字幕風の二重縁取りテキスト
 * SVGで複数のtext要素を重ねて実現
 */
export const DoubleStrokeText: React.FC<Props> = ({
  text,
  fontSize = 48,
  fillColor = "#ffdd00",
  innerStroke = "#ffffff",
  innerStrokeWidth = 8,
  outerStroke = "#000000",
  outerStrokeWidth = 16,
  fontFamily = '"Noto Sans JP", sans-serif',
  shadow,
}) => {
  const height = fontSize * 1.2;
  const filterId = `shadow-${Math.random().toString(36).substr(2, 9)}`;

  const shadowColor = shadow?.color ?? "0,0,0";
  const shadowOpacity = shadow?.opacity ?? 0.7;
  const shadowBlur = shadow?.blur ?? 16;

  return (
    <svg
      width="100%"
      height={height}
      style={{ overflow: "visible", display: "block", verticalAlign: "middle" }}
    >
      {/* シャドー用フィルター */}
      {shadow && (
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={shadowBlur / 2} />
          </filter>
        </defs>
      )}

      {/* シャドーレイヤー（ぼかし） */}
      {shadow && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          filter={`url(#${filterId})`}
          style={{
            fontSize,
            fontFamily,
            fontWeight: "bold",
            fill: `rgba(${shadowColor}, ${shadowOpacity})`,
            stroke: `rgba(${shadowColor}, ${shadowOpacity})`,
            strokeWidth: outerStrokeWidth + 4,
            strokeLinejoin: "round",
            strokeLinecap: "round",
          }}
        >
          {text}
        </text>
      )}

      {/* 外側の縁取り（黒） - 最背面 */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        style={{
          fontSize,
          fontFamily,
          fontWeight: "bold",
          fill: "none",
          stroke: outerStroke,
          strokeWidth: outerStrokeWidth,
          strokeLinejoin: "round",
          strokeLinecap: "round",
        }}
      >
        {text}
      </text>

      {/* 内側の縁取り（白） - 中間 */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        style={{
          fontSize,
          fontFamily,
          fontWeight: "bold",
          fill: "none",
          stroke: innerStroke,
          strokeWidth: innerStrokeWidth,
          strokeLinejoin: "round",
          strokeLinecap: "round",
        }}
      >
        {text}
      </text>

      {/* 文字色（fill） - 最前面 */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        style={{
          fontSize,
          fontFamily,
          fontWeight: "bold",
          fill: fillColor,
          stroke: "none",
        }}
      >
        {text}
      </text>
    </svg>
  );
};
