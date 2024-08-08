import { Cursor, FederatedPointerEvent } from "pixi.js";
import { EPointerType, IDiagMovaleWidget, IDiagPointerHandler, PointerHandler } from "../Utils/PointerHandler";
import React, { useEffect } from "react";
import { DiagUtil, IDiagVec2 } from "../Utils/Common";

import { IDiagRulerProps } from "../Widgets/LayoutRulers";
import { KeyboardUtil } from "../Utils/Keyboard";
import { IDiagLayoutBlockProps } from "../Widgets/LayoutBlock";
import { DiagBlockConst } from "../Models/Block";


enum EditMode {

    Ready,
    Next,
    End
}


interface IDiagRulerEditorProps {

    blocks: IDiagLayoutBlockProps[];
    rulers: IDiagRulerProps[];
    pointerHandler: IDiagPointerHandler;
    onUpdateRulers: (rulers: IDiagRulerProps[]) => void;
    onUpdateCursor: (cursor: Cursor | string) => void;
    onPointerDown: (id: string) => void;

    onEscape: () => void;

    isTop: boolean;

    gridPos: IDiagVec2;
    zoomScale: number;

    clearDiagram?: string;
}

let cachedRulerProps: IDiagRulerProps[] = [];
let cachedGridPos: IDiagVec2;
let cachedZoomScale = 1;

let selectedBlocks: IDiagLayoutBlockProps[] = [];

let cachedIsTop = true;

let selectedRuler: IDiagRulerProps | undefined;
let editMode = EditMode.Ready;

const DiagRulerEditor = (props: IDiagRulerEditorProps) => {

    cachedRulerProps = [...props.rulers];

    useEffect(() => {

        cachedGridPos = props.gridPos;

    }, [props.gridPos]);

    useEffect(() => {

        cachedZoomScale = 1 / props.zoomScale;

    }, [props.zoomScale]);

    useEffect(() => {

        cachedIsTop = props.isTop;

    }, [props.isTop]);

    const onNewRuler = () => {

        if (selectedBlocks.length !== 2) {
            throw new Error(`Invalid Process!!!!`);
        }

        const { s, e } = (selectedBlocks[0].pos.x < selectedBlocks[1].pos.x) ?
            ({ s: selectedBlocks[0], e: selectedBlocks[1] }) :
            ({ s: selectedBlocks[1], e: selectedBlocks[0] });

        const calcPos = (t: IDiagLayoutBlockProps) => {

            const { height } = DiagBlockConst.calcArea(props.isTop === t.model.layoutInfo.is_top, t.model);
            return { x: t.pos.x, y: t.pos.y + height, r: 0 };
        };

        const pos = calcPos(s);
        const length = calcPos(e);
        length.x = length.x - pos.x;
        length.y = length.y - pos.y;

        cachedRulerProps.push({
            id: DiagUtil.id(),
            pos,
            length,
            selected: true,
            isTop: cachedIsTop,
            onClick: props.onPointerDown
        });

        props.onUpdateRulers(cachedRulerProps);
    }

    const translatePos = (e: FederatedPointerEvent) => {

        return {
            x: (e.screenX - cachedGridPos.x) * cachedZoomScale,
            y: (e.screenY - cachedGridPos.y) * cachedZoomScale,
            r: 0
        }
    }

    const onPlaceRuler = (e: FederatedPointerEvent) => {

        const pos = translatePos(e);

        selectedRuler = {
            id: DiagUtil.id(),
            pos,
            length: { x: 0, y: 0, r: 0 },
            selected: false,
            isTop: cachedIsTop,
            onClick: props.onPointerDown
        };

        cachedRulerProps.push(selectedRuler);
        props.onUpdateRulers(cachedRulerProps);

        editMode = EditMode.Next;
    };

    // const onUpdate = (target: IDiagMovaleWidget | undefined, state: EPointerType, e?: FederatedPointerEvent) => {

    //     if (state === EPointerType.Up) {

    //     } else if (target) {

    //         props.onUpdateRulers(cachedRulerProps);

    //     } else {

    //     }

    // };

    // useEffect(() => {

    //     return (() => {

    //         cachedRulerProps.forEach((v) => (v.selected = false));
    //         props.onUpdateRulers(cachedRulerProps);
    //     });

    // }, []);

    // PointerHandler.listenMovable(props.pointerHandler, props.rulers, { x: 0, y: 0 }, onUpdate, undefined, undefined, (e, t) => {

    //     t.pos.x = (e.screenX - cachedGridPos.x) * cachedZoomScale;
    //     t.pos.y = (e.screenY - cachedGridPos.y) * cachedZoomScale;
    //     props.onUpdateRulers(cachedRulerProps);

    //     return false;
    // });

    const onCheckNewNRelease = () => {

        if (selectedBlocks.length === 2) {
            onNewRuler();
        }

        selectedBlocks = [];
    };

    useEffect(() => {

        const funcs = PointerHandler.listen(props.pointerHandler, (d) => {

            // const t = props.blocks.find((v) => (v.id === d));
            // if (t) {

            //     selectedBlocks.push(t);
            //     if (selectedBlocks.length > 2) {
            //         selectedBlocks.shift();
            //     }
                
            // } else {

            //     onCheckNewNRelease();
            // }
            
        }, (e) => {

            if ((e) && (selectedRuler)) {

                if (editMode === EditMode.Next) {

                    const cur = translatePos(e);

                    selectedRuler.length.x = cur.x - selectedRuler.pos.x;
                    selectedRuler.length.r = selectedRuler.length.y = cur.y - selectedRuler.pos.y;

                    props.onUpdateRulers(cachedRulerProps);

                } else if (editMode === EditMode.End) {

                    const cur = translatePos(e);
                    selectedRuler.length.r = cur.y - selectedRuler.pos.y;

                    props.onUpdateRulers(cachedRulerProps);
                }
            }

        }, (e) => {

            if ((e) && (e.eventPhase > 1)) {

                switch (editMode) {
                    case EditMode.Ready: onPlaceRuler(e); break;
                    case EditMode.Next: editMode = EditMode.End; break;
                    case EditMode.End: editMode = EditMode.Ready; break;
                }
            }

        });

        return () => {

            props.pointerHandler.release(funcs);
        };

    }, []);

    useEffect(() => {

        if (selectedBlocks.length === 2) {

            onCheckNewNRelease();
        }

    }, [props.clearDiagram]);

    KeyboardUtil.listen(undefined, undefined, (key: string) => {

        if (key === 'Escape') {

            if (editMode !== EditMode.Ready) {

                cachedRulerProps.pop();
                props.onUpdateRulers(cachedRulerProps);
            }

            props.onEscape();
        }

    });

    return (<></>)
}

export default DiagRulerEditor;