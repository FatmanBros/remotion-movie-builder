import React from "react";
import { Composition } from "remotion";
import { MovieData } from "./types";
import { MovieRenderer } from "./MovieRenderer";

export type RmbCompositionProps = {
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

/** rmbProps の戻り値型（idなし） */
export type RmbProps = Omit<RmbCompositionProps, "id">;

/**
 * MovieDataからRmbComposition用のpropsを作成
 *
 * @example
 * // Demo file
 * export const demo1 = rmbProps(movieData);
 *
 * // Root.tsx
 * <RmbComposition id="Demo1" {...demo1} />
 */
export const rmbProps = (movieData: MovieData): RmbProps => {
  const Component: React.FC = () => <MovieRenderer movieData={movieData} />;
  return {
    component: Component,
    movieData,
  };
};
