import { Container, Graphics } from "@pixi/react";
import { useEffect, useCallback } from "react";
import { Graphics as _Graphics } from "pixi.js";
import { IDiagLine, IDiagVec2 } from "../Utils/Common";

export interface IDiagBlockLinkInfo {

    block_id: string;
    target_block_id: string;
    p1: IDiagVec2;
    p2: IDiagVec2;
}

export interface IDiagLogicLinkInfo {

    conns: IDiagVec2[];
    links: IDiagBlockLinkInfo[];
    mainLink: IDiagLine | null;
}

export interface IDiagLogicLinksProps {

    x: number;
    y: number;

    links: IDiagLogicLinkInfo;
}


export const DiagLogicLinks = (props: IDiagLogicLinksProps) => {

    const draw = useCallback((g: _Graphics) => {

        const drawLine = (line: IDiagLine) => {

            g.moveTo(line.p1.x, line.p1.y);
            if (line.p1.y === line.p2.y) {

                g.lineTo(line.p2.x, line.p2.y);
                
            } else {

                g.bezierCurveTo(line.p1.x, line.p1.y + ((line.p2.y - line.p1.y) / 3), line.p2.x, line.p2.y - ((line.p2.y - line.p1.y) / 1), line.p2.x, line.p2.y);
                
            }
            g.moveTo(0, 0);
        };

        g.clear();

        g.lineStyle(1, 0xb2b2b2);
        for (const l of props.links.links) {

            drawLine(l);
        }

        if (props.links.mainLink) {

            g.lineStyle(2, 0xb2b2b2);
            drawLine(props.links.mainLink);
        }

        g.beginFill(0xffffff);
        g.lineStyle(2, 0xb2b2b2);
        for (const c of props.links.conns) {

            g.drawCircle(c.x, c.y, 6);
        }

        for (const l of props.links.links) {
            g.drawCircle(l.p1.x, l.p1.y, 6);
        }

        g.endFill();

    }, [props.links]);

    useEffect(() => {

    }, []);

    return (
        <Container x={props.x} y={props.y}>
            <Graphics draw={draw} anchor={0.5} />
        </Container>
    );
}