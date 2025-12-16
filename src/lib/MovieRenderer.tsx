import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { MovieData, TransitionType } from "./types";
import {
  SceneRenderer,
  AudioRenderer,
  OpeningEndingRenderer,
  FixedElementRenderer,
  SubtitleRenderer,
} from "./renderers";

type Props = {
  movieData: MovieData;
};

export const MovieRenderer: React.FC<Props> = ({ movieData }) => {
  const { fps } = useVideoConfig();
  const totalDurationFrames = Math.round(fps * movieData.totalDuration);

  // クロスフェード（入り）マップ - scene2Key で検索
  const crossFadeInMap = new Map<
    string,
    { duration: number; transition: TransitionType }
  >();
  // クロスフェード（出）マップ - scene1Key で検索
  const crossFadeOutMap = new Map<string, { duration: number }>();

  for (const cf of movieData.crossFades) {
    crossFadeInMap.set(cf.scene2Key, {
      duration: cf.duration,
      transition: cf.transition ?? "fade",
    });
    crossFadeOutMap.set(cf.scene1Key, {
      duration: cf.duration,
    });
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a2e" }}>
      {/* シーン */}
      {movieData.scenes.map((scene) => {
        const crossFadeInInfo = crossFadeInMap.get(scene.key);
        const crossFadeOutInfo = crossFadeOutMap.get(scene.key);
        return (
          <SceneRenderer
            key={scene.key}
            scene={scene}
            crossFadeInDuration={crossFadeInInfo?.duration}
            crossFadeOutDuration={crossFadeOutInfo?.duration}
            crossFadeTransition={crossFadeInInfo?.transition}
          />
        );
      })}

      {/* オープニング */}
      {movieData.opening && (
        <OpeningEndingRenderer
          type="opening"
          data={movieData.opening}
          startTime={0}
        />
      )}

      {/* エンディング */}
      {movieData.ending && (
        <OpeningEndingRenderer
          type="ending"
          data={movieData.ending}
          startTime={movieData.totalDuration - movieData.ending.duration}
        />
      )}

      {/* グローバルオーディオ（BGM等） */}
      {movieData.audios.map((audio, index) => (
        <AudioRenderer
          key={`global-audio-${index}`}
          audio={audio}
          totalDuration={movieData.totalDuration}
          scenes={audio.ducking !== undefined ? movieData.scenes : undefined}
          epilogue={
            audio.ducking !== undefined && movieData.ending
              ? {
                  startTime:
                    movieData.totalDuration - movieData.ending.duration,
                  duration: movieData.ending.duration,
                }
              : undefined
          }
        />
      ))}

      {/* シーンオーディオ */}
      {movieData.scenes.flatMap((scene) =>
        scene.audios.map((audio, index) => (
          <AudioRenderer
            key={`scene-audio-${scene.key}-${index}`}
            audio={audio}
            totalDuration={movieData.totalDuration}
          />
        ))
      )}

      {/* ムービー全体の固定要素 */}
      {movieData.fixedElements.length > 0 && (
        <Sequence from={0} durationInFrames={totalDurationFrames}>
          <FixedElementRenderer elements={movieData.fixedElements} />
        </Sequence>
      )}

      {/* SRT字幕 */}
      {movieData.subtitles && (
        <Sequence from={0} durationInFrames={totalDurationFrames}>
          <SubtitleRenderer subtitles={movieData.subtitles} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
