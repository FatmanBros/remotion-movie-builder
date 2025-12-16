import { Effects, Movie, TelopPresets, rmbProps } from "../../lib";

/**
 * Demo5: ワイプ（PiP）の使い方
 * - ワイプ動画の追加
 * - 位置・サイズの指定
 * - 表示タイミングの制御
 */
const buildDemo5Movie = () => {
  const movie = new Movie({
    telop: { effects: TelopPresets.simple },
  });

  // プロローグ
  const prologue = movie.opening({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeOut,
  });
  prologue.telop("ワイプ（PiP）のデモ");

  // シーン1: ワイプの基本的な使い方
  const scene1 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 0,
    volume: 0.2,
  });
  scene1.wipe("sample/movies/sample2.mp4", {
    position: "bottom-right",
    size: 0.3,
    volume: 0,
    margin: 20,
    borderRadius: 12,
  });
  scene1
    .telop("ワイプ動画の追加方法")
    .telop("scene.wipe() で追加")
    .telop("右下に小さく表示されています");

  // シーン2: 左上に移動
  const scene2 = movie.scene("sample/movies/sample2.mp4", {
    trimBefore: 3,
    volume: 0.2,
  });
  scene2.wipe("sample/movies/sample3.mp4", {
    position: "top-left",
    size: 0.25,
    volume: 0,
    margin: 30,
  });
  scene2
    .telop("position: top-left")
    .telop("左上に移動しました");

  // シーン3: 右上に移動
  const scene3 = movie.scene("sample/movies/sample3.mp4", {
    trimBefore: 5,
    volume: 0.2,
  });
  scene3.wipe("sample/movies/sample4.mp4", {
    position: "top-right",
    size: 0.25,
    volume: 0,
    margin: 30,
  });
  scene3
    .telop("position: top-right")
    .telop("右上に移動しました");

  // シーン4: 左下に移動
  const scene4 = movie.scene("sample/movies/sample1.mp4", {
    trimBefore: 10,
    volume: 0.2,
  });
  scene4.wipe("sample/movies/sample2.mp4", {
    position: "bottom-left",
    size: 0.25,
    volume: 0,
    margin: 30,
  });
  scene4
    .telop("position: bottom-left")
    .telop("左下に移動しました");

  // シーン5: 表示タイミングの制御
  // ワイプ: 3秒後に出現 → 5秒間表示 → 8秒で消える
  const scene5 = movie.scene("sample/movies/sample2.mp4", {
    trimBefore: 8,
    duration: 12,  // 明示的に12秒のシーン
    volume: 0.2,
  });
  scene5.wipe("sample/movies/sample3.mp4", {
    position: "bottom-right",
    size: 0.35,
    volume: 0,
    before: 3,      // シーン開始から3秒後に表示
    duration: 5,    // 5秒間表示（8秒で消える）
  });
  // テロップをワイプのタイミングに合わせて配置
  scene5
    .telop("ワイプの表示タイミング制御", { before: 0, duration: 2.5 })
    .telop("3秒後にワイプが出てきます", { before: 0.5, duration: 2.5 })
    .telop("ワイプが表示されました！", { before: 3, duration: 2 })
    .telop("5秒間だけ表示されます", { before: 5, duration: 2 })
    .telop("そろそろ消えます...", { before: 7, duration: 1.5 })
    .telop("ワイプが消えました", { before: 8.5, duration: 3 });

  // エピローグ
  const ending = movie.ending({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeIn,
  });
  ending.telop("ワイプ編おわり");

  return movie.build();
};

export const demo5MovieData = buildDemo5Movie();

export const demo5 = rmbProps(demo5MovieData);
