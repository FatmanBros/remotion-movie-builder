import React from "react";
import { Effects, Movie, MovieRenderer, TelopPresets } from "../../lib";

/**
 * Demo6: テロップ配列と同時表示の使い方
 * - テロップの配列での一括追加
 * - 同時表示テロップの自動位置調整
 * - afterオプションによる相対時間指定
 */
const buildDemo6Movie = () => {
  const movie = new Movie({
    overlay: { color: "0,0,0" },
  });

  // プロローグ
  const prologue = movie.opening({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeOut,
  });
  prologue.telop("テロップ配列と同時表示のデモ");

  // シーン1: テロップ配列での一括追加
  const scene1 = movie.scene("sample/images/sample1.png");
  // 配列でテロップを一括追加（開始時間を指定）
  scene1.telop(
    ["テロップ配列の使い方", "開始時間を配列で指定", "一括で追加できます"],
    [0, 2.5, 5],  // 各テロップの開始時間（秒）
  );

  // シーン2: 同時表示テロップの自動位置調整
  const scene2 = movie.scene("sample/images/sample2.png");
  // 同じタイミングで複数のテロップを表示（自動的に位置がずれる）
  scene2.telop(
    ["同時に表示されるテロップ", "自動的に位置が調整されます", "重ならないように上にずれます"],
    [0, 0, 0],  // すべて同時（0秒）に開始
    { duration: 4 }
  );
  scene2.telop("この機能で複数行表示も簡単", { before: 4.5 });

  // シーン3: 時間をずらした同時表示
  const scene3 = movie.scene("sample/images/sample3.png");
  scene3.telop(
    ["1行目: 最初から表示", "2行目: 1秒後から", "3行目: 2秒後から"],
    [0, 1, 2],  // 開始時間をずらす
    { duration: 5 }
  );
  scene3.telop("重なる期間だけ位置調整される", { before: 5.5 });

  // シーン4: 長いテロップの位置調整
  const scene4 = movie.scene("sample/images/sample4.png", {
    overlay: { color: "0,0,0" },
  });
  scene4.telop(
    "長いテロップがあっても大丈夫です。横幅から正確に高さを計算して配置を調整します。折り返しがあっても重なりません。"
  );
  scene4.telop("こんなふうに", { before: 5 });

  // シーン5: afterオプションの使い方
  const scene5 = movie.scene("sample/images/sample1.png");
  scene5
    .telop("afterオプションの使い方")
    .telop("前のテロップ終了後すぐ")           // after省略 = after: 0
    .telop("前のテロップ終了2秒後", { after: 2 })
    .telop("さらに3秒後", { after: 3 });

  // エピローグ
  const ending = movie.ending({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeIn,
  });
  ending.telop("テロップ配列編おわり");

  return movie.build();
};

export const demo6MovieData = buildDemo6Movie();

export const Demo6BatchTelop: React.FC = () => {
  return <MovieRenderer movieData={demo6MovieData} />;
};
