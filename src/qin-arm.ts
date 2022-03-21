import { QinPoint } from "./qin-head";
import { QinSkin } from "./qin-skin";

export class QinEvent {
  private _start: boolean;
  private _event: KeyboardEvent | MouseEvent | TouchEvent = null;
  private _point: QinPoint = null;
  private _stop: boolean = false;

  public constructor(
    isStart: boolean,
    event: KeyboardEvent | MouseEvent | TouchEvent
  ) {
    this._start = isStart;
    this._event = event;
    if (event instanceof MouseEvent || event instanceof TouchEvent) {
      this._point = makeEventPointer(isStart, event);
    }
  }

  public get isStart(): boolean {
    return this._start;
  }

  public get fromOrigin(): any {
    if (this._event) {
      return this._event.target;
    }
    return null;
  }

  public get fromTyping(): boolean {
    return this._event instanceof KeyboardEvent;
  }

  public get fromPointing(): boolean {
    return (
      this._event instanceof MouseEvent || this._event instanceof TouchEvent
    );
  }

  public get hasAlt(): boolean {
    return this._event?.altKey;
  }

  public get hasCtrl(): boolean {
    return this._event?.ctrlKey;
  }

  public get hasShift(): boolean {
    return this._event?.shiftKey;
  }

  public get hasMeta(): boolean {
    return this._event?.metaKey;
  }

  public get keyTyped(): string {
    if (this._event instanceof KeyboardEvent) {
      return this._event.key;
    }
    return null;
  }

  public get isEnter(): boolean {
    if (this._event instanceof KeyboardEvent) {
      return isKeyEnter(this._event);
    }
    return false;
  }

  public get isEscape(): boolean {
    if (this._event instanceof KeyboardEvent) {
      return isKeyEscape(this._event);
    }
    return false;
  }

  public get isSpace(): boolean {
    if (this._event instanceof KeyboardEvent) {
      return isKeySpace(this._event);
    }
    return false;
  }

  public get isDouble(): boolean {
    if (
      this._event instanceof MouseEvent ||
      this._event instanceof TouchEvent
    ) {
      return isEventPointerDouble(this._start, this._event);
    }
    return false;
  }

  public get isLong(): boolean {
    if (
      this._event instanceof MouseEvent ||
      this._event instanceof TouchEvent
    ) {
      return isEventPointerLong(this._start, this._event);
    }
    return false;
  }

  public get point(): QinPoint {
    return this._point;
  }

  public get pointX(): number {
    if (this._event instanceof MouseEvent) {
      return this._event.clientX;
    } else if (this._event instanceof TouchEvent) {
      if (this._event.touches.length > 0) {
        let index = (this._event.touches.length / 2) | 0;
        return this._event.touches[index].clientX;
      }
    }
    return null;
  }

  public get pointY(): number {
    if (this._event instanceof MouseEvent) {
      return this._event.clientY;
    } else if (this._event instanceof TouchEvent) {
      if (this._event.touches.length > 0) {
        let index = (this._event.touches.length / 2) | 0;
        return this._event.touches[index].clientY;
      }
    }
    return null;
  }

  public get isFirstButton(): boolean {
    if (this._event instanceof MouseEvent) {
      return this._event.button == 0;
    }
    return false;
  }

  public get isMiddleButton(): boolean {
    if (this._event instanceof MouseEvent) {
      return this._event.button == 1;
    }
    return false;
  }

  public get isSecondButton(): boolean {
    if (this._event instanceof MouseEvent) {
      return this._event.button == 2;
    }
    return false;
  }

  public get isOneFinger(): boolean {
    if (this._event instanceof TouchEvent) {
      return this._event.touches.length == 1;
    }
    return false;
  }
  public get isTwoFingers(): boolean {
    if (this._event instanceof TouchEvent) {
      return this._event.touches.length == 2;
    }
    return false;
  }

  public get isThreeFingers(): boolean {
    if (this._event instanceof TouchEvent) {
      return this._event.touches.length == 3;
    }
    return false;
  }

