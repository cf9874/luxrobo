import { Container, Sprite, Text } from "@pixi/react";
import { useEffect, useState } from "react";
import { DiagBlockConst, IDiagBlock } from "../Models/Block";

import TextStyle from '../Utils/TextStyle';
import { DiagUtil } from "../Utils/Common";
import { FederatedPointerEvent } from "pixi.js";
import { IDiagMovaleWidget } from "../Utils/PointerHandler";

export interface IDiagBlockProps extends IDiagMovaleWidget {

    model: IDiagBlock;

    onClick: (id: string, e: FederatedPointerEvent) => void;
}

export const DiagBlock = (props: IDiagBlockProps) => {

    const [backImage, setBackImage] = useState(DiagBlockConst.defBackImg());

    useEffect(() => {

        setBackImage((props.selected) ? (DiagBlockConst.clickBackImg()) : (DiagBlockConst.defBackImg()));

    }, [props.selected]);

    return (
        <Container x={props.pos.x} y={props.pos.y} anchor={0.5} eventMode="static" onmousedown={(e: FederatedPointerEvent) => { props.onClick(props.id, e); }}>
            <Sprite image={DiagUtil.imageUrl(backImage.block)} anchor={0.5} ></Sprite>
            <Sprite image={DiagUtil.imageUrl(backImage.line)} anchor={0.5} y={backImage.lineOffset} tint={DiagBlockConst.lineColor(props.model)}></Sprite>
            <Sprite image={DiagBlockConst.remoteImageUrl(props.model.icon)} anchor={0.5} y={-14}></Sprite>
            <Text text={DiagBlockConst.typeString(props.model)} style={TextStyle.getB(14, 0x000000, 16)} anchor={0.5} y={24}></Text>
            <Text text={props.model.index} style={TextStyle.getB(12)} anchor={0.5} x={-34} y={-38}></Text>
            <Text text={props.model.part_name} style={TextStyle.getR(16)} anchor={0.5} y={60}></Text>
            {
                (props.model.is_updated) ?
                    (<Sprite image={DiagUtil.imageUrl('diag_menu')} tint={0xe60000} width={10} height={10} x={45} y={-57}></Sprite>) :
                    (<></>)
            }
        </Container>
    );
}