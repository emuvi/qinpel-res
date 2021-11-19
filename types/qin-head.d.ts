export declare class QinPoint {
    posX: number;
    posY: number;
}
export declare class QinDimension {
    width: number;
    height: number;
}
export declare class QinBounds {
    posX: number;
    posY: number;
    width: number;
    height: number;
}
export declare enum QinGrandeur {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}
declare function getDeskAPI(): any;
declare function getLogged(): string[];
declare function log(message: string): void;
declare function logError(error: any, origin: string): void;
declare function getErrorMessage(error: any, origin: string): string;
declare function logWarning(error: any, origin: string): void;
declare function getWarningMessage(error: any, origin: string): string;
declare function logSupport(error: any, origin: string): void;
declare function getSupportMessage(error: any, origin: string): string;
declare function toggleDevTools(): void;
export declare const QinHead: {
    getDeskAPI: typeof getDeskAPI;
    getLogged: typeof getLogged;
    log: typeof log;
    logError: typeof logError;
    getErrorMessage: typeof getErrorMessage;
    logWarning: typeof logWarning;
    getWarningMessage: typeof getWarningMessage;
    logSupport: typeof logSupport;
    getSupportMessage: typeof getSupportMessage;
    toggleDevTools: typeof toggleDevTools;
};
export {};
//# sourceMappingURL=qin-head.d.ts.map