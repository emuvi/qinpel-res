export declare const QinSoul: {
    arm: {
        stopEvent: (event: any) => boolean;
        makeEventPointer: (isDown: boolean, ev: MouseEvent | TouchEvent) => import("./qin-head").QinPoint;
        isEventPointerDouble: (isDown: boolean, ev: MouseEvent | TouchEvent) => boolean;
        isEventPointerLong: (isDown: boolean, ev: MouseEvent | TouchEvent) => boolean;
        isKeyInList: (ev: KeyboardEvent, list: string[]) => boolean;
        isKeyEnter: (ev: KeyboardEvent) => boolean;
        isKeySpace: (ev: KeyboardEvent) => boolean;
        addKeyAction: (element: HTMLElement, action: import("./qin-arm").QinAction) => void;
        addAction: (element: HTMLElement, action: import("./qin-arm").QinAction) => void;
        addMover: (sources: HTMLElement[], target: HTMLElement, dragCalls?: import("./qin-arm").QinDragCalls) => void;
        addResizer: (sources: HTMLElement[], target: HTMLElement, dragCalls?: import("./qin-arm").QinDragCalls) => void;
        addScroller: (target: HTMLElement, dragCalls?: import("./qin-arm").QinDragCalls) => void;
    };
    body: {
        getTextLines: (fromText: string) => string[];
        getCSVRows: (fromText: string, names?: string[]) => string[][] | object[];
        maskSpecialChars: (fromText: string) => string;
        unmaskSpecialChars: (fromText: string) => string;
    };
    foot: {
        getLocation: () => string;
        isLocalHost: () => boolean;
        getSeparator: (ofPath: string) => string;
        getPathJoin: (pathA: string, pathB: string) => string;
        getRoot: (path: string) => string;
        getStem: (path: string) => string;
        getFileExtension: (name: string) => string;
        isFileApp: (extension: string) => boolean;
        isFileCmd: (extension: string) => boolean;
        isFileExec: (extension: string) => boolean;
        isFileImage: (extension: string) => boolean;
        isFileVector: (extension: string) => boolean;
        isFileMovie: (extension: string) => boolean;
        isFileMusic: (extension: string) => boolean;
        isFileZipped: (extension: string) => boolean;
    };
    head: {
        getDeskAPI: () => any;
        getLogged: () => string[];
        log: (message: string) => void;
        logError: (error: any, origin: string) => void;
        getErrorMessage: (error: any, origin: string) => string;
        logWarning: (error: any, origin: string) => void;
        getWarningMessage: (error: any, origin: string) => string;
        logSupport: (error: any, origin: string) => void;
        getSupportMessage: (error: any, origin: string) => string;
        toggleDevTools: () => void;
    };
    skin: {
        styles: {
            ColorBack: string;
            ColorMenu: string;
            ColorFont: string;
            FontName: string;
            FontSize: string;
        };
        styleAsBody: (el: HTMLElement) => void;
        styleAsEdit: (el: HTMLElement) => void;
        styleMaxSizeForNotOverFlow: (el: HTMLElement, parent?: HTMLElement) => void;
        styleSize: (el: HTMLElement, size?: import("./qin-head").QinDimension | import("./qin-head").QinGrandeur) => void;
        styleFlexMax: (el: HTMLElement) => void;
        styleFlexMin: (el: HTMLElement) => void;
        getWindowSize: () => import("./qin-head").QinDimension;
        getWindowSizeStyle: () => import("./qin-head").QinGrandeur;
        hideAllIFrames: () => void;
        showAllIFrames: () => void;
        disableSelection: (element: HTMLElement) => void;
        clearSelection: () => void;
        isElementVisibleInScroll: (element: HTMLElement) => boolean;
        getDimensionSize: (size: import("./qin-head").QinGrandeur) => import("./qin-head").QinDimension;
        getDimensionSmall: () => import("./qin-head").QinDimension;
        getDimensionMedium: () => import("./qin-head").QinDimension;
        getDimensionLarge: () => import("./qin-head").QinDimension;
    };
};
//# sourceMappingURL=qin-soul.d.ts.map