import { QinBody } from "./qin-body";

const dictionary: Map<string, string> = new Map();

export function tr(of: string): string {
  return dictionary.get(of) || of;
}

function translate(of: string, to: string) {
  dictionary.set(of, to);
}

function translations(dictionary: string) {
  let lines = QinBody.getTextLines(dictionary);
  for (let line of lines) {
    let index = line.indexOf("=");
    if (index > 0) {
      let of = line.substring(0, index);
      let to = line.substring(index + 1);
      translate(of, to);
    }
  }
}

function forgetAll() {
  dictionary.clear();
}

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
  options["SameSite"] = "Strict";
  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  updatedCookie += "; Secure";
  document.cookie = updatedCookie;
}

function delCookie(name: string, options: any = {}) {
  let updatedCookie = encodeURIComponent(name) + "=;  expires=Thu, 01 Jan 1970 00:00:00 GMT";
  if (options.expires) {
    delete options.expires;
  }
  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  document.cookie = updatedCookie;
}

function getDeskAPI() {
  var win = window as any;
  if (win.deskAPI) {
    return win.deskAPI;
  } else {
    win = window.parent;
  }
  if (win.deskAPI) {
    return win.deskAPI;
  } else {
    win = window.top;
  }
  if (win.deskAPI) {
    return win.deskAPI;
  }
  return undefined;
}

const logged: string[] = [];

function getLogged(): string[] {
  return logged;
}

function log(message: string) {
  logged.push(message);
  try {
    console.log(message);
  } catch (_) {}
  try {
    getDeskAPI().send("logOnMain", message);
  } catch (_) {}
}

function logInfo(error: any, origin: string) {
  log(getInfoMessage(error, origin));
}

function getInfoMessage(info: any, origin: string) {
  return getTreatMessage(tr("Look"), info, origin);
}

function logError(error: any, origin: string) {
  log(getErrorMessage(error, origin));
}

function getErrorMessage(error: any, origin: string) {
  return getTreatMessage(tr("Problem"), error, origin);
}

function logWarning(error: any, origin: string) {
  log(getWarningMessage(error, origin));
}

function getWarningMessage(error: any, origin: string) {
  return getTreatMessage(tr("Attention"), error, origin);
}

function getTreatMessage(prefix: string, value: any, origin: string) {
  var result = tr(" on: ");
  if (typeof value == "string" || value instanceof String) {
    result += value.toString();
  } else {
    if (value && value.why) {
      result += getMessageOrData(value.why);
    }
    if (value && value.message) {
      result += getMessageOrData(value.message);
    }
    if (value && value.response && value.response.data) {
      if (result) {
        result += "\n" + tr("And");
      }
      result += tr(" was returned") + getMessageOrData(value.response.data);
    }
  }
  if (origin) {
    result += "\n" + tr("By origin: ") + origin;
  }
  return prefix + result;
}

function getMessageOrData(of: any): string {
  if (typeof of == "string" || of instanceof String) {
    return of.toString();
  } else {
    return tr(" with data:") + "\n" + JSON.stringify(of);
  }
}

function toggleDevTools() {
  try {
    getDeskAPI().send("toggleDevTools");
  } catch (e) {
    logError(e, "{qinpel-res}(ErrCode-000001)");
  }
}

export const QinHead = {
  translate,
  translations,
  forgetAll,
  getCookie,
  setCookie,
  delCookie,
  getDeskAPI,
  getLogged,
  log,
  logInfo,
  getInfoMessage,
  logError,
  getErrorMessage,
  logWarning,
  getWarningMessage,
  getTreatMessage,
  toggleDevTools,
};
