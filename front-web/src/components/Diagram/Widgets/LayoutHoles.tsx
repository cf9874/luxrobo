import { Container, Graphics, Sprite } from "@pixi/react";
import { useCallback } from "react";
import { Graphics as _Graphics, FederatedPointerEvent, Texture } from "pixi.js";
import { IDiagMovaleWidget } from "../Utils/PointerHandler";
import { ILayoutDiagHoleScheme } from "../Models/Block";

export interface IDiagLayoutHoleProps extends IDiagMovaleWidget {

    model: ILayoutDiagHoleScheme;
    diameter: number;
    isTop: boolean;
}

export interface IDiagLayoutHolesProps {

    x: number;
    y: number;

    holes: IDiagLayoutHoleProps[];

    onClick: (id: string, e?: FederatedPointerEvent) => void;
}


export const DiagLayoutHoles = (props: IDiagLayoutHolesProps) => {

    const draw = useCallback((g: _Graphics) => {

        g.clear();

        g.lineStyle(0);

        let select: IDiagLayoutHoleProps | undefined;
        g.beginFill(0x000000);
        for (const h of props.holes) {

            if (h.selected) {
                select = h;
                continue;                
            }
            g.drawCircle(h.pos.x, h.pos.y, h.diameter);
        }        
        g.endFill();

        if (select) {
            g.beginFill(0xff0000);
            g.drawCircle(select.pos.x, select.pos.y, select.diameter);
            g.endFill();
        }

    }, [props.holes]);

    return (
        <Container x={props.x} y={props.y}>
            <Graphics draw={draw} anchor={0.5} />
            {
                (props.holes.map((h) => (<Sprite key={h.id} {...h.pos} anchor={0.5} eventMode={"static"} texture={Texture.WHITE} alpha={0} width={h.diameter * 2} height={h.diameter * 2} onmousedown={(e) => { props.onClick(h.id, e); }}></Sprite>)))
            }
        </Container>
    );
}