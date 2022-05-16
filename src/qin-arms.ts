import { QinPoint, QinSkin } from "./qin-skin";

export enum QinActionKind {
  MAIN = "MAIN",
  MIDI = "MIDI",
  MENU = "MENU",
}

export class QinEvent {
  private _origin: HTMLElement;
  private _start: boolean;
  private _eventKey: KeyboardEvent = null;
  private _eventMouse: MouseEvent = null;
  private _eventTouch: TouchEvent = null;
  private _point: QinPoint = null;
  private _stop: boolean = false;

  public constructor(origin: HTMLElement, isStart: boolean, kind: QinEventType) {
    this._origin = origin;
    this._start = isStart;
    this._eventKey = kind?.eventKey ?? null;
    this._eventMouse = kind?.eventMouse ?? null;
    this._eventTouch = kind?.eventTouch ?? null;
    if (this._eventMouse) {
      this._point = makeEventMousePoint(isStart, this._eventMouse);
    } else if (this._eventTouch) {
      this._point = makeEventTouch(isStart, this._eventTouch);
    }
  }

  public get isStart(): boolean {
    return this._start;
  }

  public get fromOrigin(): any {
    return this._origin;
  }

  public get fromTarget(): any {
    if (this._eventKey) {
      return this._eventKey.target;
    } else if (this._eventMouse) {
      return this._eventMouse.target;
    } else if (this._eventTouch) {
      return this._eventTouch.target;
    }
    return null;
  }

  public get fromTyping(): boolean {
    return !!this._eventKey;
  }

  public get fromPointing(): boolean {
    return !!this._point;
  }

  public get hasAlt(): boolean {
    if (this._eventKey) {
      return this._eventKey.altKey;
    } else if (this._eventMouse) {
      return this._eventMouse.altKey;
    } else if (this._eventTouch) {
      return this._eventTouch.altKey;
    }
    return false;
  }

  public get hasCtrl(): boolean {
    if (this._eventKey) {
      return this._eventKey.ctrlKey;
    } else if (this._eventMouse) {
      return this._eventMouse.ctrlKey;
    } else if (this._eventTouch) {
      return this._eventTouch.ctrlKey;
    }
    return false;
  }

  public get hasShift(): boolean {
    if (this._eventKey) {
      return this._eventKey.shiftKey;
    } else if (this._eventMouse) {
      return this._eventMouse.shiftKey;
    } else if (this._eventTouch) {
      return this._eventTouch.shiftKey;
    }
    return false;
  }

  public get hasMeta(): boolean {
    if (this._eventKey) {
      return this._eventKey.metaKey;
    } else if (this._eventMouse) {
      return this._eventMouse.metaKey;
    } else if (this._eventTouch) {
      return this._eventTouch.metaKey;
    }
    return false;
  }

  public get keyTyped(): string {
    if (this._eventKey) {
      return this._eventKey.key;
    }
    return null;
  }

  public get isEnter(): boolean {
    return isKeyEnter(this._eventKey);
  }

  public get isEscape(): boolean {
    return isKeyEscape(this._eventKey);
  }

  public get isSpace(): boolean {
    return isKeySpace(this._eventKey);
  }

  public get isDouble(): boolean {
    if (this._eventMouse) {
      return isEventMouseDouble(this._start, this._eventMouse);
    } else if (this._eventTouch) {
      return isEventTouchDouble(this._start, this._eventTouch);
    }
    return false;
  }

  public get isLong(): boolean {
    if (this._eventMouse) {
      return isEventMouseLong(this._start, this._eventMouse);
    } else if (this._eventTouch) {
      return isEventTouchLong(this._start, this._eventTouch);
    }
    return false;
  }

  public get point(): QinPoint {
    return this._point;
  }

  public get pointX(): number {
    return this._point?.posX;
  }

  public get pointY(): number {
    return this._point?.posY;
  }

  public get isFirstButton(): boolean {
    return isFirstButton(this._eventMouse);
  }

  public get isMiddleButton(): boolean {
    return isMiddleButton(this._eventMouse);
  }

  public get isSecondButton(): boolean {
    return isSecondButton(this._eventMouse);
  }

  public get isOneFinger(): boolean {
    return isOneFinger(this._eventTouch);
  }

