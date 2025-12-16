import { Effects, Movie, rmbProps, TelopColors, TelopPresets } from "../../lib";

/**
 * Demo13: SRT字幕の使い方
 * - SRT形式の文字列から字幕を追加
 * - シーンをまたいで動画全体に表示
 * - WhisperX形式の話者ID→名前変換
 * - 話者別スタイル（色分け）
 * - prefix/suffix でカスタム表示形式
 */

// WhisperX形式のSRT字幕データ（SPEAKER_00, SPEAKER_01）
const srtContent = `1
00:00:00,500 --> 00:00:03,000
SRT字幕のデモです

2
00:00:03,500 --> 00:00:06,500
[SPEAKER_00] こんにちは、田中です

3
00:00:07,000 --> 00:00:10,000
[SPEAKER_01] 山田です、よろしくお願いします

4
00:00:10,500 --> 00:00:13,500
[SPEAKER_00] 話者ごとに色を変えられます

5
00:00:14,000 --> 00:00:17,000
[SPEAKER_01] prefix/suffix で表示形式も
カスタマイズできます

6
00:00:17,500 --> 00:00:20,500
シーンをまたいで字幕が表示されます
`;

const movie = () => {
  const movie = new Movie();

  // SRT字幕を追加（WhisperX形式対応）
  movie.subtitle(srtContent, {
    position: "bottom 8%",
    fontSize: 38,
    effects: TelopPresets.simple,
    color: {
      text: "#ffffff",
      shadow: "2px 2px 8px rgba(0,0,0,0.9)",
    },
    // 話者ID→名前変換 & スタイル設定を一箇所で
    speakers: {
      "SPEAKER_00": {
        name: "田中",
        color: TelopColors.blueOutline,
      },
      "SPEAKER_01": {
        name: "山田",
        color: TelopColors.redOutline,
      },
    },
    // 話者名付きの表示形式
    prefix: "{{$speaker}}「",
    suffix: "」",
  });

  // オープニング
  const opening = movie.opening({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeOut,
  });
  opening.telop("SRT字幕デモ", { position: "center" });

  // シーン1
  const scene1 = movie.scene("sample/movies/sample1.mp4", {
    duration: 7,
    trimBefore: 0,
    volume: 0,
    effect: [Effects.fadeIn],
  });

  // シーン2（字幕はシーンをまたいで表示される）
  const scene2 = movie.scene("sample/movies/sample2.mp4", {
    duration: 7,
    trimBefore: 5,
    volume: 0,
  });

  // シーン3
  const scene3 = movie.scene("sample/movies/sample1.mp4", {
    duration: 7,
    trimBefore: 10,
    volume: 0,
    effect: [Effects.fadeOut],
  });

  // エンディング
  const ending = movie.ending({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeIn,
  });
  ending.telop("字幕デモ終了", { position: "center" });

  return movie.build();
};

export const demo13MovieData = movie();

export const demo13 = rmbProps(demo13MovieData);
