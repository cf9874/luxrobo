import { Container, Sprite, Text } from "@pixi/react";
import { useEffect, useState } from "react";
import { DiagBlockCategory, DiagBlockConst, IDiagLayoutBlock } from "../Models/Block";

import TextStyle from '../Utils/TextStyle';
import { DiagUtil } from "../Utils/Common";
import { FederatedPointerEvent, Texture } from "pixi.js";

export interface IDiagLayoutBlockAreaProps {

    id: string;

    x: number;
    y: number;

    model: IDiagLayoutBlock;

    selected: boolean;

    isTop: boolean;

    onClick: (id: string) => void;
}

// const calcArea = (isFront: boolean, model: IDiagLayoutBlock): { x: number, y: number, width: number, height: number } => {

//     return ((isFront) || (!DiagBlockConst.isDoubleSided(model.layoutInfo))) ?
//             ({
//                 x: (model.layoutInfo.out_shape_t[2].x - model.layoutInfo.out_shape_t[0].x) / 2 + model.layoutInfo.out_shape_t[0].x,
//                 y: (model.layoutInfo.out_shape_t[2].y - model.layoutInfo.out_shape_t[0].y) / 2 + model.layoutInfo.out_shape_t[0].y,
//                 width: model.layoutInfo.out_shape_t[2].x -  model.layoutInfo.out_shape_t[0].x,
//                 height: model.layoutInfo.out_shape_t[2].y - model.layoutInfo.out_shape_t[0].y
//             }) :
//             ({
//                 x: (model.layoutInfo.out_shape_b[2].x - model.layoutInfo.out_shape_b[0].x) / 2 + model.layoutInfo.out_shape_b[0].x,
//                 y: (model.layoutInfo.out_shape_b[2].y - model.layoutInfo.out_shape_b[0].y) / 2 + model.layoutInfo.out_shape_b[0].y,
//                 width: model.layoutInfo.out_shape_b[2].x -  model.layoutInfo.out_shape_b[0].x,
//                 height: model.layoutInfo.out_shape_b[2].y - model.layoutInfo.out_shape_b[0].y
//             });
// }

export const DiagLayoutBlockArea = (props: IDiagLayoutBlockAreaProps) => {

    const isFront = props.isTop === props.model.layoutInfo.is_top;

    const { x, y, width, height } = DiagBlockConst.calcArea(isFront, props.model);

    const innerLineWidth = 2;
    const innerProps = {
        width: width - (innerLineWidth * 2),
        height: height - (innerLineWidth * 2)
    };

    const tint = (props.model.layoutInfo.is_top) ? (0xff0000) : (0x0011ff);

    return (props.model.layoutInfo.is_placed) ?
        (
            <Container x={x + props.x} y={y + props.y} anchor={0.5} eventMode="static" onmousedown={() => { if (isFront) props.onClick(props.id); }}>
                <Sprite texture={Texture.WHITE} tint={tint} anchor={0.5} width={width} height={height}></Sprite>
                <Sprite texture={Texture.WHITE} tint={(props.selected) ? (tint) : (0xffffff)} anchor={0.5} {...innerProps}></Sprite>
                <Sprite image={DiagBlockConst.remoteImageUrl(props.model.icon)} anchor={0.5} scale={0.66} y={0}></Sprite>
                <Sprite texture={Texture.WHITE} tint={DiagBlockConst.lineColor(props.model)} anchor={0.5} width={8} height={2} y={-22}></Sprite>
                <Text text={DiagBlockConst.typeString(props.model)} style={TextStyle.getB(10, 0x000000)} anchor={0.5} y={22}></Text>
                {
                    (isFront) ? (<></>) : (<Sprite texture={Texture.WHITE} tint={0xe5e5e5} alpha={0.5} anchor={0.5} {...innerProps}></Sprite>)
                }
            </Container>
        ) :
        (<></>);
}