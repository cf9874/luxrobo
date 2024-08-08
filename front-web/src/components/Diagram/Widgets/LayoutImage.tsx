import { Container, Sprite, Text } from "@pixi/react";
import { ILayoutDiagImageScheme } from "../Models/Block";
import { Texture, Circle, FederatedPointerEvent } from "pixi.js";
import { IDiagMovaleWidget } from "../Utils/PointerHandler";

export interface IDiagLayoutImageProps extends IDiagMovaleWidget {

    is_top: boolean;
    image_str: string;

    width: number;
    height: number;

    model: ILayoutDiagImageScheme;

    // 현재 에디터의 상태.
    isTop: boolean;

    onClick: (id: string, e?: FederatedPointerEvent) => void;
};

export const DiagLayoutImage = (props: IDiagLayoutImageProps) => {

    const isFront = props.isTop === props.is_top;

    return (
        <Container x={props.pos.x} y={props.pos.y} anchor={0.5} eventMode="static" onmousedown={(e) => { if (isFront) props.onClick(props.id, e); }}>
            <Sprite anchor={0.5} image={props.image_str} width={props.width} height={props.height}></Sprite>
            <Sprite anchor={0.5} texture={Texture.WHITE} tint={0x000000} alpha={(isFront) ? (0) : (0.5)} width={props.width} height={props.height} />
        </Container>
    );
};