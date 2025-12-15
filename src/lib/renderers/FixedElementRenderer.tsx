import React from "react";
import { Img, staticFile } from "remotion";
import { FixedElementData, FixedPosition } from "../types";

type Props = {
  elements: FixedElementData[];
};

const getPositionStyle = (position: FixedPosition, margin: number): React.CSSProperties => {
  const base: React.CSSProperties = {
    position: "absolute",
    zIndex: 100,
  };

  switch (position) {
    case "top-left":
      return { ...base, top: margin, left: margin };
    case "top-right":
      return { ...base, top: margin, right: margin };
    case "bottom-left":
      return { ...base, bottom: margin, left: margin };
    case "bottom-right":
      return { ...base, bottom: margin, right: margin };
    case "top-center":
      return { ...base, top: margin, left: "50%", transform: "translateX(-50%)" };
    case "bottom-center":
      return { ...base, bottom: margin, left: "50%", transform: "translateX(-50%)" };
    default:
      return { ...base, top: margin, right: margin };
  }
};

const FixedImage: React.FC<{ element: FixedElementData }> = ({ element }) => {
  return (
    <div
      style={{
        ...getPositionStyle(element.position, element.margin),
        opacity: element.opacity,
        transform: `${getPositionStyle(element.position, element.margin).transform ?? ""} scale(${element.scale})`.trim(),
      }}
    >
      <Img
        src={staticFile(element.content)}
        style={{
          width: element.width,
          height: element.height,
          objectFit: "contain",
        }}
      />
    </div>
  );
};

const FixedText: React.FC<{ element: FixedElementData }> = ({ element }) => {
  return (
    <div
      style={{
        ...getPositionStyle(element.position, element.margin),
        opacity: element.opacity,
        transform: `${getPositionStyle(element.position, element.margin).transform ?? ""} scale(${element.scale})`.trim(),
        fontSize: element.fontSize ?? 24,
        color: element.color ?? "#ffffff",
        backgroundColor: element.backgroundColor,
        padding: element.backgroundColor ? element.padding ?? 8 : 0,
        borderRadius: element.backgroundColor ? element.borderRadius ?? 4 : 0,
        fontWeight: "bold",
        fontFamily: '"Noto Sans JP", sans-serif',
        textShadow: element.backgroundColor ? "none" : "2px 2px 4px rgba(0,0,0,0.8)",
        whiteSpace: "nowrap",
      }}
    >
      {element.content}
    </div>
  );
};

export const FixedElementRenderer: React.FC<Props> = ({ elements }) => {
  return (
    <>
      {elements.map((element, index) => (
        element.type === "image" ? (
          <FixedImage key={`fixed-${index}`} element={element} />
        ) : (
          <FixedText key={`fixed-${index}`} element={element} />
        )
      ))}
    </>
  );
};
