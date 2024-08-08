import { Container, Sprite } from "@pixi/react";
import { useEffect,  } from "react";
import { FederatedPointerEvent, Graphics as _Graphics, Texture, EventMode } from "pixi.js";
import { IDiagPowerNet } from "./PowerNets";
import { DiagUtil } from "../Utils/Common";

export interface IDiagPowerNetsEventProps {

    x: number;
    y: number;

    nets: IDiagPowerNet[];

    em: EventMode;

    onPointerMove: (e: FederatedPointerEvent, net_name: string) => void;
    onPointerUp: (e: FederatedPointerEvent, net_name: string) => void;
}

export const DiagPowerNetsEvent = (props: IDiagPowerNetsEventProps) => {

    useEffect(() => {

    }, []);

    return (
        <Container x={props.x} y={props.y}>
            {
                props.nets.map((v) => {

                    return <Sprite eventMode={props.em} key={DiagUtil.id()} texture={Texture.WHITE} alpha={0} x={v.x} y={v.y} width={v.w} height={v.h} onmousemove={(e: FederatedPointerEvent) => { props.onPointerMove(e, v.info.net_name); }} onmouseup={(e: FederatedPointerEvent) => { props.onPointerUp(e, v.info.net_name); }}></Sprite>;

                })
            }            
        </Container>
    );
}