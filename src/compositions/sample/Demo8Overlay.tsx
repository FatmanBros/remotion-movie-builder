import { Movie, Effects, TelopColors, rmbProps } from "../../lib";

/**
 * Demo8: オーバーレイの種類
 * - gradient: 画面端からのグラデーション
 * - box: テキストの後ろに矩形
 * - shadow: テキストの後ろにシャドー付き矩形
 */
const buildDemo8Movie = () => {
  const movie = new Movie();

  // プロローグ
  const prologue = movie.opening({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeOut,
  });
  prologue.telop("オーバーレイのデモ");

  // シーン1: gradient（デフォルト）
  const scene1 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 5,
    overlay: { type: "gradient", color: "0,0,0" },
  });
  scene1.telop("overlay: { type: 'gradient' }");
  scene1.telop("画面端からのグラデーション");
  scene1.telop("デフォルトのオーバーレイタイプ");

  // シーン2: gradient（上部）
  const scene2 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 10,
    overlay: { type: "gradient", color: "0,0,0" },
  });
  scene2.telop("position: 'top' でも使える", { position: "top" });
  scene2.telop("上部グラデーション", { position: "top" });

  // シーン3: box（矩形）
  const scene3 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 15,
  });
  scene3.telop("overlay: { type: 'box' }", {
    overlay: { type: "box", color: "0,0,0", opacity: 0.7 },
  });
  scene3.telop("テキストの後ろに矩形", {
    overlay: { type: "box", color: "0,0,0", opacity: 0.7 },
  });
  scene3.telop("シンプルで見やすい", {
    overlay: { type: "box", color: "0,0,0", opacity: 0.7 },
  });

  // シーン4: box（カスタマイズ）
  const scene4 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 20,
  });
  scene4.telop("padding: 24, borderRadius: 16", {
    overlay: { type: "box", color: "0,0,0", opacity: 0.8, padding: 24, borderRadius: 16 },
  });
  scene4.telop("色も変更可能", {
    overlay: { type: "box", color: "0,0,100", opacity: 0.7, padding: 20, borderRadius: 12 },
  });

  // シーン5: shadow
  const scene5 = movie.scene({
    backgroundColor: "#ffffff",
    trimBefore: 25,
    overlay: { type: "shadow", color: "0,0,0", opacity: 0.7 },
  });
  scene5.telop("overlay: { type: 'shadow' }");
  scene5.telop("シャドー付きで立体感", { color: TelopColors.doubleBlue });
  scene5.telop("動画との一体感が出る");

  // シーン6: Movie全体にデフォルト設定
  const scene6 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 30,
    overlay: { type: "box", color: "50,50,50", opacity: 0.8 },
  });
  scene6.telop("new Movie({ overlay: {...} })");
  scene6.telop("全シーンに一括適用できる");

  // シーン7: 比較（オーバーレイなし vs あり）
  const scene7 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 35,
  });
  scene7.telop("オーバーレイなし");
  scene7.telop("オーバーレイあり（box）", {
    overlay: { type: "box", color: "0,0,0", opacity: 0.7 },
  });
  scene7.telop("オーバーレイあり（shadow）", {
    overlay: { type: "shadow", color: "0,0,0", opacity: 0.6 },
  });

  // エピローグ
  const ending = movie.ending({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeIn,
  });
  ending.telop("オーバーレイ編おわり");

  return movie.build();
};

export const demo8MovieData = buildDemo8Movie();

export const demo8 = rmbProps(demo8MovieData);