  public get isTwoFingers(): boolean {
    return isTwoFingers(this._eventTouch);
  }

  public get isThreeFingers(): boolean {
    return isThreeFingers(this._eventTouch);
  }

  public get isFourFingers(): boolean {
    return isFourFingers(this._eventTouch);
  }

  public get isMain(): boolean {
    if (this._start) {
      return false;
    }
    if (this._eventKey) {
      return isMainKey(this._eventKey);
    } else if (this._eventMouse) {
      return isMainMouse(this._eventMouse);
    } else if (this._eventTouch) {
      return isMainTouch(this._eventTouch);
    }
    return false;
  }

  public get isMainKey(): boolean {
    if (this._start) {
      return false;
    }
    return isMainKey(this._eventKey);
  }

  public get isMainMouse(): boolean {
    if (this._start) {
      return false;
    }
    return isMainMouse(this._eventMouse);
  }

  public get isMainTouch(): boolean {
    if (this._start) {
      return false;
    }
    return isMainTouch(this._eventTouch);
  }

  public get isMainPoint(): boolean {
    if (this._start) {
      return false;
    }
    return isMainMouse(this._eventMouse) || isMainTouch(this._eventTouch);
  }

  public get isMidi(): boolean {
    if (this._start) {
      return false;
    }
    if (this._eventKey) {
      return isMidiKey(this._eventKey);
    } else if (this._eventMouse) {
      return isMidiMouse(this._eventMouse);
    } else if (this._eventTouch) {
      return isMidiTouch(this._eventTouch);
    }
    return false;
  }

  public get isMidiKey(): boolean {
    if (this._start) {
      return false;
    }
    return isMidiKey(this._eventKey);
  }

  public get isMidiMouse(): boolean {
    if (this._start) {
      return false;
    }
    return isMidiMouse(this._eventMouse);
  }

  public get isMidiTouch(): boolean {
    if (this._start) {
      return false;
    }
    return isMidiTouch(this._eventTouch);
  }

  public get isMidiPoint(): boolean {
    if (this._start) {
      return false;
    }
    if (this._eventMouse) {
      return isMidiMouse(this._eventMouse);
    } else if (this._eventTouch) {
      return isMidiTouch(this._eventTouch);
    }
    return false;
  }

  public get isMenu(): boolean {
    if (this._start) {
      return false;
    }
    if (this._eventKey) {
      return isMenuKey(this._eventKey);
    } else if (this._eventKey) {
      return isMenuMouse(this._eventMouse);
    } else if (this._eventKey) {
      return isMenuTouch(this._eventTouch);
    }
    return false;
  }

  public get isMenuKey(): boolean {
    if (this._start) {
      return false;
    }
    return isMenuKey(this._eventKey);
  }

  public get isMenuMouse(): boolean {
    if (this._start) {
      return false;
    }
    return isMenuMouse(this._eventMouse);
  }

  public get isMenuTouch(): boolean {
    if (this._start) {
      return false;
    }
    return isMenuTouch(this._eventTouch);
  }