  public get isFourFingers(): boolean {
    if (this._event instanceof TouchEvent) {
      return this._event.touches.length == 4;
    }
    return false;
  }

  public get isPrimary(): boolean {
    if (this._start) {
      return false;
    }
    if (this.fromTyping) {
      return this.isEnter || this.isSpace;
    } else if (this.fromPointing) {
      return this.isFirstButton || this.isOneFinger;
    }
    return false;
  }

  public get isAuxiliary(): boolean {
    if (this._start) {
      return false;
    }
    if (this.fromTyping) {
      return this.hasCtrl && this.hasAlt && this.isSpace;
    } else if (this.fromPointing) {
      return this.isMiddleButton || this.isThreeFingers;
    }
    return false;
  }

  public get isSecondary(): boolean {
    if (this._start) {
      return false;
    }
    if (this.fromTyping) {
      return this.hasCtrl && !this.hasAlt && this.isSpace;
    } else if (this.fromPointing) {
      return this.isSecondButton || this.isTwoFingers;
    }
    return false;
  }

  public get stop(): boolean {
    return this._stop;
  }

  public consumed() {
    this._stop = true;
  }
}

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

function makeEventPointer(
  isStart: boolean,
  ev: MouseEvent | TouchEvent
): QinPoint {
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
    if (ev.touches && this._event.touches.length > 1) {
      let index = Math.floor(this._event.touches.length / 2);
      result.posX = ev.touches[index].clientX;
      result.posY = ev.touches[index].clientY;
    }
  }
  if (isStart) {
    lastEventPointer = ev;
  }
  return result;
}

function isEventPointerDouble(
  isStart: boolean,
  ev: MouseEvent | TouchEvent
): boolean {
  if (!isStart || lastEventPointer == null || ev == null) {
    return false;
  }
  const timeDif = ev.timeStamp - lastEventPointer.timeStamp;
  return timeDif < 450;
}

function isEventPointerLong(
  isStart: boolean,
  ev: MouseEvent | TouchEvent
): boolean {
  if (!isStart || lastEventPointer == null || ev == null) {
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
  element.addEventListener("keydown", actKeyDown);
  element.addEventListener("keyup", actKeyUp);
  element.addEventListener("mousedown", actMouseDown);
  element.addEventListener("mouseup", actMouseUp);
  element.addEventListener("touchstart", actTouchDown);
  element.addEventListener("touchend", actTouchUp);

  function actKeyDown(ev: KeyboardEvent) {
    let qinEvent = new QinEvent(true, ev);
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return true;
    }
  }

  function actKeyUp(ev: KeyboardEvent) {
    let qinEvent = new QinEvent(false, ev);
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return true;
    }
  }

  function actMouseDown(ev: MouseEvent) {
    let qinEvent = new QinEvent(true, ev);
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return true;
    }
  }

  function actMouseUp(ev: MouseEvent) {
    let qinEvent = new QinEvent(false, ev);
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return true;
    }
  }

  function actTouchDown(ev: TouchEvent) {
    let qinEvent = new QinEvent(true, ev);
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return true;
    }
  }

  function actTouchUp(ev: TouchEvent) {
    let qinEvent = new QinEvent(false, ev);
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return true;
    }
  }
}

function addActionMain(element: HTMLElement, action: QinAction) {
  element.onkeyup = actKeyUp;
  element.onmouseup = actMouseUp;
  element.ontouchend = actTouchEnd;

  function actKeyUp(ev: KeyboardEvent) {
    let qinEvent = new QinEvent(false, ev);
    if (qinEvent.isPrimary) {
      action(qinEvent);
      return stopEvent(ev);
    }
  }

  function actMouseUp(ev: MouseEvent) {
    let qinEvent = new QinEvent(false, ev);
    if (qinEvent.isPrimary) {
      action(qinEvent);
      return stopEvent(ev);
    }
  }

  function actTouchEnd(ev: TouchEvent) {
    let qinEvent = new QinEvent(false, ev);
    if (qinEvent.isPrimary) {
      action(qinEvent);
      return stopEvent(ev);
    }
  }
}

