import { QinPoint } from "./qin-head";
export declare class QinDragCalls {
    onDouble?: CallableFunction;
    onLong?: CallableFunction;
    onStart?: CallableFunction;
    onMove?: CallableFunction;
    onEnd?: CallableFunction;
}
export declare class QinEvent {
    fromOrigin: any;
    fromTyping: boolean;
    fromPointing: boolean;
    hasAlt: boolean;
    hasCtrl: boolean;
    hasShift: boolean;
    hasMeta: boolean;
    isEnter: boolean;
    isEscape: boolean;
    isSpace: boolean;
    isDouble: boolean;
    isLong: boolean;
    keyTyped: string;
    pointOnX: number;
    pointOnY: number;
    isFirstButton: boolean;
    isMiddleButton: boolean;
    isSecondButton: boolean;
    isOneFinger: boolean;
    isTwoFingers: boolean;
    isThreeFingers: boolean;
    stopEvent: boolean;
    setFromKeyboard(ev: KeyboardEvent): QinEvent;
    setFromMouse(ev: MouseEvent): QinEvent;
    setFromTouch(ev: TouchEvent): QinEvent;
    stop(): void;
    isPrimary(): boolean;
    isAuxiliary(): boolean;
    isSecondary(): boolean;
}
export declare type QinAction = (event: QinEvent) => void;
declare function stopEvent(event: any): boolean;
declare function makeEventPointer(isDown: boolean, ev: MouseEvent | TouchEvent): QinPoint;
declare function isEventPointerDouble(isDown: boolean, ev: MouseEvent | TouchEvent): boolean;
declare function isEventPointerLong(isDown: boolean, ev: MouseEvent | TouchEvent): boolean;
declare function isKeyInList(ev: KeyboardEvent, list: string[]): boolean;
declare function isKeyEnter(ev: KeyboardEvent): boolean;
declare function isKeySpace(ev: KeyboardEvent): boolean;
declare function addKeyAction(element: HTMLElement, action: QinAction): void;
declare function addAction(element: HTMLElement, action: QinAction): void;
declare function addMover(sources: HTMLElement[], target: HTMLElement, dragCalls?: QinDragCalls): void;
declare function addResizer(sources: HTMLElement[], target: HTMLElement, dragCalls?: QinDragCalls): void;
declare function addScroller(target: HTMLElement, dragCalls?: QinDragCalls): void;
export declare const QinArm: {
    stopEvent: typeof stopEvent;
    makeEventPointer: typeof makeEventPointer;
    isEventPointerDouble: typeof isEventPointerDouble;
    isEventPointerLong: typeof isEventPointerLong;
    isKeyInList: typeof isKeyInList;
    isKeyEnter: typeof isKeyEnter;
    isKeySpace: typeof isKeySpace;
    addKeyAction: typeof addKeyAction;
    addAction: typeof addAction;
    addMover: typeof addMover;
    addResizer: typeof addResizer;
    addScroller: typeof addScroller;
};
export {};
//# sourceMappingURL=qin-arm.d.ts.map