  public get isMenuPoint(): boolean {
    if (this._start) {
      return false;
    }
    if (this._eventMouse) {
      return isMenuMouse(this._eventMouse);
    } else if (this._eventTouch) {
      return isMenuTouch(this._eventTouch);
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

export type QinEventType = {
  eventKey?: KeyboardEvent;
  eventMouse?: MouseEvent;
  eventTouch?: TouchEvent;
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
  return stopPropagation(event);
}

function stopPropagation(event: any) {
  if (event.stopPropagation) {
    event.stopPropagation();
  }
  event.cancelBubble = true;
  return false;
}

var lastEventMouse: MouseEvent = null;
var lastEventTouch: TouchEvent = null;

function makeEventMousePoint(isStart: boolean, ev: MouseEvent): QinPoint {
  if (!ev) {
    return null;
  }
  const result = {
    posX: 0,
    posY: 0,
  };
  if (ev.clientX || ev.clientY) {
    result.posX = ev.clientX;
    result.posY = ev.clientY;
  }
  if (isStart) {
    lastEventMouse = ev;
  }
  return result;
}

function makeEventTouch(isStart: boolean, ev: TouchEvent): QinPoint {
  if (!ev) {
    return null;
  }
  const result = {
    posX: 0,
    posY: 0,
  };
  if (ev.touches && this._event.touches.length >= 1) {
    let index = Math.floor(this._event.touches.length / 2);
    result.posX = ev.touches[index].clientX;
    result.posY = ev.touches[index].clientY;
  }
  if (isStart) {
    lastEventTouch = ev;
  }
  return result;
}

function isEventMouseDouble(isStart: boolean, ev: MouseEvent): boolean {
  if (!isStart || lastEventMouse == null || ev == null) {
    return false;
  }
  const timeDif = ev.timeStamp - lastEventMouse.timeStamp;
  return timeDif < 450;
}

function isEventTouchDouble(isStart: boolean, ev: TouchEvent): boolean {
  if (!isStart || lastEventTouch == null || ev == null) {
    return false;
  }
  const timeDif = ev.timeStamp - lastEventTouch.timeStamp;
  return timeDif < 450;
}

function isEventMouseLong(isStart: boolean, ev: MouseEvent): boolean {
  if (!isStart || lastEventMouse == null || ev == null) {
    return false;
  }
  const timeDif = ev.timeStamp - lastEventMouse.timeStamp;
  return timeDif > 840;
}

function isEventTouchLong(isStart: boolean, ev: TouchEvent): boolean {
  if (!isStart || lastEventTouch == null || ev == null) {
    return false;
  }
  const timeDif = ev.timeStamp - lastEventTouch.timeStamp;
  return timeDif > 840;
}

function isKeyInList(ev: KeyboardEvent, list: string[]): boolean {
  if (!ev) {
    return false;
  }
  let keyLower = ev.key.toLowerCase();
  return list.indexOf(keyLower) > -1;
}

function isKeyEnter(ev: KeyboardEvent): boolean {
  if (!ev) {
    return false;
  }
  return isKeyInList(ev, ["enter", "return"]) || ev.keyCode === 13;
}

function isKeyEscape(ev: KeyboardEvent): boolean {
  if (!ev) {
    return false;
  }
  return isKeyInList(ev, ["esc", "escape"]) || ev.keyCode === 27;
}

function isKeySpace(ev: KeyboardEvent): boolean {
  if (!ev) {
    return false;
  }
  return isKeyInList(ev, [" ", "space", "spacebar"]) || ev.keyCode === 32;
}

function isFirstButton(ev: MouseEvent): boolean {
  if (!ev) {
    return false;
  }
  return ev?.button == 0;
}

function isMiddleButton(ev: MouseEvent): boolean {
  if (!ev) {
    return false;
  }
  return ev?.button == 1;
}

function isSecondButton(ev: MouseEvent): boolean {
  if (!ev) {
    return false;
  }
  return ev?.button == 2;
}

function isOneFinger(ev: TouchEvent): boolean {
  if (!ev) {
    return false;
  }
  return ev?.touches.length == 1;
}

function isTwoFingers(ev: TouchEvent): boolean {
  if (!ev) {
    return false;
  }
  return ev?.touches.length == 2;
}

function isThreeFingers(ev: TouchEvent): boolean {
  if (!ev) {
    return false;
  }
  return ev?.touches.length == 3;
}

function isFourFingers(ev: TouchEvent): boolean {
  if (!ev) {
    return false;
  }
  return ev?.touches.length == 4;
}

function isMainKey(ev: KeyboardEvent): boolean {
  if (!ev) {
    return false;
  }
  return isKeyEnter(ev);
}

function isMidiKey(ev: KeyboardEvent): boolean {
  if (!ev) {
    return false;
  }
  return ev.ctrlKey && ev.altKey && isKeySpace(ev);
}

function isMenuKey(ev: KeyboardEvent): boolean {
  if (!ev) {
    return false;
  }
  return ev.ctrlKey && !ev.altKey && isKeySpace(ev);
}

function isMainMouse(ev: MouseEvent): boolean {
  if (!ev) {
    return false;
  }
  return isFirstButton(ev);
}

function isMainTouch(ev: TouchEvent): boolean {
  if (!ev) {
    return false;
  }
  return isOneFinger(ev);
}

function isMidiMouse(ev: MouseEvent): boolean {
  if (!ev) {
    return false;
  }
  return isMiddleButton(ev);
}

function isMidiTouch(ev: TouchEvent): boolean {
  if (!ev) {
    return false;
  }
  return isThreeFingers(ev);
}

function isMenuMouse(ev: MouseEvent): boolean {
  if (!ev) {
    return false;
  }
  return isSecondButton(ev);
}

function isMenuTouch(ev: TouchEvent): boolean {
  if (!ev) {
    return false;
  }
  return isTwoFingers(ev);
}

function addAction(origin: HTMLElement, action: QinAction) {
  origin.addEventListener("keydown", actKeyDown);
  origin.addEventListener("keyup", actKeyUp);
  origin.addEventListener("mousedown", actMouseDown);
  origin.addEventListener("mouseup", actMouseUp);
  origin.addEventListener("touchstart", actTouchStart);
  origin.addEventListener("touchend", actTouchEnd);

  function actKeyDown(ev: KeyboardEvent) {
    let qinEvent = new QinEvent(origin, true, { eventKey: ev });
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return stopPropagation(ev);
    }
  }

  function actKeyUp(ev: KeyboardEvent) {
    let qinEvent = new QinEvent(origin, false, { eventKey: ev });
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return stopPropagation(ev);
    }
  }

  function actMouseDown(ev: MouseEvent) {
    let qinEvent = new QinEvent(origin, true, { eventMouse: ev });
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return stopPropagation(ev);
    }
  }

