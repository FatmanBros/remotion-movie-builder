import React from "react";
import { Sequence, useVideoConfig, interpolate, Audio, staticFile } from "remotion";
import { AudioData, SceneData } from "../types";

// オーディオコンポーネント
export const AudioRenderer: React.FC<{
  audio: AudioData;
  totalDuration: number;
  scenes?: SceneData[];
  epilogue?: { startTime: number; duration: number };
}> = ({ audio, totalDuration, scenes, epilogue }) => {
  const { fps } = useVideoConfig();

  const startFrame = Math.round(fps * audio.startTime);
  const calculatedDuration = audio.duration
    ? Math.round(fps * audio.duration)
    : Math.round(fps * (totalDuration - audio.startTime));
  // durationが0以下の場合は1フレーム以上を保証
  const durationFrames = Math.max(1, calculatedDuration);

  const volumeFunction = (f: number) => {
    const fadeInFrames = fps * audio.fadeIn;
    const fadeOutFrames = fps * audio.fadeOut;

    let vol = audio.volume;

    if (audio.fadeIn > 0) {
      const fadeInProgress = interpolate(f, [0, fadeInFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      vol *= fadeInProgress;
    }

    if (audio.fadeOut > 0) {
      const fadeOutProgress = interpolate(
        f,
        [durationFrames - fadeOutFrames, durationFrames],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      vol *= fadeOutProgress;
    }

    // ダッキング
    if (audio.ducking !== undefined && scenes && scenes.length > 0) {
      const globalFrame = startFrame + f;
      const duckingTransition = fps * 4;
      const duckRatio = audio.ducking / audio.volume;

      const firstScene = scenes[0];
      const lastScene = scenes[scenes.length - 1];
      const duckStart = Math.round(fps * firstScene.startTime);
      const duckEnd = epilogue
        ? Math.round(fps * (epilogue.startTime + epilogue.duration))
        : Math.round(fps * (lastScene.startTime + lastScene.duration));

      if (globalFrame >= duckStart && globalFrame < duckEnd) {
        const fadeInDuck = interpolate(
          globalFrame,
          [duckStart, duckStart + duckingTransition],
          [1, duckRatio],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const fadeOutDuck = interpolate(
          globalFrame,
          [duckEnd - duckingTransition, duckEnd],
          [duckRatio, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        vol *= Math.min(fadeInDuck, fadeOutDuck);
      }
    }

    return vol;
  };

  return (
    <Sequence from={startFrame} durationInFrames={durationFrames}>
      <Audio
        src={staticFile(audio.file)}
        volume={volumeFunction}
        loop={audio.loop}
      />
    </Sequence>
  );
};
