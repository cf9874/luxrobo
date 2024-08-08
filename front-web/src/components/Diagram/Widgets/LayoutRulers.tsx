import { Container, Graphics, Sprite, Text } from "@pixi/react";
import { useCallback } from "react";
import { FederatedPointerEvent, Texture, Graphics as _Graphics } from "pixi.js";
import { DiagUtil, IDiagVec2 } from "../Utils/Common";
import { IDiagMovaleWidget } from "../Utils/PointerHandler";

import TextStyle from "../Utils/TextStyle";
import { ILayoutDiagPos } from "../Models/Block";

export interface IDiagRulerProps extends IDiagMovaleWidget {

    length: ILayoutDiagPos;

    isTop: boolean;

    onClick: (id: string, e: FederatedPointerEvent) => void;
}


export interface IDiagLayoutRulersProps {

    x: number;
    y: number;

    rulers: IDiagRulerProps[];

    isTop: boolean;
}


export const DiagLayoutRulers = (props: IDiagLayoutRulersProps) => {

    // const extraY = 20;

    const drawArrow = (g: _Graphics, v: IDiagVec2, w: number, right?: boolean) => {

        const d = (right) ? (-w) : (w);

        g.moveTo(v.x, v.y);
        g.lineTo(v.x + d, (v.y - (w / 2)));
        g.lineTo(v.x + d, (v.y + (w / 2)));
        g.lineTo(v.x, v.y);
        g.closePath();
    };

    const getFillColor = (v: IDiagRulerProps) => {

        return (v.selected) ? (0x45d6df) : (0xa1a1a1);
    }

    const draw = useCallback((g: _Graphics) => {

        g.clear();

        const tr = 15;

        for (const r of props.rulers) {

            if (r.isTop !== props.isTop) {
                continue;
            }

            const fillColor = getFillColor(r);

            g.beginFill(fillColor);

            const { s, e } = (r.length.x > 0) ? ({ s: r.pos, e: DiagUtil.addVec2(r.pos, r.length) }) : ({ s: DiagUtil.addVec2(r.pos, r.length), e: r.pos });

            const offsetY = r.pos.y + r.length.r;

            g.lineStyle(1, fillColor);
            g.moveTo(s.x, s.y);
            g.lineTo(s.x, offsetY);

            g.moveTo(s.x, offsetY);
            g.lineTo(e.x, offsetY);

            g.moveTo(e.x, e.y);
            g.lineTo(e.x, offsetY);

            g.lineStyle(0);
            drawArrow(g, { x: s.x, y: offsetY }, tr);
            drawArrow(g, { x: e.x, y: offsetY }, tr, true);
        }

        g.endFill();

    }, [props.rulers]);

    const getAbsMax = (a: number, b: number) => {

        if (Math.abs(a) > Math.abs(b)) {
            return a;
        }
        
        return b;
    };

    const calcExtraY = (t: number) => {

        const c = 10;
        return (t > 0) ? (t + c) : (t - c);
    }

    const boundHeight = 40;

    return (
        <Container x={props.x} y={props.y}>
            <Graphics draw={draw} anchor={0.5} />
            {
                props.rulers.map((v) => {

                    if (props.isTop !== v.isTop) {
                        return;
                    }

                    return (
                        <Container key={DiagUtil.id()} {...v.pos} >
                            <Text anchor={0.5} text={`${Math.abs(v.length.x)}mm / 0º`} x={(v.length.x) / 2} y={calcExtraY(v.length.r)} style={TextStyle.getR(16, getFillColor(v))}></Text>
                            <Sprite eventMode="static" onmousedown={(e) => { v.onClick(v.id, e);}} texture={Texture.WHITE} alpha={0} y={v.length.r - (boundHeight / 2)} width={v.length.x} height={boundHeight}></Sprite>
                        </Container>
                    );
                })
            }
        </Container>
    );
}