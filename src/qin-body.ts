export enum QinNature {
  BIT = "BIT",
  BOOL = "BOOL",
  BYTE = "BYTE",
  TINY = "TINY",
  SMALL = "SMALL",
  INT = "INT",
  LONG = "LONG",
  SERIAL = "SERIAL",
  BIG_SERIAL = "BIG_SERIAL",
  FLOAT = "FLOAT",
  REAL = "REAL",
  DOUBLE = "DOUBLE",
  NUMERIC = "NUMERIC",
  BIG_NUMERIC = "BIG_NUMERIC",
  CHAR = "CHAR",
  CHARS = "CHARS",
  DATE = "DATE",
  TIME = "TIME",
  DATE_TIME = "DATE_TIME",
  TIMESTAMP = "TIMESTAMP",
  BYTES = "BYTES",
  BLOB = "BLOB",
  TEXT = "TEXT",
}

function makeQinUID(): string {
  return (
    "qin_uid_" +
    getLastChars(Date.now() + "", 4, "0", false) +
    "_" +
    fillToString(Math.floor(Math.random() * 10000), 5, "0", false)
  );
}

function makeQindredUID(qindred: string): string {
  return (
    qindred +
    "_qindred_" +
    getLastChars(Date.now() + "", 4, "0", false) +
    "_" +
    fillToString(Math.floor(Math.random() * 10000), 5, "0", false)
  );
}

function getLastChars(
  source: string,
  count: number,
  fillWith: string = " ",
  atEnd: boolean = true
): string {
  if (source.length < count) {
    return fillToString(source, count, fillWith, atEnd);
  }
  return source.substring(source.length - count);
}

function fillToString(
  value: any,
  tilSize: number,
  withStr: string = " ",
  atEnd: boolean = true
): string {
  let result = value.toString();
  while (result.length < tilSize) {
    if (atEnd) {
      result += withStr;
    } else {
      result = withStr + result;
    }
  }
  return result;
}

function getTextLines(fromText: string): string[] {
  if (fromText) {
    return fromText.match(/[^\r\n]+/g);
  } else {
    return [];
  }
}

function getCSVRows(fromText: string): string[][] {
  var lines = getTextLines(fromText);
  var result: string[][] = [];
  for (let line of lines) {
    let row = new Array<string>();
    let inside_quotes = false;
    let column_value = "";
    let column_index = 0;
    for (let char_index = 0; char_index < line.length; char_index++) {
      let actual = line.charAt(char_index);
      if (inside_quotes) {
        if (actual == '"') {
          let next = char_index < line.length - 1 ? line.charAt(char_index + 1) : "";
          if (next == '"') {
            column_value += actual;
            char_index++;
          } else {
            inside_quotes = false;
          }
        } else {
          column_value += actual;
        }
      } else {
        if (actual == '"') {
          inside_quotes = true;
        } else if (actual == ",") {
          column_value = unmaskSpecialChars(column_value);
          row.push(column_value);
          column_value = "";
          column_index++;
        } else {
          column_value += actual;
        }
      }
    }
    column_value = unmaskSpecialChars(column_value);
    row.push(column_value);
    result.push(row);
  }
  return result;
}

function maskSpecialChars(fromText: string): string {
  return fromText
    .replace("\\", "\\\\")
    .replace("\r", "\\r")
    .replace("\n", "\\n")
    .replace("\t", "\\t");
}

function unmaskSpecialChars(fromText: string): string {
  return fromText
    .replace("\\\\", "\\")
    .replace("\\r", "\r")
    .replace("\\n", "\n")
    .replace("\\t", "\t");
}

function parseParameters(source: string): string[] {
  let result = [];
  let open = false;
  let actual = "";
  for (const letter of Array.from(source)) {
    if (open) {
      if (letter == '"') {
        open = false;
        if (actual) {
          result.push(actual);
          actual = "";
        }
      } else {
        actual += letter;
      }
    } else {
      if (letter == '"') {
        open = true;
        if (actual) {
          result.push(actual);
          actual = "";
        }
      } else if (letter == " ") {
        if (actual) {
          result.push(actual);
          actual = "";
        }
      } else {
        actual += letter;
      }
    }
  }
  if (actual) {
    result.push(actual);
  }
  return result;
}

export const QinBody = {
  makeQinUID,
  makeQindredUID,
  getLastChars,
  fillToString,
  getTextLines,
  getCSVRows,
  maskSpecialChars,
  unmaskSpecialChars,
  parseParameters,
};
