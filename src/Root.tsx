import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import React from "react";
import {
  demo1,
  demo10,
  demo11,
  demo12,
  demo2,
  demo3,
  demo4,
  demo5,
  demo6,
  demo7,
  demo8,
  demo9,
} from "./compositions/sample";
import { RmbComposition } from "./lib";

// Noto Sans JP フォントをロード
loadFont();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* <RmbComposition id="short" {...movie} /> */}

      {/* サンプルデモ動画 */}
      <RmbComposition id="Demo1-BasicScenes" {...demo1} />
      <RmbComposition id="Demo2-ImageScenes" {...demo2} />
      <RmbComposition id="Demo3-TelopEffects" {...demo3} />
      <RmbComposition id="Demo4-Transitions" {...demo4} />
      <RmbComposition id="Demo5-Wipe" {...demo5} />
      <RmbComposition id="Demo6-BatchTelop" {...demo6} />
      <RmbComposition id="Demo7-TelopColors" {...demo7} />
      <RmbComposition id="Demo8-Overlay" {...demo8} />
      <RmbComposition id="Demo9-FixedElements" {...demo9} />
      <RmbComposition id="Demo10-DisplayModes" {...demo10} />
      <RmbComposition id="Demo11-Audio" {...demo11} />
      <RmbComposition id="Demo12-FontSize" {...demo12} />
    </>
  );
};
