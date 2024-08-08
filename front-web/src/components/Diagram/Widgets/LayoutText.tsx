import { Container, Sprite, Text } from "@pixi/react";
import { ILayoutDiagTextScheme } from "../Models/Block";

import TextStyle from '../Utils/TextStyle';
import { Texture, TextMetrics, FederatedPointerEvent } from "pixi.js";
import { IDiagVec2 } from "../Utils/Common";
import { IDiagMovaleWidget } from "../Utils/PointerHandler";

export interface IDiagLayoutTextProps extends IDiagMovaleWidget {

    font_size: number
    is_top: boolean;
    string: string;

    model: ILayoutDiagTextScheme;

    // 현재 에디터의 상태.
    isTop: boolean;

    onClick: (id: string, e?: FederatedPointerEvent) => void;
};

export interface IDiagLayoutTextModValues {

    pos: IDiagVec2;
    size: number;
    string: string;
}

export interface IDiagLayoutTextModifier {

    size: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    string: string;
};

export const DiagLayoutText = (props: IDiagLayoutTextProps) => {

    const isFront = props.isTop === props.is_top;

    const style = TextStyle.getB(props.font_size, (props.selected) ? (0xffffff) : (0x000000));
    const tm = TextMetrics.measureText(props.string, style);

    return (
        <Container x={props.pos.x} y={props.pos.y} anchor={0.5} eventMode="static" onmousedown={(e) => { if (isFront) props.onClick(props.id, e); }}>
            <Sprite texture={Texture.WHITE} tint={(isFront) ? (0xbbe6e9) : (0x808080)} width={tm.width*1.1} height={tm.height*1.1} alpha={(props.selected) ? (1) : (0)}></Sprite>
            <Text text={props.string} style={style}></Text>
        </Container>
    );
};