function putActionProxy(destiny: HTMLElement, origins: HTMLInputElement[]) {
  for (const origin of origins) {
    origin.addEventListener("keydown", (e) => {
      destiny.onkeydown(e);
    });
    origin.addEventListener("keyup", (e) => {
      destiny.onkeyup(e);
    });
    origin.addEventListener("mousedown", (e) => {
      destiny.onmousedown(e);
    });
    origin.addEventListener("mouseup", (e) => {
      destiny.onmouseup(e);
    });
    origin.addEventListener("touchstart", (e) => {
      destiny.ontouchstart(e);
    });
    origin.addEventListener("touchend", (e) => {
      destiny.ontouchend(e);
    });
  }
}

function addMover(
  sources: HTMLElement[],
  target: HTMLElement,
  dragCalls?: QinDragCalls
) {
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
    if (dragCalls && dragCalls.onStart) {
      dragCalls.onStart();
    }
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
    if (dragCalls && dragCalls.onMove) {
      dragCalls.onMove();
    }
    return stopEvent(ev);
  }

  function onMoverClose(ev: MouseEvent | TouchEvent) {
    document.ontouchmove = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.onmouseup = null;
    QinSkin.showAllIFrames();
    QinSkin.clearSelection();
    if (dragCalls && dragCalls.onEnd) {
      dragCalls.onEnd();
    }
    return stopEvent(ev);
  }
}

function addResizer(
  sources: HTMLElement[],
  target: HTMLElement,
  dragCalls?: QinDragCalls
) {
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
    if (dragCalls && dragCalls.onStart) {
      dragCalls.onStart();
    }
    return stopEvent(ev);
  }

  function onResizerMove(ev: MouseEvent | TouchEvent) {
    const pointer = makeEventPointer(false, ev);
    var frameDragDifX = pointer.posX - dragInitEventX;
    var frameDragDifY = pointer.posY - dragInitEventY;
    var frameDragFinalWidth = dragInitWidth + frameDragDifX;
    var frameDragFinalHeight = dragInitHeight + frameDragDifY;
    target.style.width =
      (frameDragFinalWidth > 0 ? frameDragFinalWidth : 0) + "px";
    target.style.height =
      (frameDragFinalHeight > 0 ? frameDragFinalHeight : 0) + "px";
    if (dragCalls && dragCalls.onMove) {
      dragCalls.onMove();
    }
    return stopEvent(ev);
  }

  function onResizerClose(ev: MouseEvent | TouchEvent) {
    document.ontouchmove = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.onmouseup = null;
    QinSkin.showAllIFrames();
    QinSkin.clearSelection();
    if (dragCalls && dragCalls.onEnd) {
      dragCalls.onEnd();
    }
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
    if (dragCalls && dragCalls.onStart) {
      dragCalls.onStart();
    }
    return stopEvent(ev);
  }

  function onScrollerMove(ev: MouseEvent | TouchEvent) {
    const pointer = makeEventPointer(false, ev);
    var dragDifX = pointer.posX - dragInitX;
    var dragDifY = pointer.posY - dragInitY;
    var dragNewX = dragScrollX - dragDifX;
    var dragNewY = dragScrollY - dragDifY;
    target.scrollTo(dragNewX, dragNewY);
    if (dragCalls && dragCalls.onMove) {
      dragCalls.onMove();
    }
    return stopEvent(ev);
  }

  function onScrollerClose(ev: MouseEvent | TouchEvent) {
    document.ontouchmove = null;
    document.ontouchend = null;
    document.onmousemove = null;
    document.onmouseup = null;
    QinSkin.showAllIFrames();
    QinSkin.clearSelection();
    if (dragCalls && dragCalls.onEnd) {
      dragCalls.onEnd();
    }
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
  addActionMain,
  putActionProxy,
  addMover,
  addResizer,
  addScroller,
};