  function actMouseUp(ev: MouseEvent) {
    let qinEvent = new QinEvent(origin, false, { eventMouse: ev });
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return stopPropagation(ev);
    }
  }

  function actTouchStart(ev: TouchEvent) {
    let qinEvent = new QinEvent(origin, true, { eventTouch: ev });
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return stopPropagation(ev);
    }
  }

  function actTouchEnd(ev: TouchEvent) {
    let qinEvent = new QinEvent(origin, false, { eventTouch: ev });
    action(qinEvent);
    if (qinEvent.stop) {
      return stopEvent(ev);
    } else {
      return stopPropagation(ev);
    }
  }
}

function addActionMain(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMain) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMainKey(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMainKey) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMainMouse(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMainMouse) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMainTouch(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMainMouse) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMainPoint(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMainPoint) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMidi(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMidi) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMidiKey(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMidiKey) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMidiMouse(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMidiMouse) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMidiTouch(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMidiMouse) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMidiPoint(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMidiPoint) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMenu(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMenu) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMenuKey(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMenuKey) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMenuMouse(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMenuMouse) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMenuTouch(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMenuMouse) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActionMenuPoint(origin: HTMLElement, action: QinAction) {
  addAction(origin, (qinEvent: QinEvent) => {
    if (qinEvent.isMenuPoint) {
      action(qinEvent);
      qinEvent.consumed();
    }
  });
}

function addActions(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addAction(element, action);
  }
}

function addActionsMain(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMain(element, action);
  }
}

function addActionsMainKey(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMainKey(element, action);
  }
}

function addActionsMainMouse(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMainMouse(element, action);
  }
}

function addActionsMainTouch(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMainPoint(element, action);
  }
}

function addActionsMainPoint(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMainPoint(element, action);
  }
}

function addActionsMidi(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMidi(element, action);
  }
}

function addActionsMidiKey(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMidiKey(element, action);
  }
}

function addActionsMidiMouse(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMidiMouse(element, action);
  }
}

function addActionsMidiTouch(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMidiPoint(element, action);
  }
}

function addActionsMidiPoint(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMidiPoint(element, action);
  }
}

function addActionsMenu(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMenu(element, action);
  }
}

function addActionsMenuKey(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMenuKey(element, action);
  }
}

function addActionsMenuMouse(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMenuMouse(element, action);
  }
}

function addActionsMenuTouch(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMenuPoint(element, action);
  }
}

