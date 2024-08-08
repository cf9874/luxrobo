import { Container, Graphics } from "@pixi/react";

import { ColorSource, Graphics as _Graphics } from "pixi.js";
import { useCallback, useState } from "react";
import { ILayoutDiagPos } from "../Models/Block";
import { DiagUtil, IDiagVec2 } from "../Utils/Common";

export interface IDiagLayoutBoardProps {

    x: number;
    y: number;

    lineColor: ColorSource;

    shape: ILayoutDiagPos[];

    onDown: () => void;
}

const correctPoints = (src: ILayoutDiagPos[], offset: number): ILayoutDiagPos[] => {

    let mx = 0, my = 0;
    const rt: ILayoutDiagPos[] = [];
    for (const p of src) {

        const c = { ...p };            
        rt.push(c);

        mx += c.x;
        my += c.y;
    }

    mx /= src.length;
    my /= src.length;

    for (const p of rt) {

        if (p.x < mx) {
            p.x += offset;
        } else {
            p.x -= offset;
        }

        if (p.y < my) {
            p.y += offset;
        } else {
            p.y -= offset;
        }
    }

    return rt;
};

const step = (s: IDiagVec2, e: IDiagVec2, d: number): IDiagVec2 => {

    // const v = {
    //     x: e.x - s.x,
    //     y: e.y - s.y
    // };

    // const m = Math.sqrt((v.x * v.x) + (v.y * v.y));
    // return { x: s.x + (v.x / m * d), y: s.y + (v.y / m * d) };

    const dir = DiagUtil.normalizeVec2(s, e);
    return { x: s.x + (dir.x * d), y: s.y + (dir.y * d) };
}

const calc = (pv: IDiagVec2, cv: IDiagVec2, nv: IDiagVec2, d: number): IDiagVec2[] => {

    if (d === 0) {
        return [cv];
    }
    
    const s = Math.abs(d);
    return [step(cv, pv, s), cv, step(cv, nv, s)];
}

const proc = (g: _Graphics, src: ILayoutDiagPos[], idx: number) => {

    const cv = src[idx];

    let t = idx - 1;
    if (t < 0) {
        t = src.length - 1;
    }
    const pv = src[t];

    t = idx + 1;
    if (t === src.length) {
        t = 0;
    }
    const nv = src[t];

    const rt = calc(pv, cv, nv, cv.r);
    if (idx === 0) {
        g.moveTo(rt[0].x, rt[0].y);
    } else {
        g.lineTo(rt[0].x, rt[0].y);
    }

    if (rt.length > 2) {
        g.quadraticCurveTo(rt[1].x, rt[1].y, rt[2].x, rt[2].y);
    }
}

export const DiagLayoutBoard = (props: IDiagLayoutBoardProps) => {

    const draw = useCallback((g: _Graphics) => {

        if (props.shape.length < 4) {
            return;
        }

        const lineWidth = 2;        
        const points = correctPoints(props.shape, lineWidth / 2);

        g.clear();

        g.lineStyle(lineWidth, props.lineColor);
        g.beginFill(0xffffff, 0.5);

        // let i = 0;
        // g.moveTo(points[i].x, points[i].y);
        // for (; i < points.length; ++i) {

        //     g.lineTo(points[i].x, points[i].y);
        // }
        const copy = [...points];
        for (let i = 0; i < copy.length; ++i) {
            proc(g, copy, i);
        }
        
        g.closePath();
        g.endFill();

    }, [props.shape, props.lineColor]);

    return (
        <Container x={props.x} y={props.y} anchor={0.5} eventMode="static" onmousedown={props.onDown}>
            <Graphics draw={draw} />
        </Container>
    );
}