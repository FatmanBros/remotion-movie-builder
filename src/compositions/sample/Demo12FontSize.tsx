import { Effects, Movie, rmbProps, TelopColors } from "../../lib";

/**
 * Demo12: フォントサイズの設定
 * - Movie全体のデフォルトフォントサイズ
 * - シーン単位のフォントサイズ
 * - Opening/Endingのフォントサイズ
 * - 個別テロップのフォントサイズ
 * - 優先順位のデモ
 */
const movie = () => {
  // Movie全体のデフォルトフォントサイズを64に設定
  const movie = new Movie({
    fontSize: 64,
    overlay: { color: "0,0,0" },
  });

  // オープニング: fontSize: 72 を指定
  const opening = movie.opening({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeOut,
    fontSize: 72,
  });
  opening.telop("フォントサイズ デモ", { before: 0.3 });
  opening.telop("Opening fontSize: 72");

  // シーン1: Movieのデフォルト fontSize: 64 を使用
  const scene1 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 0,
    volume: 0.3,
    effect: [Effects.fadeIn, Effects.fadeOut],
  });
  scene1
    .telop("Movieデフォルト fontSize: 64")
    .telop("シーンで指定しない場合")
    .telop("Movieの設定が適用される");

  // シーン2: シーン単位で fontSize: 48 を指定
  const scene2 = movie.scene("sample/movies/sample2.mp4", {
    trimBefore: 5,
    volume: 0.3,
    effect: [Effects.fadeIn, Effects.fadeOut],
    fontSize: 48,
  });
  scene2
    .telop("シーン fontSize: 48")
    .telop("シーン単位で上書き可能");

  // シーン3: 個別テロップでフォントサイズを指定
  const scene3 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 10,
    volume: 0.3,
    effect: [Effects.fadeIn, Effects.fadeOut],
  });
  scene3
    .telop("小さいテロップ", { fontSize: 32 })
    .telop("標準サイズ（Movie: 64）")
    .telop("大きいテロップ", { fontSize: 96 })
    .telop("特大テロップ", { fontSize: 120, color: TelopColors.redOutline });

  // シーン4: 優先順位のデモ
  const scene4 = movie.scene("sample/movies/sample2.mp4", {
    trimBefore: 15,
    volume: 0.3,
    effect: [Effects.fadeIn, Effects.fadeOut],
    fontSize: 56, // シーンで56を指定
  });
  scene4
    .telop("シーン指定: 56")
    .telop("個別指定: 80", { fontSize: 80 })
    .telop("個別指定が優先される");

  // エンディング
  const ending = movie.ending({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeIn,
    fontSize: 72,
  });
  ending.telop("フォントサイズ デモ終了");

  return movie.build();
};

export const demo12MovieData = movie();

// Root.tsx で <RmbComposition {...demo12} /> として使用
export const demo12 = rmbProps(demo12MovieData);
