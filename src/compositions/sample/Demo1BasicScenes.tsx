import { Effects, Movie, rmbProps } from "../../lib";

/**
 * Demo1: 基本的なシーンとテロップの使い方
 * - 動画シーンの作成
 * - テロップの追加
 * - プロローグ/エピローグ
 */
const movie = () => {
  const movie = new Movie();

  // プロローグ: 背景画像でタイトル表示
  const prologue = movie.opening({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeOut,
  });
  prologue.telop("Remotion Movie Builder", { before: 0.3 });
  prologue.telop("基本的な使い方デモ");

  // シーン1: 動画ファイルを使用
  const scene1 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 0,
    volume: 0.3,
    effect: [Effects.fadeIn, Effects.fadeOut],
  });
  scene1
    .telop("動画シーンの作成")
    .telop("movie.scene() で動画を追加")
    .telop("trimBefore で開始位置を指定");

  // シーン2: 別の動画
  const scene2 = movie.scene("sample/movies/sample2.mp4", {
    trimBefore: 5,
    volume: 0.3,
    effect: [Effects.fadeIn, Effects.fadeOut],
  });
  scene2
    .telop("複数のテロップを連続追加")
    .telop("scene.telop() をチェーンで呼び出し");

  // エピローグ
  const ending = movie.ending({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeIn,
  });
  ending.telop("基本編おわり");

  return movie.build();
};

export const demo1MovieData = movie();

// Root.tsx で <RmbComposition {...demo1} /> として使用
export const demo1 = rmbProps(demo1MovieData);
