import { QinSkin } from "./qin-skin";

function newRow(items?: HTMLElement[], styles?: CSSStyleDeclaration): HTMLDivElement {
  const result = document.createElement("div");
  result.style.display = "flex";
  result.style.flexDirection = "row";
  if (items) {
    for (const item of items) {
      result.appendChild(item);
    }
  }
  QinSkin.applyStyles(result, styles);
  return result;
}

function newLine(items?: HTMLElement[], styles?: CSSStyleDeclaration): HTMLDivElement {
  const result = document.createElement("div");
  result.style.display = "flex";
  result.style.flexDirection = "row";
  result.style.flexWrap = "wrap";
  if (items) {
    for (const item of items) {
      result.appendChild(item);
    }
  }
  QinSkin.applyStyles(result, styles);
  return result;
}

function newColumn(items?: HTMLElement[], styles?: CSSStyleDeclaration): HTMLDivElement {
  const result = document.createElement("div");
  result.style.display = "flex";
  result.style.flexDirection = "column";
  if (items) {
    for (const item of items) {
      result.appendChild(item);
    }
  }
  QinSkin.applyStyles(result, styles);
  return result;
}

function newSpan(text: string, styles?: CSSStyleDeclaration): HTMLSpanElement {
  const result = document.createElement("div");
  result.innerText = text;
  QinSkin.applyStyles(result, styles);
  return result;
}

function newImg(src: string, styles?: CSSStyleDeclaration): HTMLImageElement {
  const result = document.createElement("img");
  result.src = src;
  QinSkin.applyStyles(result, styles);
  return result;
}

export const QinLegs = {
  newRow,
  newLine,
  newColumn,
  newSpan,
  newImg,
};
