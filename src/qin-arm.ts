import { QinPoint } from "./qin-head";
import { QinSkin } from "./qin-skin";

export class QinEvent {
  private _origin: HTMLElement;
  private _start: boolean;
  private _event: KeyboardEvent | MouseEvent | TouchEvent = null;
  private _point: QinPoint = null;
  private _stop: boolean = false;

  public constructor(origin: HTMLElement, isStart: boolean, event: KeyboardEvent | MouseEvent | TouchEvent) {
    this._origin = origin;
    this._start = isStart;
    this._event = event;
    this._point = makeEventPointer(isStart, getEventPoint(event));
  }

  public get isStart(): boolean {
    return this._start;
  }

  public get fromOrigin(): any {
    return this._origin;
  }

  public get fromTarget(): any {
    if (this._event) {
      return this._event.target;
    }
    return null;
  }

  public get fromTyping(): boolean {
    return this._event instanceof KeyboardEvent;
  }

  public get fromPointing(): boolean {
    if (getEventPoint(this._event)) {
      return true;
    }
    return false;
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
    let event = getEventPoint(this._event);
    if (event) {
      return isEventPointerDouble(this._start, event);
    }
    return false;
  }

  public get isLong(): boolean {
    let event = getEventPoint(this._event);
    if (event) {
      return isEventPointerLong(this._start, event);
    }
    return false;
  }

  public get point(): QinPoint {
    return this._point;
  }

  public get pointX(): number {
    if (window.MouseEvent && this._event instanceof MouseEvent) {
      return this._event.clientX;
    } else if (window.TouchEvent && this._event instanceof TouchEvent) {
      if (this._event.touches.length > 0) {
        let index = (this._event.touches.length / 2) | 0;
        return this._event.touches[index].clientX;
      }
    }
    return null;
  }

  public get pointY(): number {
    if (window.MouseEvent && this._event instanceof MouseEvent) {
      return this._event.clientY;
    } else if (window.TouchEvent && this._event instanceof TouchEvent) {
      if (this._event.touches.length > 0) {
        let index = (this._event.touches.length / 2) | 0;
        return this._event.touches[index].clientY;
      }
    }
    return null;
  }

  public get isFirstButton(): boolean {
    if (window.MouseEvent && this._event instanceof MouseEvent) {
      return isFirstButton(this._event);
    }
    return false;
  }

  public get isMiddleButton(): boolean {
    if (window.MouseEvent && this._event instanceof MouseEvent) {
      return isMiddleButton(this._event);
    }
    return false;
  }

  public get isSecondButton(): boolean {
    if (window.MouseEvent && this._event instanceof MouseEvent) {
      return isSecondButton(this._event);
    }
    return false;
  }

  public get isOneFinger(): boolean {
    if (window.TouchEvent && this._event instanceof TouchEvent) {
      return isOneFinger(this._event);
    }
    return false;
  }

  public get isTwoFingers(): boolean {
    if (window.TouchEvent && this._event instanceof TouchEvent) {
      return isTwoFingers(this._event);
    }
    return false;
  }

  public get isThreeFingers(): boolean {
    if (window.TouchEvent && this._event instanceof TouchEvent) {
      return isThreeFingers(this._event);
    }
    return false;
  }

  public get isFourFingers(): boolean {
    if (window.TouchEvent && this._event instanceof TouchEvent) {
      return isFourFingers(this._event);
    }
    return false;
  }

  public get isPrimary(): boolean {
    if (this._start) {
      return false;
    }
    if (window.KeyboardEvent && this._event instanceof KeyboardEvent) {
      return isPrimaryKey(this._event);
    } else if (
      (window.MouseEvent && this._event instanceof MouseEvent) ||
      (window.TouchEvent && this._event instanceof TouchEvent)
    ) {
      return isPrimaryPoint(this._event);
    }
    return false;
  }

  public get isPrimaryKey(): boolean {
    if (this._start) {
      return false;
    }
    if (window.KeyboardEvent && this._event instanceof KeyboardEvent) {
      return isPrimaryKey(this._event);
    }
    return false;
  }
  
  public get isPrimaryPoint(): boolean {
    if (this._start) {
      return false;
    }
    if (
      (window.MouseEvent && this._event instanceof MouseEvent) ||
      (window.TouchEvent && this._event instanceof TouchEvent)
    ) {
      return isPrimaryPoint(this._event);
    }
    return false;
  }

