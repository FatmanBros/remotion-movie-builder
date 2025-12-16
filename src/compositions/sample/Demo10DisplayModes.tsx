import { Movie, Effects, Transitions, rmbProps } from "../../lib";

/**
 * Demo10: 表示モード
 *
 * 基本モード:
 * - cover: 画面全体を埋める（はみ出し部分はクロップ）デフォルト
 * - contain: 全体を表示（アスペクト比維持、レターボックス）
 * - fitWidth: 左右ぴったり（上下に黒帯の可能性）
 * - fitHeight: 上下ぴったり（左右に黒帯の可能性）
 *
 * 映画風アスペクト比:
 * - vista: ヴィスタサイズ (1.85:1)
 * - cinemascope: シネマスコープ (2.35:1)
 * - european: ヨーロピアンヴィスタ (1.66:1)
 * - imax: IMAX (1.43:1)
 *
 * 分割表示:
 * - "2/3": 高さ2/3で中央配置
 * - "2/3 top": 高さ2/3で上寄せ（下だけ切り取り）
 * - "2/3 bottom": 高さ2/3で下寄せ（上だけ切り取り）
 * - "1/3 80%": 高さ1/3、幅80%で中央配置
 */
const buildDemo10Movie = () => {
  const movie = new Movie({
    transition: Transitions.fade,
    transitionDuration: 1,
    telop: { overlay: { type: "shadow", color: "#999999" } },
  });

  // プロローグ
  const prologue = movie.opening({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeOut,
  });
  prologue.telop("表示モードのデモ");
  prologue.telop("displayMode オプション");

  // シーン1: cover（デフォルト）
  const scene1 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "cover",
  });
  scene1.telop("displayMode: 'cover'（デフォルト）");
  scene1.telop("画面全体を埋める");
  scene1.telop("はみ出し部分はクロップ");

  // シーン2: contain
  const scene2 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "contain",
  });
  scene2.telop("displayMode: 'contain'");
  scene2.telop("全体を表示");
  scene2.telop("レターボックス（黒帯）あり");

  // シーン3: fitWidth
  const scene3 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "fitWidth",
  });
  scene3.telop("displayMode: 'fitWidth'");
  scene3.telop("左右ぴったり");
  scene3.telop("上下に黒帯の可能性");

  // シーン4: fitHeight
  const scene4 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "fitHeight",
  });
  scene4.telop("displayMode: 'fitHeight'");
  scene4.telop("上下ぴったり");
  scene4.telop("左右に黒帯の可能性");

  // シーン5: 画像での比較 - cover
  const scene5 = movie.scene("sample/images/sample1.png", {
    displayMode: "cover",
  });
  scene5.telop("画像: displayMode: 'cover'");
  scene5.telop("画面全体に拡大");

  // シーン6: 画像での比較 - contain
  const scene6 = movie.scene("sample/images/sample1.png", {
    displayMode: "contain",
  });
  scene6.telop("画像: displayMode: 'contain'");
  scene6.telop("全体を表示");

  // シーン7: 画像での比較 - fitWidth
  const scene7 = movie.scene("sample/images/sample1.png", {
    displayMode: "fitWidth",
  });
  scene7.telop("画像: displayMode: 'fitWidth'");
  scene7.telop("左右ぴったり");

  // シーン8: 画像での比較 - fitHeight
  const scene8 = movie.scene("sample/images/sample1.png", {
    displayMode: "fitHeight",
  });
  scene8.telop("画像: displayMode: 'fitHeight'");
  scene8.telop("上下ぴったり");

  // === 映画風アスペクト比 ===

  // シーン9: ヴィスタサイズ
  const scene9 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "vista",
    backgroundColor: "#000000",
  });
  scene9.telop("displayMode: 'vista'");
  scene9.telop("ヴィスタサイズ (1.85:1)");
  scene9.telop("映画風の上下黒帯");

  // シーン10: シネマスコープ
  const scene10 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "cinemascope",
    backgroundColor: "#000000",
  });
  scene10.telop("displayMode: 'cinemascope'");
  scene10.telop("シネマスコープ (2.35:1)");
  scene10.telop("映画らしいワイド感");

  // シーン11: ヨーロピアンヴィスタ
  const scene11 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "european",
    backgroundColor: "#1a1a2e",
  });
  scene11.telop("displayMode: 'european'");
  scene11.telop("ヨーロピアンヴィスタ (1.66:1)");
  scene11.telop("帯色をカスタマイズ");

  // シーン12: IMAX
  const scene12 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "imax",
    backgroundColor: "#000000",
  });
  scene12.telop("displayMode: 'imax'");
  scene12.telop("IMAX (1.43:1)");
  scene12.telop("縦長めの映画サイズ");

  // === 分割表示 ===

  // シーン13: 2/3 中央
  const scene13 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "2/3",
    backgroundColor: "#000000",
  });
  scene13.telop("displayMode: '2/3'");
  scene13.telop("高さ2/3で中央配置");
  scene13.telop("上下に黒帯");

  // シーン14: 2/3 上寄せ（下だけ切り取り）
  const scene14 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "2/3 top",
    backgroundColor: "#000000",
  });
  scene14.telop("displayMode: '2/3 top'");
  scene14.telop("高さ2/3で上寄せ");
  scene14.telop("下だけ切り取り");

  // シーン15: 2/3 下寄せ（上だけ切り取り）
  const scene15 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "2/3 bottom",
    backgroundColor: "#000000",
  });
  scene15.telop("displayMode: '2/3 bottom'");
  scene15.telop("高さ2/3で下寄せ");
  scene15.telop("上だけ切り取り");

  // シーン16: 1/2 80%
  const scene16 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "1/2 80%",
    backgroundColor: "#1a1a2e",
  });
  scene16.telop("displayMode: '1/2 80%'");
  scene16.telop("高さ1/2、幅80%");
  scene16.telop("小さめの表示");

  // シーン17: オブジェクト形式
  const scene17 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: {
      height: "70%",
      width: "90%",
      position: "top",
    },
    backgroundColor: "#2d2d44",
  });
  scene17.telop("オブジェクト形式");
  scene17.telop("{ height: '70%', width: '90%', position: 'top' }");
  scene17.telop("細かい指定が可能");

  // === テロップ位置 ===

  // シーン18: テロップ位置 - bottom（デフォルト）
  const scene18 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "cover",
  });
  scene18.telop("テロップ位置: 'bottom'（デフォルト）", { position: "bottom" });
  scene18.telop("下から120pxの位置");

  // シーン19: テロップ位置 - top
  const scene19 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "cover",
  });
  scene19.telop("テロップ位置: 'top'", { position: "top" });
  scene19.telop("上から120pxの位置");

  // シーン20: テロップ位置 - center
  const scene20 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "cover",
  });
  scene20.telop("テロップ位置: 'center'", { position: "center" });
  scene20.telop("画面中央");

  // シーン21: テロップ位置 - bottom 20%
  const scene21 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "cover",
  });
  scene21.telop("テロップ位置: 'bottom 20%'", { position: "bottom 20%" });
  scene21.telop("下から20%の位置");

  // シーン22: テロップ位置 - top 15%
  const scene22 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "cover",
  });
  scene22.telop("テロップ位置: 'top 15%'", { position: "top 15%" });
  scene22.telop("上から15%の位置");

  // シーン23: テロップ位置 - bottom 5%
  const scene23 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "cover",
  });
  scene23.telop("テロップ位置: 'bottom 5%'", { position: "bottom 5%" });
  scene23.telop("画面下端ギリギリ");

  // シーン24: シーン単位のデフォルト位置
  const scene24 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "cover",
    telop: { position: "top 10%" },
  });
  scene24.telop("シーン単位のデフォルト位置");
  scene24.telop("telopPosition: 'top 10%'");
  scene24.telop("全テロップが上寄せ");

  // シーン25: 映画風 + テロップ位置の組み合わせ
  const scene25 = movie.scene("sample/movies/sample1.mp4", {
    displayMode: "cinemascope",
    backgroundColor: "#000000",
    telop: { position: "bottom 25%" },
  });
  scene25.telop("映画風 + テロップ位置");
  scene25.telop("シネマスコープ + 下25%");
  scene25.telop("黒帯の上にテロップ");

  // エピローグ（displayMode指定）
  const ending = movie.ending({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeIn,
    displayMode: "contain",
  });
  ending.telop("表示モード編おわり");
  ending.telop("用途に合わせて使い分け");

  return movie.build();
};

export const demo10MovieData = buildDemo10Movie();

export const demo10 = rmbProps(demo10MovieData);