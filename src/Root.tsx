import React from "react";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import { RmbComposition, rmbProps } from "./lib";
import { movieData } from "./compositions/local/ShortsVideoWithMovieClass";
import {
  demo1,
  demo2,
  demo3,
  demo4,
  demo5,
  demo6,
  demo7,
  demo8,
  demo9,
  demo10,
} from "./compositions/sample";

// Noto Sans JP フォントをロード
loadFont();

// ShortsVideoWithMovieClass用
const shortsVideo = rmbProps(movieData);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <RmbComposition id="short" {...shortsVideo} />

      {/* サンプルデモ動画 */}
      <RmbComposition id="demo1" {...demo1} />
      <RmbComposition id="demo2" {...demo2} />
      <RmbComposition id="demo3" {...demo3} />
      <RmbComposition id="demo4" {...demo4} />
      <RmbComposition id="demo5" {...demo5} />
      <RmbComposition id="demo6" {...demo6} />
      <RmbComposition id="demo7" {...demo7} />
      <RmbComposition id="demo8" {...demo8} />
      <RmbComposition id="demo9" {...demo9} />
      <RmbComposition id="demo10" {...demo10} />
    </>
  );
};
