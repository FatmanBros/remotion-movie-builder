import React from "react";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import { RmbComposition } from "./lib";
import { ShortsVideoWithMovieClass, movieData } from "./compositions/local/ShortsVideoWithMovieClass";
import {
  Demo1BasicScenes,
  demo1MovieData,
  Demo2ImageScenes,
  demo2MovieData,
  Demo3TelopEffects,
  demo3MovieData,
  Demo4Transitions,
  demo4MovieData,
  Demo5Wipe,
  demo5MovieData,
  Demo6BatchTelop,
  demo6MovieData,
  Demo7TelopColors,
  demo7MovieData,
  Demo8Overlay,
  demo8MovieData,
  Demo9FixedElements,
  demo9MovieData,
  Demo10DisplayModes,
  demo10MovieData,
} from "./compositions/sample";

// Noto Sans JP フォントをロード
loadFont();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <RmbComposition id="ShortsVideoWithMovieClass" component={ShortsVideoWithMovieClass} movieData={movieData} />

      {/* サンプルデモ動画 */}
      <RmbComposition id="Demo1BasicScenes" component={Demo1BasicScenes} movieData={demo1MovieData} />
      <RmbComposition id="Demo2ImageScenes" component={Demo2ImageScenes} movieData={demo2MovieData} />
      <RmbComposition id="Demo3TelopEffects" component={Demo3TelopEffects} movieData={demo3MovieData} />
      <RmbComposition id="Demo4Transitions" component={Demo4Transitions} movieData={demo4MovieData} />
      <RmbComposition id="Demo5Wipe" component={Demo5Wipe} movieData={demo5MovieData} />
      <RmbComposition id="Demo6BatchTelop" component={Demo6BatchTelop} movieData={demo6MovieData} />
      <RmbComposition id="Demo7TelopColors" component={Demo7TelopColors} movieData={demo7MovieData} />
      <RmbComposition id="Demo8Overlay" component={Demo8Overlay} movieData={demo8MovieData} />
      <RmbComposition id="Demo9FixedElements" component={Demo9FixedElements} movieData={demo9MovieData} />
      <RmbComposition id="Demo10DisplayModes" component={Demo10DisplayModes} movieData={demo10MovieData} />
    </>
  );
};