  public get isAuxiliary(): boolean {
    if (this._start) {
      return false;
    }
    if (window.KeyboardEvent && this._event instanceof KeyboardEvent) {
      return isAuxiliaryKey(this._event);
    } else if (
      (window.MouseEvent && this._event instanceof MouseEvent) ||
      (window.TouchEvent && this._event instanceof TouchEvent)
    ) {
      return isAuxiliaryPoint(this._event);
    }
    return false;
  }

  public get isAuxiliaryKey(): boolean {
    if (this._start) {
      return false;
    }
    if (window.KeyboardEvent && this._event instanceof KeyboardEvent) {
      return isAuxiliaryKey(this._event);
    }
    return false;
  }

  

  public get isAuxiliaryPoint(): boolean {
    if (this._start) {
      return false;
    }
    if (
      (window.MouseEvent && this._event instanceof MouseEvent) ||
      (window.TouchEvent && this._event instanceof TouchEvent)
    ) {
      return isAuxiliaryPoint(this._event);
    }
    return false;
  }

  public get isSecondary(): boolean {
    if (this._start) {
      return false;
    }
    if (window.KeyboardEvent && this._event instanceof KeyboardEvent) {
      return isSecondaryKey(this._event);
    } else if (
      (window.MouseEvent && this._event instanceof MouseEvent) ||
      (window.TouchEvent && this._event instanceof TouchEvent)
    ) {
      return isSecondaryPoint(this._event);
    }
    return false;
  }

  public get isSecondaryKey(): boolean {
    if (this._start) {
      return false;
    }
    if (window.KeyboardEvent && this._event instanceof KeyboardEvent) {
      return isSecondaryKey(this._event);
    }
    return false;
  }

  public get isSecondaryPoint(): boolean {
    if (this._start) {
      return false;
    }
    if (
      (window.MouseEvent && this._event instanceof MouseEvent) ||
      (window.TouchEvent && this._event instanceof TouchEvent)
    ) {
      return isSecondaryPoint(this._event);
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

type QinPointerCaller = (event?: MouseEvent | TouchEvent) => void | boolean;

export class QinPointerCalls {
  onDouble?: QinPointerCaller;
  onLong?: QinPointerCaller;
  onStart?: QinPointerCaller;
  onMove?: QinPointerCaller;
  onEnd?: QinPointerCaller;
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

function getEventKey(ev: KeyboardEvent | MouseEvent | TouchEvent): KeyboardEvent {
  if (window.KeyboardEvent && ev instanceof KeyboardEvent) {
    return ev;
  }
  return null;
}

function getEventPoint(
  ev: KeyboardEvent | MouseEvent | TouchEvent
): MouseEvent | TouchEvent {
  if (window.MouseEvent && ev instanceof MouseEvent) {
    return ev;
  }
  if (window.TouchEvent && ev instanceof TouchEvent) {
    return ev;
  }
  return null;
}

var lastEventPointer: MouseEvent | TouchEvent = null;

function makeEventPointer(isStart: boolean, ev: MouseEvent | TouchEvent): QinPoint {
  if (!ev) {
    return null;
  }
  const result = {
    posX: 0,
    posY: 0,
  };
  if (window.MouseEvent && ev instanceof MouseEvent) {
    if (ev.clientX || ev.clientY) {
      result.posX = ev.clientX;
      result.posY = ev.clientY;
    }
  } else if (window.TouchEvent && ev instanceof TouchEvent) {
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

function isEventPointerDouble(isStart: boolean, ev: MouseEvent | TouchEvent): boolean {
  if (!isStart || lastEventPointer == null || ev == null) {
    return false;
  }
  const timeDif = ev.timeStamp - lastEventPointer.timeStamp;
  return timeDif < 450;
}

function isEventPointerLong(isStart: boolean, ev: MouseEvent | TouchEvent): boolean {
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

function isFirstButton(ev: MouseEvent): boolean {
  return ev?.button == 0;
}

function isMiddleButton(ev: MouseEvent): boolean {
  return ev?.button == 1;
}

function isSecondButton(ev: MouseEvent): boolean {
  return ev?.button == 2;
}

function isOneFinger(ev: TouchEvent): boolean {
  return ev?.touches.length == 1;
}

function isTwoFingers(ev: TouchEvent): boolean {
  return ev?.touches.length == 2;
}

function isThreeFingers(ev: TouchEvent): boolean {
  return ev?.touches.length == 3;
}

function isFourFingers(ev: TouchEvent): boolean {
  return ev?.touches.length == 4;
}

function isPrimaryKey(ev: KeyboardEvent): boolean {
  return isKeyEnter(ev);
}

function isAuxiliaryKey(ev: KeyboardEvent): boolean {
  return ev.ctrlKey && ev.altKey && isKeySpace(ev);
}

function isSecondaryKey(ev: KeyboardEvent): boolean {
  return ev.ctrlKey && !ev.altKey && isKeySpace(ev);
}

function isPrimaryPoint(ev: MouseEvent | TouchEvent): boolean {
  if (window.MouseEvent && ev instanceof MouseEvent) {
    return isFirstButton(ev);
  } else if (window.TouchEvent && ev instanceof TouchEvent) {
    return isOneFinger(ev);
  }
  return false;
}

function isAuxiliaryPoint(ev: MouseEvent | TouchEvent): boolean {
  if (window.MouseEvent && ev instanceof MouseEvent) {
    return isMiddleButton(ev);
  } else if (window.TouchEvent && ev instanceof TouchEvent) {
    return isThreeFingers(ev);
  }
  return false;
}

function isSecondaryPoint(ev: MouseEvent | TouchEvent): boolean {
  if (window.MouseEvent && ev instanceof MouseEvent) {
    return isSecondButton(ev);
  } else if (window.TouchEvent && ev instanceof TouchEvent) {
    return isTwoFingers(ev);
  }
  return false;
}

function addAction(origin: HTMLElement, action: QinAction) {
  origin.addEventListener("keydown", actKeyDown);
  origin.addEventListener("keyup", actKeyUp);
  origin.addEventListener("mousedown", actMouseDown);
  origin.addEventListener("mouseup", actMouseUp);
  origin.addEventListener("touchstart", actTouchStart);
  origin.addEventListener("touchend", actTouchEnd);

  function actKeyDown(ev: KeyboardEvent) {
    let qinEvent = new QinEvent(origin, true, ev);
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return true;
    }
  }

  function actKeyUp(ev: KeyboardEvent) {
    let qinEvent = new QinEvent(origin, false, ev);
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return true;
    }
  }

  function actMouseDown(ev: MouseEvent) {
    let qinEvent = new QinEvent(origin, true, ev);
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return true;
    }
  }

  function actMouseUp(ev: MouseEvent) {
    let qinEvent = new QinEvent(origin, false, ev);
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return true;
    }
  }

  function actTouchStart(ev: TouchEvent) {
    let qinEvent = new QinEvent(origin, true, ev);
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return true;
    }
  }

  function actTouchEnd(ev: TouchEvent) {
    let qinEvent = new QinEvent(origin, false, ev);
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return true;
    }
  }
}

function addActionPrimary(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isPrimary) {
      action(qinEvent);
    }
  });
}

