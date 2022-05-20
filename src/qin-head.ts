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

function logError(error: any, origin: string) {
  log(getErrorMessage(error, origin));
}

function getErrorMessage(error: any, origin: string) {
  return getTreatMessage("Problem with", error, origin);
}

function logWarning(error: any, origin: string) {
  log(getWarningMessage(error, origin));
}

function getWarningMessage(error: any, origin: string) {
  return getTreatMessage("Checkout this", error, origin);
}

function logSupport(error: any, origin: string) {
  log(getSupportMessage(error, origin));
}

function getSupportMessage(error: any, origin: string) {
  return getTreatMessage("Need Support on", error, origin);
}

function getTreatMessage(prefix: string, error: any, origin: string) {
  var result = prefix;
  if (error && error.why) {
    result += "; Why: ";
    error = error.why;
  } else if (error && error.response && error.response.data) {
    result += "; Got: ";
    error = error.response.data;
  }
  if (!(typeof error == "string" || error instanceof String)) {
    result += "; Data: ";
    error = JSON.stringify(error);
  }
  result += error;
  if (origin) {
    result += "; Origin: " + origin;
  }
  const stack = new Error("").stack;
  if (stack) {
    result += "; Stack: " + stack;
  }
  return result;
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
  logError,
  getErrorMessage,
  logWarning,
  getWarningMessage,
  logSupport,
  getSupportMessage,
  getTreatMessage,
  toggleDevTools,
};
