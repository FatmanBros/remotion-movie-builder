import React from "react";
import { Composition } from "remotion";
import { MovieData } from "./types";

type RmbCompositionProps = {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  movieData: MovieData;
};

/**
 * MovieDataを使って自動的にCompositionを設定するラッパー
 * fps, width, height, durationInFrames を movieData から取得
 */
export const RmbComposition: React.FC<RmbCompositionProps> = ({
  id,
  component,
  movieData,
}) => {
  return (
    <Composition
      id={id}
      component={component}
      durationInFrames={movieData.durationInFrames}
      fps={movieData.fps}
      width={movieData.width}
      height={movieData.height}
    />
  );
};