function addActionsMenuPoint(origins: HTMLElement[], action: QinAction) {
  for (const element of origins) {
    addActionMenuPoint(element, action);
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
    source.onmousedown = onMoverMouseInit;
    source.ontouchstart = onMoverTouchInit;
    source.ondragstart = stopEvent;
  }

  function onMoverMouseInit(ev: MouseEvent) {
    if (document.onmousemove || document.ontouchmove) {
      return;
    }
    if (dragCalls && dragCalls.onDouble && isEventMouseDouble(true, ev)) {
      dragCalls.onDouble();
      return;
    }
    if (dragCalls && dragCalls.onLong && isEventMouseLong(true, ev)) {
      dragCalls.onLong();
      return;
    }
    const pointer = makeEventMousePoint(true, ev);
    dragInitEventX = pointer.posX;
    dragInitEventY = pointer.posY;
    dragInitPosX = parseInt(target.style.left, 10);
    dragInitPosY = parseInt(target.style.top, 10);
    document.onmousemove = onMoverMouseMove;
    document.ontouchmove = onMoverTouchMove;
    document.onmouseup = onMoverClose;
    document.ontouchend = onMoverClose;
    QinSkin.hideAllIFrames();
    if (dragCalls && dragCalls.onStart) {
      dragCalls.onStart();
    }
    return stopEvent(ev);
  }

  function onMoverTouchInit(ev: TouchEvent) {
    if (document.onmousemove || document.ontouchmove) {
      return;
    }
    if (dragCalls && dragCalls.onDouble && isEventTouchDouble(true, ev)) {
      dragCalls.onDouble();
      return;
    }
    if (dragCalls && dragCalls.onLong && isEventTouchLong(true, ev)) {
      dragCalls.onLong();
      return;
    }
    const pointer = makeEventTouch(true, ev);
    dragInitEventX = pointer.posX;
    dragInitEventY = pointer.posY;
    dragInitPosX = parseInt(target.style.left, 10);
    dragInitPosY = parseInt(target.style.top, 10);
    document.onmousemove = onMoverMouseMove;
    document.ontouchmove = onMoverTouchMove;
    document.onmouseup = onMoverClose;
    document.ontouchend = onMoverClose;
    QinSkin.hideAllIFrames();
    if (dragCalls && dragCalls.onStart) {
      dragCalls.onStart();
    }
    return stopEvent(ev);
  }

  function onMoverMouseMove(ev: MouseEvent) {
    const pointer = makeEventMousePoint(false, ev);
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

  function onMoverTouchMove(ev: TouchEvent) {
    const pointer = makeEventTouch(false, ev);
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
    source.onmousedown = onResizerMouseInit;
    source.ontouchstart = onResizerTouchInit;
    source.ondragstart = stopEvent;
  }

  function onResizerMouseInit(ev: MouseEvent) {
    if (document.onmousemove || document.ontouchmove) {
      return;
    }
    if (dragCalls && dragCalls.onDouble && isEventMouseDouble(true, ev)) {
      dragCalls.onDouble();
      return;
    }
    if (dragCalls && dragCalls.onLong && isEventMouseLong(true, ev)) {
      dragCalls.onLong();
      return;
    }
    const pointer = makeEventMousePoint(true, ev);
    dragInitEventX = pointer.posX;
    dragInitEventY = pointer.posY;
    dragInitWidth = parseInt(target.style.width, 10);
    dragInitHeight = parseInt(target.style.height, 10);
    document.onmousemove = onResizerMouseMove;
    document.ontouchmove = onResizerTouchMove;
    document.onmouseup = onResizerClose;
    document.ontouchend = onResizerClose;
    QinSkin.hideAllIFrames();
    if (dragCalls && dragCalls.onStart) {
      dragCalls.onStart();
    }
    return stopEvent(ev);
  }

  function onResizerTouchInit(ev: TouchEvent) {
    if (document.onmousemove || document.ontouchmove) {
      return;
    }
    if (dragCalls && dragCalls.onDouble && isEventTouchDouble(true, ev)) {
      dragCalls.onDouble();
      return;
    }
    if (dragCalls && dragCalls.onLong && isEventTouchLong(true, ev)) {
      dragCalls.onLong();
      return;
    }
    const pointer = makeEventTouch(true, ev);
    dragInitEventX = pointer.posX;
    dragInitEventY = pointer.posY;
    dragInitWidth = parseInt(target.style.width, 10);
    dragInitHeight = parseInt(target.style.height, 10);
    document.onmousemove = onResizerMouseMove;
    document.ontouchmove = onResizerTouchMove;
    document.onmouseup = onResizerClose;
    document.ontouchend = onResizerClose;
    QinSkin.hideAllIFrames();
    if (dragCalls && dragCalls.onStart) {
      dragCalls.onStart();
    }
    return stopEvent(ev);
  }

  function onResizerMouseMove(ev: MouseEvent) {
    const pointer = makeEventMousePoint(false, ev);
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

  function onResizerTouchMove(ev: TouchEvent) {
    const pointer = makeEventTouch(false, ev);
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
  target.onmousedown = onScrollerMouseInit;
  target.ontouchstart = onScrollerTouchInit;

  function onScrollerMouseInit(ev: MouseEvent) {
    if (document.onmousemove || document.ontouchmove) {
      return;
    }
    stopPropagation(ev);
    if (dragCalls && dragCalls.onDouble && isEventMouseDouble(true, ev)) {
      dragCalls.onDouble();
      return;
    }
    if (dragCalls && dragCalls.onLong && isEventMouseLong(true, ev)) {
      dragCalls.onLong();
      return;
    }
    const pointer = makeEventMousePoint(true, ev);
    dragInitX = pointer.posX;
    dragInitY = pointer.posY;
    dragScrollX = target.scrollLeft;
    dragScrollY = target.scrollTop;
    document.onmousemove = onScrollerMouseMove;
    document.ontouchmove = onScrollerTouchMove;
    document.ontouchend = onScrollerClose;
    document.onmouseup = onScrollerClose;
    QinSkin.hideAllIFrames();
    if (dragCalls && dragCalls.onStart) {
      dragCalls.onStart();
    }
    return stopEvent(ev);
  }

  function onScrollerTouchInit(ev: TouchEvent) {
    if (document.onmousemove || document.ontouchmove) {
      return;
    }
    if (dragCalls && dragCalls.onDouble && isEventTouchDouble(true, ev)) {
      dragCalls.onDouble();
      return;
    }
    if (dragCalls && dragCalls.onLong && isEventTouchLong(true, ev)) {
      dragCalls.onLong();
      return;
    }
    const pointer = makeEventTouch(true, ev);
    dragInitX = pointer.posX;
    dragInitY = pointer.posY;
    dragScrollX = target.scrollLeft;
    dragScrollY = target.scrollTop;
    document.onmousemove = onScrollerMouseMove;
    document.ontouchmove = onScrollerTouchMove;
    document.onmouseup = onScrollerClose;
    document.ontouchend = onScrollerClose;
    QinSkin.hideAllIFrames();
    if (dragCalls && dragCalls.onStart) {
      dragCalls.onStart();
    }
    return stopEvent(ev);
  }

  function onScrollerMouseMove(ev: MouseEvent) {
    const pointer = makeEventMousePoint(false, ev);
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

  function onScrollerTouchMove(ev: TouchEvent) {
    const pointer = makeEventTouch(false, ev);
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

export const QinArms = {
  stopEvent,
  makeEventMousePoint,
  makeEventTouch,
  isEventMouseDouble,
  isEventTouchDouble,
  isEventMouseLong,
  isEventTouchLong,
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
  isMainMouse,
  isMainTouch,
  isMidiMouse,
  isMidiTouch,
  isMenuMouse,
  isMenuTouch,
  addAction,
  addActionMain,
  addActionMainKey,
  addActionMainMouse,
  addActionMainTouch,
  addActionMainPoint,
  addActionMidi,
  addActionMidiKey,
  addActionMidiMouse,
  addActionMidiTouch,
  addActionMidiPoint,
  addActionMenu,
  addActionMenuKey,
  addActionMenuMouse,
  addActionMenuTouch,
  addActionMenuPoint,
  addActions,
  addActionsMain,
  addActionsMainKey,
  addActionsMainMouse,
  addActionsMainTouch,
  addActionsMainPoint,
  addActionsMidi,
  addActionsMidiKey,
  addActionsMidiMouse,
  addActionsMidiTouch,
  addActionsMidiPoint,
  addActionsMenu,
  addActionsMenuKey,
  addActionsMenuMouse,
  addActionsMenuTouch,
  addActionsMenuPoint,
  addMover,
  addResizer,
  addScroller,
};
