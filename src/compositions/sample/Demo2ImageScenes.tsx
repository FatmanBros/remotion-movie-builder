import { Effects, Movie, rmbProps } from "../../lib";

/**
 * Demo2: 画像シーンの使い方
 * - 画像ファイルでシーン作成
 * - エフェクトの適用
 *
 * 自動計算の仕組み:
 * - シーンのduration省略時 → テロップの合計時間から自動計算
 * - テロップのduration省略時 → 文字数から自動計算（読みやすい速度）
 */
const buildDemo2Movie = () => {
  const movie = new Movie();

  // プロローグ
  const prologue = movie.opening({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeOut,
  });
  prologue.telop("画像シーンの使い方");

  // 画像シーン1
  const imageScene1 = movie.scene("sample/images/sample1.png", {
    effect: [Effects.fadeIn, Effects.fadeOut],
    overlay: { color: "0,0,0" },
  });
  imageScene1
    .telop("画像ファイルも使えます")
    .telop("拡張子で自動判別");

  // 画像シーン2
  const imageScene2 = movie.scene("sample/images/sample2.png", {
    effect: [Effects.fadeIn, Effects.fadeOut],
    overlay: { color: "0,0,0" },
  });
  imageScene2
    .telop("シーンのdurationは自動計算")
    .telop("テロップの合計時間から決まります");

  // 画像シーン3
  const imageScene3 = movie.scene("sample/images/sample3.png", {
    effect: [Effects.fadeIn, Effects.fadeOut],
    overlay: { color: "0,0,0" },
  });
  imageScene3
    .telop("テロップのdurationも自動計算")
    .telop("文字数から読みやすい速度で計算されます")
    .telop("便利！");

  // 画像シーン4
  const imageScene4 = movie.scene("sample/images/sample4.png", {
    effect: [Effects.fadeIn, Effects.fadeOut],
    overlay: { color: "0,0,0" },
  });
  imageScene4
    .telop("短いテロップは短く")
    .telop("長いテロップは読みやすい速度で長めに表示されます");

  // メディアなしシーン
  const textOnlyScene = movie.scene({});
  textOnlyScene.telop("メディアなしシーンも作成可能");

  // エピローグ
  const ending = movie.ending({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeIn,
  });
  ending.telop("画像編おわり");

  return movie.build();
};

export const demo2MovieData = buildDemo2Movie();

export const demo2 = rmbProps(demo2MovieData);
