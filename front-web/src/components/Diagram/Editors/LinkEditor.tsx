import { Container, Graphics } from "@pixi/react";
import { FederatedPointerEvent, Graphics as _Graphics } from "pixi.js";
import { DiagUtil, IDiagVec2 } from "../Utils/Common";
import { IDiagGridProps } from "../Widgets/Grid";
import { useCallback, useEffect, useState } from "react";
import { IDiagPointerHandler, PointerHandler } from "../Utils/PointerHandler";
import { IDiagBlockProps } from "../Widgets/Block";
import { DiagBlockCategory, DiagBlockConst } from "../Models/Block";

interface IDiagLinkEditor {

    x: number;
    y: number;

    src: IDiagBlockProps | undefined;

    gridProps: IDiagGridProps;
    gridPos: IDiagVec2;
    zoomScale: number;

    pointerHandler: IDiagPointerHandler;
}

let cachedGridPos: IDiagVec2 = { x: 0, y: 0 };
let cachedZoomScale: number = 1;

const DiagLinkEditor = (props: IDiagLinkEditor) => {

    const [pos, setPos] = useState({ x: Number.NEGATIVE_INFINITY, y: 0});

    useEffect(() => {
        cachedGridPos = props.gridPos;
    }, [props.gridPos]);

    useEffect(() => {
        cachedZoomScale = 1 / props.zoomScale;
    }, [props.zoomScale]);

    const getOffset = () => {

        switch (props.src?.model.category) {

            case DiagBlockConst.category(DiagBlockCategory.PowerIn):
            case DiagBlockConst.category(DiagBlockCategory.PowerOut):
            case DiagBlockConst.category(DiagBlockCategory.Battery):
            case DiagBlockConst.category(DiagBlockCategory.MCU):
                return { x: -50, y: 0 };
        }

        return { x: 50, y: 0 };
    }

    const draw = useCallback((g: _Graphics) => {

        g.clear();

        if ((props.src) && (pos.x > Number.NEGATIVE_INFINITY)) {


            g.lineStyle(1, 0xb2b2b2);

            const offset = getOffset();
        
            const src = {
                x: (props.src.pos.x) + offset.x,
                y: (props.src.pos.y) + offset.y
            }

            const target = {

                x: (pos.x - cachedGridPos.x) * cachedZoomScale,
                y: (pos.y - cachedGridPos.y) * cachedZoomScale
            };

            g.moveTo(src.x, src.y);
            g.lineTo(target.x, target.y);

            // const length = DiagUtil.lengthVec2(src, target);
            // const dir = DiagUtil.normalizeVec2(src, target);

            // const delta = 5;
            // const step = length / delta;

            // for (let i = 0; i < step; ++i) {

            //     if (i % 2 === 1) {

            //         const cur = {
            //             x: src.x + (i * dir.x * delta),
            //             y: src.y + (i * dir.y * delta)
            //         };
        
            //         g.moveTo(cur.x, cur.y);
            //         g.lineTo(cur.x + (dir.x * delta), cur.y + (dir.y * delta));
            //     }
            // }

            g.beginFill(0x45d6df);
            g.drawCircle(target.x, target.y, 6);
            g.endFill();
        }

    }, [props.src, pos]);

    const onPointerMove = (e: FederatedPointerEvent | undefined) => {

        if (e) {

            setPos({
                x: e.screen.x,
                y: e.screen.y
            });
        }
    };

    useEffect(() => {

        const funcs = PointerHandler.listen(props.pointerHandler, undefined, onPointerMove, undefined);

        return () => {

            props.pointerHandler.release(funcs);
        };

    }, []);

    return (
        <Container anchor={0.5}>
            <Graphics draw={draw} />
        </Container>
    );

}

export default DiagLinkEditor;