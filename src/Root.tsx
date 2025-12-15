import { Composition, staticFile } from "remotion";
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

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShortsVideoWithMovieClass"
        component={ShortsVideoWithMovieClass}
        durationInFrames={Math.ceil(movieData.totalDuration * FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />

      {/* サンプルデモ動画 */}
      <Composition
        id="Demo1BasicScenes"
        component={Demo1BasicScenes}
        durationInFrames={Math.ceil(demo1MovieData.totalDuration * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo2ImageScenes"
        component={Demo2ImageScenes}
        durationInFrames={Math.ceil(demo2MovieData.totalDuration * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo3TelopEffects"
        component={Demo3TelopEffects}
        durationInFrames={Math.ceil(demo3MovieData.totalDuration * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo4Transitions"
        component={Demo4Transitions}
        durationInFrames={Math.ceil(demo4MovieData.totalDuration * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo5Wipe"
        component={Demo5Wipe}
        durationInFrames={Math.ceil(demo5MovieData.totalDuration * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo6BatchTelop"
        component={Demo6BatchTelop}
        durationInFrames={Math.ceil(demo6MovieData.totalDuration * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo7TelopColors"
        component={Demo7TelopColors}
        durationInFrames={Math.ceil(demo7MovieData.totalDuration * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo8Overlay"
        component={Demo8Overlay}
        durationInFrames={Math.ceil(demo8MovieData.totalDuration * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo9FixedElements"
        component={Demo9FixedElements}
        durationInFrames={Math.ceil(demo9MovieData.totalDuration * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo10DisplayModes"
        component={Demo10DisplayModes}
        durationInFrames={Math.ceil(demo10MovieData.totalDuration * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
