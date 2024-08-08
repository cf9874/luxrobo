import { useEffect, useState } from "react"

import { Container } from '@pixi/react';

import { FederatedPointerEvent } from "pixi.js";
import { IDiagGridProps } from "../Widgets/Grid";
import { DiagUtil, IDiagVec2 } from "../Utils/Common";
import { IDiagPointerHandler } from "../Utils/PointerHandler";
import { ILayoutDiagPos } from "../Models/Block";

import DiagOutlineMarker, { IDiagOutlineMarkerProps } from "./Widgets/OutlineMarker";
import { PointerHandler } from "../Utils/PointerHandler";
import { KeyboardUtil } from "../Utils/Keyboard";

export interface IDiagOutlineEditorProps {

    x: number;
    y: number;

    pointerHandler: IDiagPointerHandler;

    shape: ILayoutDiagPos[];

    gridProps: IDiagGridProps;

    testBoardScale?: number;

    onUpdateShape: (shape: ILayoutDiagPos[]) => void;
    onUpdateJson: () => void;

    gridPos: IDiagVec2;
    zoomScale: number;
}

let markProps: IDiagOutlineMarkerProps[] = [];
let selectedMarker: IDiagOutlineMarkerProps | undefined;
let lastUpPos = { x: 0, y: 0, timeStamp: 0 };

let cachedGridPos: IDiagVec2;
let cachedZoomScale: number = 1;

const DiagOutlineEditor = (props: IDiagOutlineEditorProps) => {

    const [markers, setMarkers] = useState(markProps);

    const posScale = (props.testBoardScale) ? (props.testBoardScale) : (1);

    useEffect(() => {
        cachedGridPos = props.gridPos;
    }, [props.gridPos]);

    useEffect(() => {
        cachedZoomScale = 1 / props.zoomScale;
    }, [props.zoomScale]);

    const updateShape = (updateJson?: boolean) => {

        const ns: ILayoutDiagPos[] = [];
        for (const m of markProps) {
            ns.push({
                ...m,
                x: m.x / posScale,
                y: m.y / posScale
            });
        }

        // const first = markProps[0];
        // ns.push({...first, x: first.x / posScale, y: first.y / posScale });

        props.onUpdateShape(ns);

        if (updateJson) {
            props.onUpdateJson();
        }
    };

    KeyboardUtil.listen(undefined, undefined, (key: string) => {

        if (key === 'Delete') {

            if (markProps.length > 4) {

                const selected = markProps.find((m) => (m.selected));
                if (selected) {

                    const rm = markProps.indexOf(selected);
                    if (rm < 0) {
                        throw new Error(`Not found mark: ${selected.id}`);
                    }

                    markProps.splice(rm, 1);
                    updateShape(true);
                }

            }
        }

    });

    const onPointerDown = (id: string | undefined) => {

        if (!id) {
            return;
        }

        const select = markProps.find((m) => (m.id === id));
        if (!select) {
            throw new Error(`Not found a marker.`);
        }

        markProps.map((m) => (m.selected = false));

        select.selected = true;

        selectedMarker = select;
        setMarkers([...markProps]);
    };

    const onPointerMove = (e: FederatedPointerEvent | undefined) => {

        if (!e) {
            return;
        }

        if (selectedMarker) {

            selectedMarker.x = (e.screen.x - props.gridProps.sx - cachedGridPos.x) * cachedZoomScale;
            selectedMarker.y = (e.screen.y - props.gridProps.sy - cachedGridPos.y) * cachedZoomScale;

            updateShape();
        }

    };

    const getCloseatMarkIndex = (p: IDiagVec2) => {

        let temp = Infinity;
        let target = -1;
        for (let i = 0; i < markProps.length; ++i) {

            const m = markProps[i];

            const dist = DiagUtil.lengthVec2(m, p);
            if (dist < temp) {
                temp = dist;
                target = i;
            }
        }

        return target;
    }

    const getLinkIndex = (target: IDiagVec2, i: number): number => {

        let n = i + 1;
        if (n === markProps.length) {
            n = 0;
        }
        const nPoint = markProps[n];

        let p = i -1;
        if (p < 0) {
            p = markProps.length - 1;
        }

        const sameDir = (a: number, b: number, c: number): boolean => {

            return ((a - c) * (b - c) > 0);
        };

        const cPoint = markProps[i];
        if (Math.abs(target.x - cPoint.x) > Math.abs(target.y - cPoint.y)) {

            if (sameDir(nPoint.x, target.x, cPoint.x)) {
                return n;
            } else {
                return p;
            }

        } else {

            if (sameDir(nPoint.y, target.y, cPoint.y)) {
                return n;
            } else {
                return p;
            }

        }
    }

    const onDoubleClick = (p: IDiagVec2) => {

        const i = getCloseatMarkIndex(p);
        if (i < 0) {
            throw new Error(`Wrong process.`);
        }

        const n = getLinkIndex(p, i);
        let nIndex;
        if (n < i) {

            if ((n === markProps.length - 1) || (n === 0)) {
                nIndex = i + 1;
            }
            else {
                nIndex = i;
            }

        } else {

            nIndex = n;

        }

        const nProps: IDiagOutlineMarkerProps = {
            x: p.x,
            y: p.y,
            r: 0,
            id: DiagUtil.id(),
            text: '',
            selected: false,
            onClick: onPointerDown,
            onUp: onPointerUp,
            zoomScale: 1
        };

        markProps.splice(nIndex, 0, nProps);
        // for (let i = nIndex + 1; i < markProps.length; ++i) {
        //     markProps[i].text = i.toString();
        // }

        updateShape(true);
    }

    const onPointerUp = (e: FederatedPointerEvent | undefined) => {

        if (!e) {
            return;
        }

        if (e.eventPhase < 2) {
            return;
        }

        if ((lastUpPos.timeStamp === 0) || ((e.timeStamp - lastUpPos.timeStamp) > 300)) {

            lastUpPos = { x: e.screen.x, y: e.screen.y, timeStamp: e.timeStamp };

        } else {

            if (DiagUtil.lengthVec2(e.screen, lastUpPos) < 3) {

                onDoubleClick({ x: e.screen.x - props.gridProps.sx, y: e.screen.y - props.gridProps.sy });
            }

            lastUpPos = { x: 0, y: 0, timeStamp: 0 };
        }

        if (selectedMarker) {

            selectedMarker.selected = false;
            selectedMarker = undefined;
            setMarkers([...markProps]);

            props.onUpdateJson();
        }
    };

    useEffect(() => {

        if (!selectedMarker) {

            let count = 0;
            const t: IDiagOutlineMarkerProps[] = [];
            for (const p of props.shape) {
                t.push({
                    x: p.x * posScale,
                    y: p.y * posScale,
                    r: p.r,
                    id: DiagUtil.id(),
                    selected: false,
                    text: (++count).toString(),
                    onClick: onPointerDown,
                    onUp: onPointerUp,
                    zoomScale: 1
                });
            }

            markProps = t;
            setMarkers([...markProps]);
        }

    }, [props.shape]);

    useEffect(() =>{

        const funcs = PointerHandler.listen(props.pointerHandler, undefined, onPointerMove, onPointerUp);

        return () => {

            props.pointerHandler.release(funcs);
        };

    }, []);

    return (
        <Container x={props.x + props.gridProps.sx + props.gridPos.x} y={props.y + props.gridProps.sy + props.gridPos.y} anchor={0.5}>
            {
                markers.map((m) => (<DiagOutlineMarker key={m.id} {...m} zoomScale={props.zoomScale}></DiagOutlineMarker>))
            }
        </Container>
    );
}

export default DiagOutlineEditor;
