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
  return getTreatMessage("Look", info, origin);
}

function logError(error: any, origin: string) {
  log(getErrorMessage(error, origin));
}

function getErrorMessage(error: any, origin: string) {
  return getTreatMessage("Problem", error, origin);
}

function logWarning(error: any, origin: string) {
  log(getWarningMessage(error, origin));
}

function getWarningMessage(error: any, origin: string) {
  return getTreatMessage("Attention", error, origin);
}

function getTreatMessage(prefix: string, error: any, origin: string) {
  var result = "";
  if (error && error.why) {
    result += " on " + getMessageOrData(error.why);
  }
  if (error && error.message) {
    result += " on " + getMessageOrData(error.message);
  }
  if (error && error.response && error.response.data) {
    if (result) {
      result += "\nAnd";
    }
    result += " was returned" + getMessageOrData(error.response.data);
  }
  if (origin) {
    result += "\nBy origin: " + origin;
  }
  return prefix + result;
}

function getMessageOrData(of: any): string {
  if (!(typeof of == "string" || of instanceof String)) {
    return " with data:\n" + JSON.stringify(of);
  } else {
    return " of:\n" + of;
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
