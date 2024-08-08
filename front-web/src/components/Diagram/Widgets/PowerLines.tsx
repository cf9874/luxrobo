import { Container, Graphics } from "@pixi/react";
import { useEffect, useCallback } from "react";
import { ColorSource, Graphics as _Graphics } from "pixi.js";
import { IDiagVec2 } from "../Utils/Common";


export interface IDiagPowerLinesProps {

    x: number;
    y: number;

    width: number;
    height: number;

    lines: number[];

    lineColor: ColorSource;

    fillColor?: ColorSource;

    zoomScale?: number;
    offset?: IDiagVec2;
}


export const DiagPowerLines = (props: IDiagPowerLinesProps) => {

    const correctScale = () => {

        if ((props.zoomScale) && (props.zoomScale < 1)) {
    
          return 1 / props.zoomScale;
        }
    
        return 1;
    }

    const draw = useCallback((g: _Graphics) => {

        const scale = correctScale();
        const width = ((props.offset) ? (props.width - props.offset.x) : (props.width)) * scale;
        const height = ((props.offset) ? (props.height - props.offset.y) : (props.height)) * scale;

        g.clear();

        if (props.fillColor) {

            g.beginFill(props.fillColor);
            g.drawRect(0, 0, width, height);
            g.endFill();
        }

        g.lineStyle(2, props.lineColor, 1);
        for (let y of props.lines) {
            g.moveTo(0, y);
            g.lineTo(width, y);
        }

    }, [props.lines, props.offset, props.zoomScale]);

    return (
        <Container x={props.x} y={props.y}>
            <Graphics draw={draw} anchor={0.5} />
        </Container>
    );
}