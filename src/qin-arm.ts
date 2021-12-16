import { QinPoint } from "./qin-head";
import { QinSkin } from "./qin-skin";

export class QinEvent {

    public fromOrigin: any = null;
    public fromTyping: boolean = false;
    public fromPointing: boolean = false;
    public hasAlt: boolean = false;
    public hasCtrl: boolean = false;
    public hasShift: boolean = false;
    public hasMeta: boolean = false;
    public isEnter: boolean = false;
    public isEscape: boolean = false;
    public isSpace: boolean = false;
    public isDouble: boolean = false; // TODO
    public isLong: boolean = false;   // TODO
    public keyTyped: string = "";
    public pointOnX: number = -1;
    public pointOnY: number = -1;
    public isFirstButton: boolean = false;
    public isMiddleButton: boolean = false;
    public isSecondButton: boolean = false;
    public isOneFinger: boolean = false;
    public isTwoFingers: boolean = false;
    public isThreeFingers: boolean = false;
    public stopEvent: boolean = false;

    setFromKeyboard(ev: KeyboardEvent): QinEvent {
        this.fromOrigin = ev.target;
        this.fromTyping = true;
        this.hasAlt = ev.altKey;
        this.hasCtrl = ev.ctrlKey;
        this.hasShift = ev.shiftKey;
        this.hasMeta = ev.metaKey;
        this.isEnter = isKeyEnter(ev);
        this.isEscape = isKeyEscape(ev);
        this.isSpace = isKeySpace(ev);
        this.keyTyped = ev.key;
        return this;
    }

    setFromMouse(ev: MouseEvent): QinEvent {
        this.fromOrigin = ev.target;
        this.fromPointing = true;
        this.hasAlt = ev.altKey;
        this.hasCtrl = ev.ctrlKey;
        this.hasShift = ev.shiftKey;
        this.hasMeta = ev.metaKey;
        this.pointOnX = ev.clientX;
        this.pointOnY = ev.clientY;
        this.isFirstButton = ev.button == 0;
        this.isMiddleButton = ev.button == 1;
        this.isSecondButton = ev.button == 2;
        return this;
    }

    setFromTouch(ev: TouchEvent): QinEvent {
        this.fromOrigin = ev.target;
        this.fromPointing = true;
        this.hasAlt = ev.altKey;
        this.hasCtrl = ev.ctrlKey;
        this.hasShift = ev.shiftKey;
        this.hasMeta = ev.metaKey;
        if (ev.touches.length > 0) {
            let index = (ev.touches.length / 2) | 0;
            this.pointOnX = ev.touches[index].clientX;
            this.pointOnY = ev.touches[index].clientY;
        }
        this.isOneFinger = ev.touches.length == 1;
        this.isTwoFingers = ev.touches.length == 2;
        this.isThreeFingers = ev.touches.length == 3;
        return this;
    }

    public stop() {
        this.stopEvent = true;
    }

    public isPrimary(): boolean {
        if (this.fromTyping) {
            return this.isEnter || this.isSpace;
        } else if (this.fromPointing) {
            return this.isFirstButton || this.isOneFinger;
        }
        return false;
    }

    public isAuxiliary(): boolean {
        if (this.fromTyping) {
            return this.hasCtrl && this.hasAlt && this.isSpace;
        } else if (this.fromPointing) {
            return this.isMiddleButton || this.isThreeFingers;
        }
        return false;
    }

    public isSecondary(): boolean {
        if (this.fromTyping) {
            return this.hasCtrl && !this.hasAlt && this.isSpace;
        } else if (this.fromPointing) {
            return this.isSecondButton || this.isTwoFingers;
        }
        return false;
    }

};

export type QinAction = (event: QinEvent) => void;

export type QinWaiter = (result: any) => void;

export class QinWaiters {

	private waiters: QinWaiter[];

	public constructor(initial?: QinWaiter[]) {
		this.waiters = initial ? initial : [];
	}

	public addWaiter(waiter: QinWaiter): QinWaiters {
        this.waiters.push(waiter);
        return this;
    }

