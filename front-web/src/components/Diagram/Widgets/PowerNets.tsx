import { Container, Graphics } from "@pixi/react";
import { useEffect, useCallback } from "react";
import { Graphics as _Graphics } from "pixi.js";
import { IDiagPowerNetInfoScheme } from "../Models/Block";

export interface IDiagPowerNet {

    info: IDiagPowerNetInfoScheme;

    x: number;
    y: number;
    w: number;
    h: number;
}


export interface IDiagPowerNetsProps {

    x: number;
    y: number;

    nets: IDiagPowerNet[];
}

export const DiagPowerNets = (props: IDiagPowerNetsProps) => {

    const draw = useCallback((g: _Graphics) => {

        g.clear();

        g.beginFill(0xffffff, 0.5);
        g.lineStyle(2, 0xb2b2b2, 1);
        for (const n of props.nets) {
            g.drawRoundedRect(n.x, n.y, n.w, n.h, 24);
        }
        g.endFill();

    }, [props.nets]);

    useEffect(() => {

    }, []);

    return (
        <Container x={props.x} y={props.y} >
            <Graphics draw={draw} anchor={0.5} />
        </Container>
    );
}