import { Cursor, FederatedPointerEvent } from "pixi.js";
import { EPointerType, IDiagMovaleWidget, IDiagPointerHandler, PointerHandler } from "../Utils/PointerHandler";
import { IDiagLayoutHoleProps } from "../Widgets/LayoutHoles";
import { useEffect, useState } from "react";
import { DiagUtil, IDiagVec2 } from "../Utils/Common";
import { KeyboardUtil } from "../Utils/Keyboard";


interface IDiagHoleEditorProps {

    holes: IDiagLayoutHoleProps[];
    pointerHandler: IDiagPointerHandler;
    onUpdateHole: (holes: IDiagLayoutHoleProps[]) => void;
    onUpdateCursor: (cursor: Cursor | string) => void;
    onRelease: () => void;

    onEscape: () => void;

    isTop: boolean;

    gridPos: IDiagVec2;
    zoomScale: number;
}

let holeProps: IDiagLayoutHoleProps[] = [];
let cachedGridPos: IDiagVec2;
let cachedZoomScale = 1;

const DiagHoleEditor = (props: IDiagHoleEditorProps) => {

    const [draggingHhole, setDraggingHole] = useState(undefined as undefined | IDiagLayoutHoleProps);

    useEffect(() => {

        holeProps = props.holes;

    }, [props.holes]);

    useEffect(() => {

        cachedGridPos = props.gridPos;

    }, [props.gridPos]);

    useEffect(() => {
        cachedZoomScale = 1 / props.zoomScale;
    }, [props.zoomScale]);

    const updateHoles = () => { props.onUpdateHole(holeProps); };

    const newHole = (x: number, y: number) => {

        const defaultDiameter = 5;

        const model = {
            pos: { x, y, r: 0 },
            diameter: defaultDiameter
        };

        const nh = {
            ...model,
            id: DiagUtil.id(),
            selected: false,
            isTop: props.isTop,
            model
        };

        holeProps.push(nh);

        updateHoles();

        return nh;
    };

    const onNewHole = (e: FederatedPointerEvent) => {

        return newHole(
            (e.screenX - cachedGridPos.x) * cachedZoomScale,
            (e.screenY - cachedGridPos.y) * cachedZoomScale
        );
    }

    const onUpdateHole = (target: IDiagMovaleWidget | undefined, state: EPointerType, e?: FederatedPointerEvent) => {

        if (state === EPointerType.Up) {

            const t = target as IDiagLayoutHoleProps;
            if ((t) && (e)) {
                setDraggingHole(onNewHole(e));
            }
            // if (t) {
                
            //     // do nothing.

            // } else if (e) {
            //     onNewHole(e);
            // }

        } else if (target) {

            // updateHoles();
        }

    };

    useEffect(() => {

        props.onUpdateCursor("cell");

        setDraggingHole(newHole(-1000, 0));

        return (() => {

            holeProps.pop();
            holeProps.forEach((h) => (h.selected = false));
            updateHoles();

            props.onUpdateCursor("default");

            props.onRelease();
        });

    }, []);

    PointerHandler.listenMovable(props.pointerHandler, props.holes, { x: 0, y: 0 }, onUpdateHole, draggingHhole, undefined, (e, t) => {

        t.pos.x = (e.screenX - cachedGridPos.x) * cachedZoomScale;
        t.pos.y = (e.screenY - cachedGridPos.y) * cachedZoomScale;
        updateHoles();

        return false;
    });

    KeyboardUtil.listen(undefined, undefined, (key: string) => {

        if (key === 'Escape') {
            props.onEscape();
        }

    });

    return (<></>)
}

export default DiagHoleEditor;