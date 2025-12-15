import { Effects, Movie, TelopColors, rmbProps } from "../../lib";

/**
 * Demo7: テロップの色カスタマイズ
 * - TelopColorsプリセットの使い方
 * - 基本色、縁取り付き、グラデーション風
 */
const buildDemo7Movie = () => {
  const movie = new Movie();

  // プロローグ
  const prologue = movie.opening({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeOut,
  });
  prologue.telop("テロップ色カスタマイズのデモ");

  // シーン1: 基本色（暗い背景）
  const scene1 = movie.scene({ backgroundColor: "#1a1a2e" });
  scene1.telop("TelopColors.white", { color: TelopColors.white });
  scene1.telop("TelopColors.yellow", { color: TelopColors.yellow });
  scene1.telop("TelopColors.pink", { color: TelopColors.pink });
  scene1.telop("TelopColors.cyan", { color: TelopColors.cyan });
  scene1.telop("TelopColors.green", { color: TelopColors.green });

  // シーン2: 基本色続き（暗い背景）
  const scene2 = movie.scene({ backgroundColor: "#1a1a2e" });
  scene2.telop("TelopColors.orange", { color: TelopColors.orange });
  scene2.telop("TelopColors.red", { color: TelopColors.red });
  scene2.telop("TelopColors.purple", { color: TelopColors.purple });
  scene2.telop("TelopColors.blue", { color: TelopColors.blue });

  // シーン3: 縁取り付き（明るい背景でも見やすい）
  const scene3 = movie.scene({ backgroundColor: "#eeeeee" });
  scene3.telop("TelopColors.blackOutline", { color: TelopColors.blackOutline });
  scene3.telop("TelopColors.yellowOutline", { color: TelopColors.yellowOutline });
  scene3.telop("TelopColors.pinkOutline", { color: TelopColors.pinkOutline });
  scene3.telop("TelopColors.cyanOutline", { color: TelopColors.cyanOutline });

  // シーン4: 縁取り付き続き
  const scene4 = movie.scene({ backgroundColor: "#eeeeee" });
  scene4.telop("TelopColors.blueOutline", { color: TelopColors.blueOutline });
  scene4.telop("TelopColors.redOutline", { color: TelopColors.redOutline });
  scene4.telop("TelopColors.greenOutline", { color: TelopColors.greenOutline });
  scene4.telop("TelopColors.orangeOutline", { color: TelopColors.orangeOutline });

  // シーン5: グラデーション風（暗い背景）
  const scene5 = movie.scene({ backgroundColor: "#000000" });
  scene5.telop("TelopColors.sunset", { color: TelopColors.sunset });
  scene5.telop("TelopColors.ocean", { color: TelopColors.ocean });
  scene5.telop("TelopColors.neon", { color: TelopColors.neon });
  scene5.telop("TelopColors.gold", { color: TelopColors.gold });

  // シーン6: TV字幕風二重縁取り（色文字 + 白縁取り + 黒外枠）
  const scene6 = movie.scene({ backgroundColor: "#cccccc" });
  scene6.telop("TelopColors.doubleYellow", { color: TelopColors.doubleYellow });
  scene6.telop("TelopColors.doublePink", { color: TelopColors.doublePink });
  scene6.telop("TelopColors.doublePurple", { color: TelopColors.doublePurple });
  scene6.telop("TelopColors.doubleRed", { color: TelopColors.doubleRed });
  scene6.telop("TelopColors.doubleBlue", { color: TelopColors.doubleBlue });
  scene6.telop("TelopColors.doubleGreen", { color: TelopColors.doubleGreen });
  scene6.telop("TelopColors.doubleOrange", { color: TelopColors.doubleOrange });
  scene6.telop("TelopColors.doubleBrown", { color: TelopColors.doubleBrown });
  scene6.telop("TelopColors.tvStyle", { color: TelopColors.tvStyle });

  // シーン7: 直接指定の方法
  const scene7 = movie.scene({ backgroundColor: "#eeeeee" });
  scene7.telop("直接指定の方法");
  scene7.telop("テキスト色のみ", {
    color: { text: "#ff6b6b" },
  });
  scene7.telop("テキスト色 + 影", {
    color: { text: "#4ecdc4", shadow: "rgba(0,100,150,0.8)" },
  });
  scene7.telop("縁取り付き", {
    color: { text: "#ffffff", stroke: "#ff0066", strokeWidth: 3 },
  });
  scene7.telop("全部指定", {
    color: {
      text: "#ffd700",
      shadow: "rgba(0,0,0,0.8)",
      stroke: "#8b6914",
      strokeWidth: 2,
    },
  });

  // エピローグ
  const ending = movie.ending({
    image: "sample/images/sample_background.png",
    effect: Effects.fadeIn,
  });
  ending.telop("テロップ色編おわり");

  return movie.build();
};

export const demo7MovieData = buildDemo7Movie();

export const demo7 = rmbProps(demo7MovieData);
