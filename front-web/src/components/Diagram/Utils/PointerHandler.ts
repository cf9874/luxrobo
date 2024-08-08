import { useEffect, useState } from "react";
import { IDiagVec2 } from "./Common";
import { FederatedPointerEvent } from "pixi.js";
import { ILayoutDiagPos } from "../Models/Block";

// export interface IDiagPointerHandler {

//     eventType: EDiagPointerEventType | undefined;
//     e: FederatedPointerEvent | undefined;
//     data: string | undefined;
// }

type FuncType = (d: string | FederatedPointerEvent | undefined, e?: FederatedPointerEvent) => void;

export enum EPointerType {

    Down,
    Move,
    Up
}

export interface IDiagPointerFuncHandler {}

interface IDiagPointerFuncHandlerImp extends IDiagPointerFuncHandler {
    d: FuncType | undefined;
    m: FuncType | undefined;
    u: FuncType | undefined;
}

export interface IDiagPointerHandler {

    release(funcs: IDiagPointerFuncHandler): boolean;
}

class DiagPointerHandler implements IDiagPointerHandler {

    private db = new Map<EPointerType, FuncType[]>();

    set(key: EPointerType, func: FuncType) {

        const a = this.db.get(key);
        if (a) {
            a.push(func);
        } else {
            this.db.set(key, [func]);
        }
    }

    release(funcs: IDiagPointerFuncHandler): boolean {

        const i = funcs as IDiagPointerFuncHandlerImp;
        if (i) {

            if (i.d) {
                if (!this._release(EPointerType.Down, i.d)) {
                    return false;
                }
            }

            if (i.m) {
                if (!this._release(EPointerType.Move, i.m)) {
                    return false;
                }
            }

            if (i.u) {
                if (!this._release(EPointerType.Up, i.u)) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }

    private _release(key: EPointerType, func: FuncType) {
        
        const a = this.db.get(key);
        if (a) {
            const i = a.indexOf(func);
            if (i > -1) {
                a.splice(i, 1);
                if (a.length === 0) {
                    this.db.delete(key);
                }

                return true;
            }
        }

        return false;
    }

    emit<T extends string | FederatedPointerEvent>(k: EPointerType, d: T, ev?: FederatedPointerEvent) {

        const a = this.db.get(k);
        if (a) {
            for (const e of a) {
                e(d as T, ev);
            }
        }
    }
}

export interface IDiagMovaleWidget {

    id: string;
    pos: ILayoutDiagPos;
    selected: boolean;
}

const _pointerHandler = new DiagPointerHandler();

const init = () => {

    // const [pointerHandler, setPointerHandler] = useState({} as IDiagPointerHandler);
    const onPointerDown = (id: string, e?: FederatedPointerEvent) => {

        _pointerHandler.emit(EPointerType.Down, id, e);
        // setPointerHandler({ eventType: EDiagPointerEventType.Down, e: undefined, data: id });
    };

    const onPointerMove = (e: FederatedPointerEvent) => {

        _pointerHandler.emit(EPointerType.Move, e);
        // setPointerHandler({ eventType: EDiagPointerEventType.Move, e, data: undefined });
    };

    const onPointerUp = (e: FederatedPointerEvent) => {

        _pointerHandler.emit(EPointerType.Up, e);
        // setPointerHandler({ eventType: EDiagPointerEventType.Up, e, data: undefined });
    };

    return { pointerHandler: _pointerHandler, onPointerDown, onPointerMove, onPointerUp };

};

// CAUTION: 해제 안해주면 누적됨을 주의!
const listen = (pointerHandler: IDiagPointerHandler,
    onPointerDown?: (data: string | undefined, e?: FederatedPointerEvent) => void,
    onPointerMove?: (e: FederatedPointerEvent | undefined) => void,
    onPointerUp?: (e: FederatedPointerEvent | undefined) => void): IDiagPointerFuncHandler => {

    const t = pointerHandler as DiagPointerHandler;

    let d: FuncType | undefined, m: FuncType | undefined, u: FuncType | undefined;
    if (t) {

        if (onPointerDown) {
            t.set(EPointerType.Down, d = (d, e) => { onPointerDown(d as string, e); });
        }
    
        if (onPointerMove) {
            t.set(EPointerType.Move, m = (e) => { onPointerMove(e as FederatedPointerEvent); });
        }
    
        if (onPointerUp) {
            t.set(EPointerType.Up, u = (e) => { onPointerUp(e as FederatedPointerEvent); });
        }
    }
    
    return { d, m, u } as IDiagPointerFuncHandler;

    // useEffect(() => {

    //     switch (pointerHandler.eventType) {

    //         case EDiagPointerEventType.Down: if (onPointerDown) onPointerDown(pointerHandler.data); break;
    //         case EDiagPointerEventType.Move: if (onPointerMove) onPointerMove(pointerHandler.e); break;
    //         case EDiagPointerEventType.Up: if (onPointerUp) onPointerUp(pointerHandler.e); break;
    //     }

    // }, [pointerHandler]);

};

const clearWidgets = (widges: IDiagMovaleWidget[]) => {

    for (const w of widges) {
        w.selected = false;
    }
}

let draggingWidget: undefined | IDiagMovaleWidget;
let widgets: IDiagMovaleWidget[] = [];
// let initBlock = false;

const listenMovable = (pointerHandler: IDiagPointerHandler,
    target: IDiagMovaleWidget[],
    offset: IDiagVec2,
    onPostProcess: (target: IDiagMovaleWidget | undefined, state: EPointerType, e?: FederatedPointerEvent) => void,
    initDraggingWidget?: IDiagMovaleWidget,
    hookPointerDown?: (id: string, taget?: IDiagMovaleWidget, e?: FederatedPointerEvent) => boolean,
    hookPointerMove?: (e: FederatedPointerEvent, taget: IDiagMovaleWidget) => boolean) => {


    // if (initDraggingWidget) {
        
    //     draggingWidget =  initDraggingWidget;
    //     // initBlock = true;
    // }

    useEffect(() => {

        draggingWidget = initDraggingWidget;

    }, [initDraggingWidget]);

    useEffect(() => {

        widgets = target;

    }, [target]);

    useEffect(() => {

        const funcs = listen(pointerHandler, (id, e) => {

            if (!id) {
                return;
            }

            const t = widgets.find(v => v.id === id);
            if ((hookPointerDown) && (!hookPointerDown(id, t, e))) {
                return;
            }

            if (t) {

                clearWidgets(widgets);
                t.selected = true;

                draggingWidget = t;
                        
                onPostProcess(t, EPointerType.Down);
            }
        
        }, (e) => {

            if ((e) && (draggingWidget)) {

                if ((hookPointerMove) && (!hookPointerMove(e, draggingWidget))) {
                    return;
                }

                draggingWidget.pos.x = e.screen.x - offset.x;
                draggingWidget.pos.y = e.screen.y - offset.y;

                onPostProcess(draggingWidget, EPointerType.Move, e);
            }

        }, (e) => {

            if ((!e) || (e.eventPhase < 2)) {
                return;
            }

            // console.log(init);

            // TODO: 다른 더 좋은 방법이 있을 것 같은데...
            // if (!initBlock) {
            //     initBlock = true;
            //     return;
            // }

            onPostProcess(draggingWidget, EPointerType.Up, e);

            if (draggingWidget) {
                draggingWidget = undefined;
            }
        });

        return () => {

            // initBlock = false;
            pointerHandler.release(funcs);
        };

    }, []);
};

export const PointerHandler = {
    init,
    listen,
    listenMovable
};