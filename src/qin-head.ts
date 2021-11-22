export class QinPoint {
    posX: number;
    posY: number;
};

export class QinDimension {
    width: number;
    height: number;
};

export class QinBounds {
    posX: number;
    posY: number;
    width: number;
    height: number;
};

export enum QinGrandeur {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
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
    return getTreatMessage("Problem with:", error, origin);
}

function logWarning(error: any, origin: string) {
    log(getWarningMessage(error, origin));
}

function getWarningMessage(error: any, origin: string) {
    return getTreatMessage("Checkout this:", error, origin);
}

function logSupport(error: any, origin: string) {
    log(getSupportMessage(error, origin));
}

function getSupportMessage(error: any, origin: string) {
    return getTreatMessage("Need Support on:", error, origin);
}

function getTreatMessage(prefix: string, error: any, origin: string) {
    var result = prefix + (error ? " " + error.toString() : "");
    if (error.response && error.response.data) {
        var errorData = error.response.data;
        if (!(typeof errorData == "string" || errorData instanceof String)) {
            errorData = JSON.stringify(errorData);
        }
        result += " - Data: " + errorData;
    } else {
        if (!(typeof error == "string" || error instanceof String)) {
            result += " - Data: " + JSON.stringify(error);
        }
    }
    if (origin) {
        result += " - Origin: " + origin;
    }
    const stack = (new Error("")).stack;
    if (stack) {
        result += " - Stack: " + stack;
    }
    return result;
}

function toggleDevTools() {
    try {
        getDeskAPI().send("toggleDevTools");
    } catch(e) {
        logError(e, "{qinpel-res}(ErrCode-000001)");
    }
}

export const QinHead = {
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