    public hasWaiter(): boolean {
        return this.waiters.length > 0;
    }

    public sendWaiters(result: any) {
        for (const waiter of this.waiters) {
            waiter(result);
        }
    }
	
}

export class QinDragCalls {
    onDouble?: CallableFunction;
    onLong?: CallableFunction;
    onStart?: CallableFunction;
    onMove?: CallableFunction;
    onEnd?: CallableFunction;
}

function stopEvent(event: any) {
    if (event.preventDefault) {
        event.preventDefault();
    }
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    event.cancelBubble = true;
    return false;
}

var lastEventPointer: MouseEvent | TouchEvent = null;

function makeEventPointer(isDown: boolean, ev: MouseEvent | TouchEvent): QinPoint {
    const result = {
        posX: 0,
        posY: 0,
    };
    if (ev instanceof MouseEvent) {
        if (ev.clientX || ev.clientY) {
            result.posX = ev.clientX;
            result.posY = ev.clientY;
        }
    } else if (ev instanceof TouchEvent) {
        if (
            ev.touches &&
            ev.touches[0] &&
            (ev.touches[0].clientX || ev.touches[0].clientY)
        ) {
            result.posX = ev.touches[0].clientX;
            result.posY = ev.touches[0].clientY;
        }
    }
    if (isDown) {
        lastEventPointer = ev;
    }
    return result;
}

function isEventPointerDouble(isDown: boolean, ev: MouseEvent | TouchEvent): boolean {
    if (!isDown || lastEventPointer == null || ev == null) {
        return false;
    }
    const timeDif = ev.timeStamp - lastEventPointer.timeStamp;
    return timeDif < 450;
}

function isEventPointerLong(isDown: boolean, ev: MouseEvent | TouchEvent): boolean {
    if (!isDown || lastEventPointer == null || ev == null) {
        return false;
    }
    const timeDif = ev.timeStamp - lastEventPointer.timeStamp;
    return timeDif > 840;
}

function isKeyInList(ev: KeyboardEvent, list: string[]): boolean {
    let keyLower = ev.key.toLowerCase();
    return list.indexOf(keyLower) > -1;
}

function isKeyEnter(ev: KeyboardEvent): boolean {
    return isKeyInList(ev, ["enter", "return"]) || ev.keyCode === 13;
}

function isKeyEscape(ev: KeyboardEvent): boolean {
    return isKeyInList(ev, ["esc", "escape"]) || ev.keyCode === 27;
}

function isKeySpace(ev: KeyboardEvent): boolean {
    return isKeyInList(ev, [" ", "space", "spacebar"]) || ev.keyCode === 32;
}

function addAction(element: HTMLElement, action: QinAction) {
	element.addEventListener("keydown", stopEvent);
    element.addEventListener("keyup", actionKeyboard);
	element.addEventListener("mousedown", stopEvent);
    element.addEventListener("mouseup", actionMouse);
	element.addEventListener("touchstart", stopEvent);
    element.addEventListener("touchend", actionTouch);

    function actionKeyboard(ev: KeyboardEvent) {
        let qinEvent = new QinEvent().setFromKeyboard(ev);
        action(qinEvent);
        if (qinEvent.stopEvent) {
            return stopEvent(ev);
        } else {
            return true;
        }
    }

    function actionMouse(ev: MouseEvent) {
        let qinEvent = new QinEvent().setFromMouse(ev)
        action(qinEvent);
        if (qinEvent.stopEvent) {
            return stopEvent(ev);
        } else {
            return true;
        }
    }

    function actionTouch(ev: TouchEvent) {
        let qinEvent = new QinEvent().setFromTouch(ev)
        action(qinEvent);
        if (qinEvent.stopEvent) {
            return stopEvent(ev);
        } else {
            return true;
        }
    }
}

function addActionEnter(element: HTMLElement, action: QinAction) {
    element.onkeydown = actionKeyboard;

    function actionKeyboard(ev: KeyboardEvent) {
        if (isKeyEnter(ev)) {
            action(new QinEvent().setFromKeyboard(ev));
            return stopEvent(ev);
        }
    }
}

