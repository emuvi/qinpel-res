function getCookie(name: string, orDefault?: string): string {
  let cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    let cookiePair = cookies[i].split("=");
    if (name == decodeURIComponent(cookiePair[0]).trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return orDefault;
}

function setCookie(name: string, value: any, options: any = {}) {
  options = {
    path: "/",
    ...options,
  };
  if (!options.expires) {
    let date = new Date();
    date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
    options.expires = date;
  }
  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }
  let updatedCookie =
    encodeURIComponent(name) + "=" + encodeURIComponent(value);
  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  document.cookie = updatedCookie;
}

function getTextLines(fromText: string): string[] {
  return fromText.match(/[^\r\n]+/g);
}

function getCSVRows(fromText: string, names?: string[]): string[][] | object[] {
  var lines = getTextLines(fromText);
  var result: string[][] | object[] = [];
  for (let line of lines) {
    let row: string[] | object = !names ? [] : {};
    let inside_quotes = false;
    let column_value = "";
    let column_index = 0;
    for (let char_index = 0; char_index < line.length; char_index++) {
      let actual = line.charAt(char_index);
      if (inside_quotes) {
        if (actual == '"') {
          let next =
            char_index < line.length - 1 ? line.charAt(char_index + 1) : "";
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
          if (!names) {
            (row as string[]).push(column_value);
          } else {
            let column_name = "col_" + column_index;
            if (column_index < names.length) {
              column_name = names[column_index];
            }
            (row as object)[column_name] = column_value;
          }
          column_value = "";
          column_index++;
        } else {
          column_value += actual;
        }
      }
    }
    column_value = unmaskSpecialChars(column_value);
    if (!names) {
      (row as string[]).push(column_value);
      (result as string[][]).push(row as string[]);
    } else {
      let column_name = "col_" + column_index;
      if (column_index < names.length) {
        column_name = names[column_index];
      }
      (row as object)[column_name] = column_value;
      (result as object[]).push(row as object);
    }
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
  return result;
}

export const QinBody = {
  getCookie,
  setCookie,
  getTextLines,
  getCSVRows,
  maskSpecialChars,
  unmaskSpecialChars,
  parseParameters,
};
