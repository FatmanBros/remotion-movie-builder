import { Effects, Movie, TelopPresets, Transitions, rmbProps } from "../../lib";

/**
 * Demo4: トランジション（シーン切替）のデモ
 * - 各種トランジションエフェクト
 * - scene.transitionTo() の使い方
 *
 * NOTE: 重たいエフェクト（gridFlip系など）はコメントアウトしています
 */
const buildDemo4Movie = () => {
  const movie = new Movie({
    effects: TelopPresets.simple,
  });

  // プロローグ
  const prologue = movie.opening({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeOut,
  });
  prologue.telop("トランジションのデモ");

  // シーン1: fade（デフォルト）
  const scene1 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 0,
    volume: 0.2,
    overlay: { color: "0,0,0" },
  });
  scene1.telop("fade トランジション").telop("デフォルトのクロスフェード");

  // シーン2: wipeLeft
  const scene2 = movie.scene("sample/movies/sample2.mp4", {
    trimBefore: 2,
    volume: 0.2,
    overlay: { color: "0,0,0" },
  });
  scene1.transitionTo(scene2, { duration: 1, transition: Transitions.fade });
  scene2.telop("wipeLeft").telop("左からワイプ");

  // シーン3: slideUp
  const scene3 = movie.scene("sample/movies/sample3.mp4", {
    trimBefore: 3,
    volume: 0.2,
    overlay: { color: "0,0,0" },
  });
  scene2.transitionTo(scene3, { duration: 1, transition: Transitions.wipeLeft });
  scene3.telop("slideUp").telop("上にスライド");

  // シーン4: zoomIn
  const scene4 = movie.scene("sample/movies/sample4.mp4", {
    trimBefore: 0,
    volume: 0.2,
    overlay: { color: "0,0,0" },
  });
  scene3.transitionTo(scene4, { duration: 1, transition: Transitions.slideUp });
  scene4.telop("zoomIn").telop("ズームインで切替");

  // シーン5: 画像シーンでさらにデモ
  const scene5 = movie.scene("sample/images/sample1.png", {
    overlay: { color: "0,0,0" },
  });
  scene4.transitionTo(scene5, { duration: 1, transition: Transitions.zoomIn });
  scene5.telop("flipLeft").telop("左端を軸に回転");

  // シーン6
  const scene6 = movie.scene("sample/images/sample2.png", {
    overlay: { color: "0,0,0" },
  });
  scene5.transitionTo(scene6, { duration: 1, transition: Transitions.flipLeft });
  scene6
    .telop("blur")
    .telop("ブラーで切替")
    .telop("GPUによっては重くなる場合があります");

  // === 重たいエフェクト（コメントアウト） ===
  // const scene7 = movie.scene("sample/images/sample3.png", { duration: 4 });
  // scene6.transitionTo(scene7, { duration: 2, transition: Transitions.gridFlipLeft });
  // scene7.telop("gridFlipLeft", { effects: TelopPresets.simple });

  // const scene8 = movie.scene("sample/images/sample4.png", { duration: 4 });
  // scene7.transitionTo(scene8, { duration: 2, transition: Transitions.gridFlipRight });
  // scene8.telop("gridFlipRight", { effects: TelopPresets.simple });

  // const scene9 = movie.scene("sample/movies/sample1.mp4", { trimBefore: 10, volume: 0.2 });
  // scene8.transitionTo(scene9, { duration: 2, transition: Transitions.gridShrink });
  // scene9.telop("gridShrink", { effects: TelopPresets.simple });

  // const scene10 = movie.scene("sample/movies/sample2.mp4", { trimBefore: 15, volume: 0.2 });
  // scene9.transitionTo(scene10, { duration: 2, transition: Transitions.gridRandom });
  // scene10.telop("gridRandom", { effects: TelopPresets.simple });

  // エンディング
  const ending = movie.ending({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeIn,
  });
  ending
    .telop("他にもgridFlip系のエフェクトがあります")
    .telop("重たいのでコメントアウトしてあります")
    .telop("試す場合はコメントを外してみてね");

  return movie.build();
};

export const demo4MovieData = buildDemo4Movie();

export const demo4 = rmbProps(demo4MovieData);