function putActionProxy(destiny: HTMLElement, origins: HTMLInputElement[]) {
    for (const origin of origins) {
        origin.addEventListener("keyup", e => {
            destiny.onkeydown(e);
        })
        origin.addEventListener("mouseup", e => {
            destiny.onmouseup(e);
        })
        origin.addEventListener("touchend", e => {
            destiny.ontouchend(e);
        })
    }
}

function addMover(sources: HTMLElement[], target: HTMLElement,
    dragCalls?: QinDragCalls) {
    var dragInitEventX = 0;
    var dragInitEventY = 0;
    var dragInitPosX = 0;
    var dragInitPosY = 0;

    for (let source of sources) {
        source.onmousedown = onMoverInit;
        source.ontouchstart = onMoverInit;
        source.ondragstart = stopEvent;
    }

    function onMoverInit(ev: MouseEvent | TouchEvent) {
        if (document.onmousemove || document.ontouchmove) {
            return;
        }
        if (dragCalls && dragCalls.onDouble && isEventPointerDouble(true, ev)) {
            dragCalls.onDouble();
            return;
        }
        if (dragCalls && dragCalls.onLong && isEventPointerLong(true, ev)) {
            dragCalls.onLong();
            return;
        }
        const pointer = makeEventPointer(true, ev);
        dragInitEventX = pointer.posX;
        dragInitEventY = pointer.posY;
        dragInitPosX = parseInt(target.style.left, 10);
        dragInitPosY = parseInt(target.style.top, 10);
        document.ontouchmove = onMoverMove;
        document.onmousemove = onMoverMove;
        document.ontouchend = onMoverClose;
        document.onmouseup = onMoverClose;
        QinSkin.hideAllIFrames();
        if (dragCalls && dragCalls.onStart) { dragCalls.onStart(); }
        return stopEvent(ev);
    }

    function onMoverMove(ev: MouseEvent | TouchEvent) {
        const pointer = makeEventPointer(false, ev);
        var dragDifX = pointer.posX - dragInitEventX;
        var dragDifY = pointer.posY - dragInitEventY;
        var dragFinalX = dragInitPosX + dragDifX;
        var dragFinalY = dragInitPosY + dragDifY;
        target.style.left = (dragFinalX > 0 ? dragFinalX : 0) + "px";
        target.style.top = (dragFinalY > 0 ? dragFinalY : 0) + "px";
        if (dragCalls && dragCalls.onMove) { dragCalls.onMove(); }
        return stopEvent(ev);
    }

    function onMoverClose(ev: MouseEvent | TouchEvent) {
        document.ontouchmove = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.onmouseup = null;
        QinSkin.showAllIFrames();
        QinSkin.clearSelection();
        if (dragCalls && dragCalls.onEnd) { dragCalls.onEnd(); }
        return stopEvent(ev);
    }

}

