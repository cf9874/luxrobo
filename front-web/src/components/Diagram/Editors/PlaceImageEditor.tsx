import { IDiagGridProps } from "../Widgets/Grid";
import { EPointerType, IDiagMovaleWidget, IDiagPointerHandler } from "../Utils/PointerHandler";

import { PointerHandler } from "../Utils/PointerHandler";
import { FederatedPointerEvent } from "pixi.js";
import { DiagLayoutImage, IDiagLayoutImageProps } from "../Widgets/LayoutImage";
import { useEffect, useState } from "react";
import { DiagUtil, IDiagVec2 } from "../Utils/Common";
import { KeyboardUtil } from "../Utils/Keyboard";

export interface IDiagPlaceImageEditorProps {

    images: IDiagLayoutImageProps[];

    draggingImage: IDiagLayoutImageProps | undefined;

    pointerHandler: IDiagPointerHandler;

    gridProps: IDiagGridProps;

    isTop: boolean;

    onUpdateImage: () => void;
    onPlaceImage: (i: IDiagLayoutImageProps) => void;

    onEscape: () => void;

    gridPos: IDiagVec2;
    zoomScale: number;
}

let initDraggingImage: IDiagLayoutImageProps | undefined;
let cachedGridPos: IDiagVec2;
let cachedZoomScale = 1;
let cachedIsTop = true;

const DiagPlaceImageEditor = (props: IDiagPlaceImageEditorProps) => {

    useEffect(() => {

        cachedGridPos = props.gridPos;

    }, [props.gridPos]);

    useEffect(() => {

        cachedIsTop = props.isTop;

    }, [props.isTop]);

    useEffect(() => {
        cachedZoomScale = 1 / props.zoomScale;
    }, [props.zoomScale]);

    const [pos, setPos] = useState({ x: 0, y: 0, r: 0});

    const onUpdateImage = (target: IDiagMovaleWidget | undefined, state: EPointerType, e?: FederatedPointerEvent) => {

        if (state === EPointerType.Up) {

            if (target) {

                const t = target as IDiagLayoutImageProps;
                if (t) {
                    props.onPlaceImage(t);
                }
            }

        }

    };

    useEffect(() =>{

        initDraggingImage = props.draggingImage;

    }, [props.draggingImage]);

    PointerHandler.listenMovable(props.pointerHandler, props.images, { x: 0, y: 0 }, onUpdateImage, props.draggingImage, undefined, (e, target) => {

        const t = target as IDiagLayoutImageProps;
        if (t) {

            t.pos.x = (e.screenX - cachedGridPos.x) * cachedZoomScale;
            t.pos.y = (e.screenY - cachedGridPos.y) * cachedZoomScale;

            if (initDraggingImage) {
                setPos({ ...t.pos });
            } else {
                props.onUpdateImage();
            }
        }

        return false;
    });

    // useEffect(() => {

    //     const funcs = PointerHandler.listen(props.pointerHandler, undefined, undefined, (e) => {

    //         if (!props.draggingImage) {
    //             throw new Error(`Invalid Proc!!!`);
    //         }

    //         if ((e) && (e.eventPhase > 1)) {

    //             const x = (e.screenX - cachedGridPos.x) * cachedZoomScale;
    //             const y = (e.screenY - cachedGridPos.y) * cachedZoomScale;
    //             props.onPlaceImage({

    //                 ...props.draggingImage,
    //                 id: DiagUtil.id(),
    //                 pos: { x, y, r: 0 }
    //             });
    //         }

    //     });

    //     return () => {

    //         props.pointerHandler.release(funcs);
    //     };

    // }, []);

    KeyboardUtil.listen(undefined, undefined, (key: string) => {

        if (key === 'Escape') {
            props.onEscape();
        }

    });

    return (initDraggingImage) ? (<DiagLayoutImage key={initDraggingImage.id} {...initDraggingImage} pos={pos} isTop={cachedIsTop}></DiagLayoutImage>) : (<></>);
}

export default DiagPlaceImageEditor;