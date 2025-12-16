import { Effects, Movie, rmbProps, TelopPresets } from "../../lib";

/**
 * Demo11: オーディオ機能のデモ
 * - BGM（ダッキング付き）
 * - グローバルオーディオ
 * - シーン内オーディオ
 * - テロップSFX
 */
const movie = () => {
  const movie = new Movie();

  // オープニング: サンプル音声の配置場所を案内
  const opening = movie.opening({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeOut,
    telop: { overlay: { color: "0,0,0" } },
  });
  opening
    .telop("オーディオ機能デモ")
    .telop(["※サンプル音声は無いため、配置してください。", "sample/audio/bgm.mp3", "sample/audio/sfx.mp3"], [1.1,1,1])
    ;

  // BGM設定（サンプルファイルがある場合のみ再生される）
  // movie.bgm("sample/audio/bgm.mp3", {
  //   volume: 0.5,
  //   fadeIn: 2,
  //   fadeOut: 2,
  //   ducking: 0.1,
  // });

  // シーン1: BGMの説明
  const scene1 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 0,
    volume: 0.3,
    effect: [Effects.fadeIn, Effects.fadeOut],
  });
  scene1
    .telop("movie.bgm() でBGMを追加")
    .telop("シーン中は自動でダッキング")
    .telop("ducking: 0.1 で音量を10%に");

  // シーン2: グローバルオーディオの説明
  const scene2 = movie.scene("sample/movies/sample2.mp4", {
    trimBefore: 5,
    volume: 0.3,
    effect: [Effects.fadeIn, Effects.fadeOut],
  });
  scene2
    .telop("movie.audio() でグローバル音声")
    .telop("動画全体で再生されます")
    .telop("loop: true でループ再生");

  // シーン3: シーン内オーディオの説明
  const scene3 = movie.scene("sample/movies/sample3.mp4", {
    trimBefore: 0,
    volume: 0.3,
    effect: [Effects.fadeIn, Effects.fadeOut],
  });
  scene3
    .telop("scene.audio() でシーン内音声")
    .telop("そのシーンだけで再生")
    .telop("fadeIn/fadeOut でフェード");

  // シーン4: テロップSFXの説明
  const scene4 = movie.scene("sample/movies/sample4.mp4", {
    trimBefore: 0,
    volume: 0.3,
    effect: [Effects.fadeIn, Effects.fadeOut],
  });
  scene4
    .telop("テロップにSFXを追加", {
      // sfx: "sample/audio/sfx.mp3",  // サンプルファイルがある場合
    })
    .telop("sfx オプションで効果音")
    .telop("テロップ表示時に再生");

  // エンディング
  const ending = movie.ending({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeIn,
  });
  ending.telop("オーディオ機能デモ終了");

  return movie.build();
};

export const demo11MovieData = movie();

// Root.tsx で <RmbComposition {...demo11} /> として使用
export const demo11 = rmbProps(demo11MovieData);
