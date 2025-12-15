import React from "react";
import { Effects, Movie, MovieRenderer, TelopPresets } from "../../lib";

/**
 * Demo3: テロップエフェクトのショーケース
 * - 全プリセット
 * - 個別エフェクト指定
 */
const buildDemo3Movie = () => {
  const movie = new Movie({
    size: "shorts", // 1080x1920 縦型
  });

  // プロローグ
  const prologue = movie.opening({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeOut,
  });
  prologue.telop("テロップエフェクト集");

  // シーン1: プリセット紹介1
  const scene1 = movie.scene({ backgroundColor: "#1a1a2e" });
  scene1.telop("TelopPresets.dropRainbow", {
    effects: TelopPresets.dropRainbow,
  });
  scene1.telop("TelopPresets.bouncePulse", {
    effects: TelopPresets.bouncePulse,
  });
  scene1.telop("TelopPresets.slideGlow", {
    effects: TelopPresets.slideGlow,
  });

  // シーン2: プリセット紹介2
  const scene2 = movie.scene({ backgroundColor: "#1a1a2e" });
  scene2.telop("TelopPresets.zoomNeon", {
    effects: TelopPresets.zoomNeon,
  });
  scene2.telop("TelopPresets.typeWave", {
    effects: TelopPresets.typeWave,
  });
  scene2.telop("TelopPresets.elasticShake", {
    effects: TelopPresets.elasticShake,
  });

  // シーン3: プリセット紹介3
  const scene3 = movie.scene({ backgroundColor: "#1a1a2e" });
  scene3.telop("TelopPresets.blurGlow", {
    effects: TelopPresets.blurGlow,
  });
  scene3.telop("TelopPresets.rotateRainbow", {
    effects: TelopPresets.rotateRainbow,
  });
  scene3.telop("TelopPresets.risePulse", {
    effects: TelopPresets.risePulse,
  });

  // シーン4: プリセット紹介4
  const scene4 = movie.scene({ backgroundColor: "#1a1a2e" });
  scene4.telop("TelopPresets.simple", {
    effects: TelopPresets.simple,
  });
  scene4.telop("TelopPresets.spring", {
    effects: TelopPresets.spring,
  });

  // シーン5: 出現エフェクト（enter）
  const scene5 = movie.scene({ backgroundColor: "#1a1a2e" });
  scene5.telop("出現エフェクト一覧");
  scene5.telop("enter: drop", { effects: { enter: "drop" } });
  scene5.telop("enter: rise", { effects: { enter: "rise" } });
  scene5.telop("enter: bounce", { effects: { enter: "bounce" } });
  scene5.telop("enter: zoomIn", { effects: { enter: "zoomIn" } });

  // シーン6: 出現エフェクト続き
  const scene6 = movie.scene({ backgroundColor: "#1a1a2e" });
  scene6.telop("enter: slideInLeft", { effects: { enter: "slideInLeft" } });
  scene6.telop("enter: slideInRight", { effects: { enter: "slideInRight" } });
  scene6.telop("enter: typewriter", { effects: { enter: "typewriter" } });
  scene6.telop("enter: blur", { effects: { enter: "blur" } });

  // シーン7: 出現エフェクト続き2
  const scene7 = movie.scene({ backgroundColor: "#1a1a2e" });
  scene7.telop("enter: rotate", { effects: { enter: "rotate" } });
  scene7.telop("enter: elastic", { effects: { enter: "elastic" } });
  scene7.telop("enter: spring", { effects: { enter: "spring" } });

  // シーン8: 消失エフェクト（exit）
  const scene8 = movie.scene({ backgroundColor: "#1a1a2e" });
  scene8.telop("消失エフェクト一覧");
  scene8.telop("exit: dropOut", { effects: { exit: "dropOut" } });
  scene8.telop("exit: riseOut", { effects: { exit: "riseOut" } });
  scene8.telop("exit: zoomOut", { effects: { exit: "zoomOut" } });

  // シーン9: 消失エフェクト続き
  const scene9 = movie.scene({ backgroundColor: "#1a1a2e" });
  scene9.telop("exit: slideOutLeft", { effects: { exit: "slideOutLeft" } });
  scene9.telop("exit: slideOutRight", { effects: { exit: "slideOutRight" } });
  scene9.telop("exit: dissolve", { effects: { exit: "dissolve" } });
  scene9.telop("exit: scatter", { effects: { exit: "scatter" } });

  // シーン10: 強調エフェクト（emphasis）
  const scene10 = movie.scene({ backgroundColor: "#1a1a2e" });
  scene10.telop("強調エフェクト一覧");
  scene10.telop("emphasis: pulse", { effects: { emphasis: "pulse" } });
  scene10.telop("emphasis: shake", { effects: { emphasis: "shake" } });
  scene10.telop("emphasis: glow", { effects: { emphasis: "glow" } });

  // シーン11: 強調エフェクト続き
  const scene11 = movie.scene({ backgroundColor: "#1a1a2e" });
  scene11.telop("emphasis: wave", { effects: { emphasis: "wave" } });
  scene11.telop("emphasis: rainbow", { effects: { emphasis: "rainbow" } });
  scene11.telop("emphasis: neon", { effects: { emphasis: "neon" } });
  scene11.telop("emphasis: kirakira", { effects: { emphasis: "kirakira" } });

  // シーン12: 組み合わせ例
  const scene12 = movie.scene({ backgroundColor: "#000000" });
  scene12.telop("組み合わせ例");
  scene12.telop("bounce + scatter + rainbow", {
    effects: { enter: "bounce", exit: "scatter", emphasis: "rainbow" },
  });
  scene12.telop("typewriter + dissolve + glow", {
    effects: { enter: "typewriter", exit: "dissolve", emphasis: "glow" },
  });

  // エピローグ
  const ending = movie.ending({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeIn,
  });
  ending.telop("エフェクト編おわり");

  return movie.build();
};

export const demo3MovieData = buildDemo3Movie();

export const Demo3TelopEffects: React.FC = () => {
  return <MovieRenderer movieData={demo3MovieData} />;
};
