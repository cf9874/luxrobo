import { ColorSource, FederatedPointerEvent, Graphics as _Graphics } from 'pixi.js';
import { Container, Sprite } from '@pixi/react';
import { DiagUtil, IDiagVec2 } from "../Utils/Common";

// import { IBasePixiProps } from "type";

export interface IDiagBtnImage extends IDiagVec2 {

    image: string;
    scale?: number;
    tint?: ColorSource;
}


export interface IDiagButtonProps {

    x: number;
    y: number;

    images: IDiagBtnImage[];

    onClick?: (e: FederatedPointerEvent, data?: string) => void;
    onUp?: (e: FederatedPointerEvent, data?: string) => void;

    onGetDiagBtnTintColor?: (i: IDiagBtnImage) => ColorSource;
}

export const getDiagBtnTintColor = (i: IDiagBtnImage): ColorSource => {

    return (i.tint) ? (i.tint) : (0xffffff);
}

export const DiagButton = (props: IDiagButtonProps) => {

    const tint = (i: IDiagBtnImage): ColorSource => {

        if (props.onGetDiagBtnTintColor) {
            return props.onGetDiagBtnTintColor(i);
        }

        return getDiagBtnTintColor(i);
    }

    return (
        <Container anchor={0.5} x={props.x} y={props.y} eventMode={'static'} onmousedown={(e) => { if (props.onClick) props.onClick(e); }} onmouseup={(e) => { if (props.onUp) props.onUp(e); }}>
            { props.images.map((i) => (<Sprite key={DiagUtil.id()} anchor={0.5} image={DiagUtil.imageUrl(i.image)} scale={(i.scale) ? (i.scale) : (1)} tint={tint(i)} x={i.x} y={i.y}></Sprite>)) }
        </Container>
    );

}