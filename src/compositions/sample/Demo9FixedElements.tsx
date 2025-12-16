import { Movie, Effects, Transitions, rmbProps } from "../../lib";

/**
 * Demo9: 固定要素（ロゴ・ウォーターマーク）
 * - Movie単位: 動画全体で表示
 * - Scene単位: シーン中のみ表示
 * - 位置: top-left, top-right, top-center, bottom-left, bottom-right, bottom-center
 */
const buildDemo9Movie = () => {
  const movie = new Movie({
    transition: Transitions.fade,
    transitionDuration: 1,
    telop: { overlay: { type: "gradient" } },
  });

  // Movie全体の固定要素
  movie.fixedImage("sample/images/sample1.png", {
    position: "top-right",
    margin: 30,
    opacity: 0.9,
    width: 180,
    height: 180,
  });

  movie.fixedText("@demo_user", {
    position: "bottom-left",
    margin: 30,
    fontSize: 36,
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
    borderRadius: 8,
  });

  // プロローグ
  const prologue = movie.opening({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeOut,
  });
  prologue.telop("固定要素のデモ");
  prologue.telop("ロゴ・ウォーターマーク");

  // シーン1: Movie固定要素の説明
  const scene1 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 5,
  });
  scene1.telop("movie.fixedImage()");
  scene1.telop("右上にロゴが常時表示");
  scene1.telop("movie.fixedText()");
  scene1.telop("左下にユーザー名が常時表示");

  // シーン2: Scene固定要素
  const scene2 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 15,
  });
  scene2.fixedText("Scene 2", {
    position: "top-left",
    fontSize: 40,
    color: "#00ff00",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
    borderRadius: 10,
    margin: 30,
  });
  scene2.telop("scene.fixedText()");
  scene2.telop("シーン中のみ表示される");
  scene2.telop("左上に緑の「Scene 2」");

  // シーン3: 位置のデモ（top-center）
  const scene3 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 25,
  });
  scene3.fixedText("top-center", {
    position: "top-center",
    fontSize: 36,
    color: "#ffff00",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
    borderRadius: 8,
    margin: 30,
  });
  scene3.telop("position: 'top-center'");
  scene3.telop("上部中央に配置");

  // シーン4: 位置のデモ（bottom-center）
  const scene4 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 35,
  });
  scene4.fixedText("bottom-center", {
    position: "bottom-center",
    fontSize: 36,
    color: "#ff00ff",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
    borderRadius: 8,
    margin: 180, // テロップと被らないように上げる
  });
  scene4.telop("position: 'bottom-center'");
  scene4.telop("下部中央に配置");

  // シーン5: 複数の固定要素
  const scene5 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 45,
  });
  scene5.fixedText("LIVE", {
    position: "top-left",
    fontSize: 36,
    color: "#ffffff",
    backgroundColor: "#ff0000",
    padding: 14,
    borderRadius: 8,
    margin: 30,
  });
  scene5.fixedText("12:34:56", {
    position: "top-center",
    fontSize: 36,
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 14,
    borderRadius: 8,
    margin: 30,
  });
  scene5.telop("複数の固定要素を組み合わせ");
  scene5.telop("LIVE + タイムスタンプ");

  // シーン6: 固定画像（Scene単位）
  const scene6 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 55,
  });
  scene6.fixedImage("sample/images/sample2.png", {
    position: "bottom-right",
    margin: 180,
    width: 180,
    height: 180,
    opacity: 0.8,
  });
  scene6.telop("scene.fixedImage()");
  scene6.telop("シーン固定の画像");

  // エピローグ
  const ending = movie.ending({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeIn,
  });
  ending.telop("固定要素編おわり");
  ending.telop("Movie/Scene単位で使い分け");

  return movie.build();
};

export const demo9MovieData = buildDemo9Movie();

export const demo9 = rmbProps(demo9MovieData);