function addResizer(sources: HTMLElement[], target: HTMLElement,
    dragCalls?: QinDragCalls) {
    var dragInitEventX = 0;
    var dragInitEventY = 0;
    var dragInitWidth = 0;
    var dragInitHeight = 0;

    for (let source of sources) {
        source.onmousedown = onResizerInit;
        source.ontouchstart = onResizerInit;
        source.ondragstart = stopEvent;
    }

    function onResizerInit(ev: MouseEvent | TouchEvent) {
        if (document.onmousemove || document.ontouchmove) {
            return;
        }
        if (dragCalls && dragCalls.onDouble && isEventPointerDouble(true, ev)) {
            dragCalls.onDouble();
            return;
        }
        if (dragCalls && dragCalls.onLong && isEventPointerLong(true, ev)) {
            dragCalls.onLong();
            return;
        }
        const pointer = makeEventPointer(true, ev);
        dragInitEventX = pointer.posX;
        dragInitEventY = pointer.posY;
        dragInitWidth = parseInt(target.style.width, 10);
        dragInitHeight = parseInt(target.style.height, 10);
        document.ontouchmove = onResizerMove;
        document.onmousemove = onResizerMove;
        document.ontouchend = onResizerClose;
        document.onmouseup = onResizerClose;
        QinSkin.hideAllIFrames();
        if (dragCalls && dragCalls.onStart) { dragCalls.onStart(); }
        return stopEvent(ev);
    }

    function onResizerMove(ev: MouseEvent | TouchEvent) {
        const pointer = makeEventPointer(false, ev);
        var frameDragDifX = pointer.posX - dragInitEventX;
        var frameDragDifY = pointer.posY - dragInitEventY;
        var frameDragFinalWidth = dragInitWidth + frameDragDifX;
        var frameDragFinalHeight = dragInitHeight + frameDragDifY;
        target.style.width = (frameDragFinalWidth > 0 ? frameDragFinalWidth : 0) + "px";
        target.style.height =
            (frameDragFinalHeight > 0 ? frameDragFinalHeight : 0) + "px";
        if (dragCalls && dragCalls.onMove) { dragCalls.onMove(); }
        return stopEvent(ev);
    }

    function onResizerClose(ev: MouseEvent | TouchEvent) {
        document.ontouchmove = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.onmouseup = null;
        QinSkin.showAllIFrames();
        QinSkin.clearSelection();
        if (dragCalls && dragCalls.onEnd) { dragCalls.onEnd(); }
        return stopEvent(ev);
    }
}

function addScroller(target: HTMLElement, dragCalls?: QinDragCalls) {
    var dragInitX = 0;
    var dragInitY = 0;
    var dragScrollX = 0;
    var dragScrollY = 0;

    target.ondragstart = stopEvent;
    target.ontouchstart = onScrollerInit;
    target.onmousedown = onScrollerInit;

    function onScrollerInit(ev: MouseEvent | TouchEvent) {
        if (document.onmousemove || document.ontouchmove) {
            return;
        }
        if (dragCalls && dragCalls.onDouble && isEventPointerDouble(true, ev)) {
            dragCalls.onDouble();
            return;
        }
        if (dragCalls && dragCalls.onLong && isEventPointerLong(true, ev)) {
            dragCalls.onLong();
            return;
        }
        const pointer = makeEventPointer(true, ev);
        dragInitX = pointer.posX;
        dragInitY = pointer.posY;
        dragScrollX = target.scrollLeft;
        dragScrollY = target.scrollTop;
        document.ontouchmove = onScrollerMove;
        document.onmousemove = onScrollerMove;
        document.ontouchend = onScrollerClose;
        document.onmouseup = onScrollerClose;
        QinSkin.hideAllIFrames();
        if (dragCalls && dragCalls.onStart) { dragCalls.onStart(); }
        return stopEvent(ev);
    }

    function onScrollerMove(ev: MouseEvent | TouchEvent) {
        const pointer = makeEventPointer(false, ev);
        var dragDifX = pointer.posX - dragInitX;
        var dragDifY = pointer.posY - dragInitY;
        var dragNewX = dragScrollX - dragDifX;
        var dragNewY = dragScrollY - dragDifY;
        target.scrollTo(dragNewX, dragNewY);
        if (dragCalls && dragCalls.onMove) { dragCalls.onMove(); }
        return stopEvent(ev);
    }

    function onScrollerClose(ev: MouseEvent | TouchEvent) {
        document.ontouchmove = null;
        document.ontouchend = null;
        document.onmousemove = null;
        document.onmouseup = null;
        QinSkin.showAllIFrames();
        QinSkin.clearSelection();
        if (dragCalls && dragCalls.onEnd) { dragCalls.onEnd(); }
        return stopEvent(ev);
    }

}

export const QinArm = {
    stopEvent,
    makeEventPointer,
    isEventPointerDouble,
    isEventPointerLong,
    isKeyInList,
    isKeyEnter,
    isKeySpace,
    addAction,
    addActionEnter,
    putActionProxy,
    addMover,
    addResizer,
    addScroller,
};
