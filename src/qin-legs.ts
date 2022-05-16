function newRow(items?: HTMLElement[]): HTMLDivElement {
  const result = document.createElement("div");
  result.style.display = "flex";
  result.style.flexDirection = "row";
  if (items) {
    for (const item of items) {
      result.appendChild(item);
    }
  }
  return result;
}

function newLine(items?: HTMLElement[]): HTMLDivElement {
  const result = document.createElement("div");
  result.style.display = "flex";
  result.style.flexDirection = "row";
  result.style.flexWrap = "wrap";
  if (items) {
    for (const item of items) {
      result.appendChild(item);
    }
  }
  return result;
}

function newColumn(items?: HTMLElement[]): HTMLDivElement {
  const result = document.createElement("div");
  result.style.display = "flex";
  result.style.flexDirection = "column";
  if (items) {
    for (const item of items) {
      result.appendChild(item);
    }
  }
  return result;
}

function newSpan(text: string): HTMLSpanElement {
  const result = document.createElement("div");
  result.innerText = text;
  return result;
}

export const QinLegs = {
  newRow,
  newLine,
  newColumn,
  newSpan,
};
