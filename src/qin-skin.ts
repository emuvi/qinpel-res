import { QinArms } from "./qin-arms";

export class QinPoint {
  posX: number;
  posY: number;
}

export class QinDimension {
  width: number;
  height: number;
}

export class QinBounds {
  posX: number;
  posY: number;
  width: number;
  height: number;
}

export enum QinGrandeur {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export const QinStyles = {
  ColorForeground: "#180027ff",
  ColorBackground: "#fffcf9ff",
  ColorInactive: "#fff7ffff",
  ColorActive: "#fff0f0ff",
  ColorAccent: "#ae0000ff",
  ColorInactiveAct: "#f0f7ffff",
  ColorActiveAct: "#ddddffff",
  ColorAccentAct: "#0000aeff",
  ColorBlocked: "#f0f0f0ff",
  ColorEntered: "#e7f0e7ff",
  ColorAttend: "#496b49ff",
  ColorSelected: "#5d72de8f",
  FontName: "SourceSansPro",
  FontSize: "16px",
};

export const QinStylesPicker = {
  ColorPickerForeground: "#180027ff",
  ColorPickerAccentAct: "#0000aeff",
  ColorUnPickedInactiveAct: "#f0f7ffff",
  ColorUnPickedActiveAct: "#ddddffff",
  ColorPickedInactiveAct: "#85c0ffff",
  ColorPickedActiveAct: "#8f8fffff",
};

function styleAsBody(el: HTMLElement) {
  el.style.position = "absolute";
  el.style.top = "0px";
  el.style.right = "0px";
  el.style.bottom = "0px";
  el.style.left = "0px";
  el.style.padding = "9px";
  el.style.overflow = "auto";
}

function styleAsBase(el: HTMLElement) {
  el.style.margin = "1px";
  el.style.padding = "3px";
  el.style.outline = "none";
  el.style.color = QinStyles.ColorForeground;
  el.style.fontFamily = "SourceSansPro";
  el.style.fontSize = "16px";
}

function styleAsEditable(el: HTMLElement) {
  styleAsBase(el);
  el.style.backgroundColor = QinStyles.ColorInactive;
  el.style.border = "1px solid " + QinStyles.ColorForeground;
  el.style.borderRadius = "3px";
  el.style.outline = "none";
  el.addEventListener("focus", () => {
    el.style.backgroundColor = QinStyles.ColorActive;
    el.style.border = "1px solid " + QinStyles.ColorAccent;
  });
  el.addEventListener("focusout", () => {
    el.style.backgroundColor = QinStyles.ColorInactive;
    el.style.border = "1px solid " + QinStyles.ColorForeground;
  });
}

export type QinActionableStyles = {
  ColorForeground: string;
  ColorInactiveAct: string;
  ColorActiveAct: string;
  ColorAccentAct: string;
};

function styleAsActionable(el: HTMLElement, styles: QinActionableStyles = QinStyles) {
  styleAsBase(el);
  el.style.backgroundColor = styles.ColorInactiveAct;
  el.style.border = "1px solid " + styles.ColorForeground;
  el.style.borderRadius = "3px";
  el.style.outline = "none";
  el.addEventListener("focus", () => {
    el.style.backgroundColor = styles.ColorActiveAct;
    el.style.border = "1px solid " + styles.ColorAccentAct;
  });
  el.addEventListener("focusout", () => {
    el.style.backgroundColor = styles.ColorInactiveAct;
    el.style.border = "1px solid " + styles.ColorForeground;
  });
}

function styleAsReadOnly(el: HTMLElement) {
  styleAsBase(el);
  el.style.backgroundColor = QinStyles.ColorBlocked;
  el.style.border = "1px solid " + QinStyles.ColorForeground;
  el.style.borderRadius = "3px";
  el.style.outline = "none";
  el.addEventListener("focus", () => {
    el.style.backgroundColor = QinStyles.ColorEntered;
    el.style.border = "1px solid " + QinStyles.ColorAttend;
  });
  el.addEventListener("focusout", () => {
    el.style.backgroundColor = QinStyles.ColorBlocked;
    el.style.border = "1px solid " + QinStyles.ColorForeground;
  });
}

function styleMaxSizeForNotOverFlow(el: HTMLElement, parent?: HTMLElement) {
  console.log("D1");
  if (!parent) {
    parent = el.parentElement;
    console.log("D2: " + parent);
  }
  if (parent) {
    let maxWidth = 0;
    let maxHeight = 0;
    let imediate = el;
    do {
      maxWidth = maxWidth + imediate.clientLeft;
      maxHeight = maxHeight + imediate.clientTop;
      console.log("D3: " + maxWidth);
      console.log("D4: " + maxHeight);
      imediate = imediate.parentElement;
    } while (imediate != null && imediate != parent);
    maxWidth = parent.clientWidth - maxWidth;
    maxHeight = parent.clientHeight - maxHeight;
    console.log("D5: " + maxWidth);
    console.log("D6: " + maxHeight);
    el.style.maxWidth = maxWidth + "px";
    el.style.maxHeight = maxHeight + "px";
  }
}

function styleSize(el: HTMLElement, size?: QinDimension | QinGrandeur) {
  if (size) {
    if (size instanceof QinDimension) {
      el.style.width = size.width + "px";
      el.style.height = size.height + "px";
    } else {
      let dim = getDimensionSize(size);
      el.style.width = dim.width + "px";
      el.style.height = dim.height + "px";
    }
  }
}

function styleFlexMax(el: HTMLElement) {
  el.style.flex = "1";
}

function styleFlexMin(el: HTMLElement) {
  el.style.flex = "0";
}

function getWindowSize(): QinDimension {
  return {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
}

function getWindowSizeStyle(): QinGrandeur {
  const width = getWindowSize().width;
  if (width < 600) {
    return QinGrandeur.SMALL;
  } else if (width < 1000) {
    return QinGrandeur.MEDIUM;
  } else {
    return QinGrandeur.LARGE;
  }
}

function hideAllIFrames() {
  var docIFrames = document.getElementsByTagName("iframe");
  for (let i = 0; i < docIFrames.length; i++) {
    let doc_iframe = docIFrames[i];
    doc_iframe.style.visibility = "hidden";
  }
}

function showAllIFrames() {
  var docIFrames = document.getElementsByTagName("iframe");
  for (let i = 0; i < docIFrames.length; i++) {
    let doc_iframe = docIFrames[i];
    doc_iframe.style.visibility = "visible";
  }
}

function disableSelection(element: HTMLElement) {
  element.style.userSelect = "none";
  element.style.webkitUserSelect = "none";
  element.onselectstart = QinArms.stopEvent;
}

function clearSelection() {
  setTimeout(() => {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }, 360);
}

function isElementVisibleInScroll(element: HTMLElement) {
  if (element.parentElement) {
    if (element.offsetTop < element.parentElement.scrollTop) {
      return false;
    }
    if (element.offsetLeft < element.parentElement.scrollLeft) {
      return false;
    }
    if (
      element.clientWidth >
      element.parentElement.clientWidth -
        (element.offsetLeft - element.parentElement.scrollLeft)
    ) {
      return false;
    }
    if (
      element.clientHeight >
      element.parentElement.clientHeight - (element.offsetTop - element.parentElement.scrollTop)
    ) {
      return false;
    }
  }
  return true;
}

function getDimension(el: HTMLElement): QinDimension {
  return {
    width: parseInt(el.style.width),
    height: parseInt(el.style.height),
  };
}

function getDimensionSize(size: QinGrandeur): QinDimension {
  if (size == QinGrandeur.LARGE) {
    return getDimensionLarge();
  } else if (size == QinGrandeur.MEDIUM) {
    return getDimensionMedium();
  } else {
    return getDimensionSmall();
  }
}

const dimensionSmall: QinDimension = {
  width: 21,
  height: 21,
};
function getDimensionSmall(): QinDimension {
  return dimensionSmall;
}

const dimensionMedium: QinDimension = {
  width: 32,
  height: 32,
};

function getDimensionMedium(): QinDimension {
  return dimensionMedium;
}

const dimensionLarge: QinDimension = {
  width: 64,
  height: 64,
};

function getDimensionLarge(): QinDimension {
  return dimensionLarge;
}

function applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
  if (element && styles) {
    for (const key in styles) {
      element.style[key] = styles[key];
    }
  }
}

export const QinSkin = {
  styles: QinStyles,
  styleAsBody,
  styleAsBase,
  styleAsEditable,
  styleAsActionable,
  styleAsReadOnly,
  styleMaxSizeForNotOverFlow,
  styleSize,
  styleFlexMax,
  styleFlexMin,
  getWindowSize,
  getWindowSizeStyle,
  hideAllIFrames,
  showAllIFrames,
  disableSelection,
  clearSelection,
  isElementVisibleInScroll,
  getDimension,
  getDimensionSize,
  getDimensionSmall,
  getDimensionMedium,
  getDimensionLarge,
  applyStyles,
};
