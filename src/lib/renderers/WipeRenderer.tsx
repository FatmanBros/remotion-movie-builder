import React from "react";
import { Sequence, useVideoConfig, staticFile, OffthreadVideo } from "remotion";
import { WipeData } from "../types";

// クロマキー用SVGフィルター
const ChromaKeyFilter: React.FC<{
  id: string;
  color: string;
  similarity: number;
  smoothness: number;
}> = ({ id, color, similarity, smoothness }) => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 0, g: 1, b: 0 };
  };

  const rgb = hexToRgb(color);
  const tolerance = similarity * 0.5;
  const smooth = smoothness * 0.3;

  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values={`
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              ${rgb.r > 0.5 ? -1 : 0} ${rgb.g > 0.5 ? -1 : 0} ${rgb.b > 0.5 ? -1 : 0} ${1 + tolerance} ${-smooth}
            `}
          />
        </filter>
      </defs>
    </svg>
  );
};

// ワイプコンポーネント
export const WipeRenderer: React.FC<{
  wipe: WipeData;
  sceneDuration: number;
  index: number;
}> = ({ wipe, sceneDuration, index }) => {
  const { fps, width, height } = useVideoConfig();

  const startFrame = Math.round(fps * wipe.startTime);
  const calculatedDuration = wipe.duration
    ? Math.round(fps * wipe.duration)
    : Math.round(fps * (sceneDuration - wipe.startTime));
  // durationが0以下の場合は1フレーム以上を保証
  const durationFrames = Math.max(1, calculatedDuration);
  const trimBeforeFrames = Math.round(fps * wipe.trimBefore);

  const wipeWidth = width * wipe.size;
  const wipeHeight = height * wipe.size;
  const positionStyle: React.CSSProperties = {
    position: "absolute",
    width: wipeWidth,
    height: wipeHeight,
    borderRadius: wipe.chromaKey ? 0 : wipe.borderRadius,
    overflow: "hidden",
    boxShadow: wipe.chromaKey ? "none" : "0 4px 20px rgba(0,0,0,0.3)",
  };

  switch (wipe.position) {
    case "top-left":
      positionStyle.top = wipe.margin;
      positionStyle.left = wipe.margin;
      break;
    case "top-right":
      positionStyle.top = wipe.margin;
      positionStyle.right = wipe.margin;
      break;
    case "bottom-left":
      positionStyle.bottom = wipe.margin;
      positionStyle.left = wipe.margin;
      break;
    case "bottom-right":
    default:
      positionStyle.bottom = wipe.margin;
      positionStyle.right = wipe.margin;
      break;
  }

  const filterId = `chromakey-${index}`;
  const videoStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    ...(wipe.chromaKey && { filter: `url(#${filterId})` }),
  };

  return (
    <Sequence from={startFrame} durationInFrames={durationFrames}>
      {wipe.chromaKey && (
        <ChromaKeyFilter
          id={filterId}
          color={wipe.chromaKey.color}
          similarity={wipe.chromaKey.similarity}
          smoothness={wipe.chromaKey.smoothness}
        />
      )}
      <div style={positionStyle}>
        <OffthreadVideo
          src={staticFile(wipe.file)}
          trimBefore={trimBeforeFrames}
          volume={wipe.volume}
          style={videoStyle}
        />
      </div>
    </Sequence>
  );
};