function addActionPrimaryKey(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isPrimaryKey) {
      action(qinEvent);
    }
  });
}

function addActionPrimaryPoint(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isPrimaryPoint) {
      action(qinEvent);
    }
  });
}

function addActions(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addAction(element, action);
  }
}

function addActionsPrimary(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionPrimary(element, action);
  }
}

function addActionsPrimaryKey(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionPrimary(element, action);
  }
}

function addActionsPrimaryPoint(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionPrimary(element, action);
  }
}

function addMover(
  sources: HTMLElement[],
  target: HTMLElement,
  dragCalls?: QinPointerCalls
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
  dragCalls?: QinPointerCalls
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
    target.style.width = (frameDragFinalWidth > 0 ? frameDragFinalWidth : 0) + "px";
    target.style.height = (frameDragFinalHeight > 0 ? frameDragFinalHeight : 0) + "px";
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

function addScroller(target: HTMLElement, dragCalls?: QinPointerCalls) {
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
  getEventKey,
  getEventPoint,
  makeEventPointer,
  isEventPointerDouble,
  isEventPointerLong,
  isKeyInList,
  isKeyEnter,
  isKeySpace,
  isFirstButton,
  isMiddleButton,
  isSecondButton,
  isOneFinger,
  isTwoFingers,
  isThreeFingers,
  isFourFingers,
  isPrimaryPoint,
  isAuxiliaryPoint,
  isSecondaryPoint,
  addAction,
  addActionPrimary,
  addActionPrimaryKey,
  addActionPrimaryPoint,
  addActions,
  addActionsPrimary,
  addActionsPrimaryKey,
  addActionsPrimaryPoint,
  addMover,
  addResizer,
  addScroller,
};
