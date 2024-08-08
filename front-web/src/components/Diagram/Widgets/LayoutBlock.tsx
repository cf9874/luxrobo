import { Container, Sprite, Text } from "@pixi/react";
import { DiagBlockConst, IDiagLayoutBlock } from "../Models/Block";

import TextStyle from '../Utils/TextStyle';
import { Cursor, FederatedPointerEvent, Texture } from "pixi.js";
import { DiagUtil, IDiagVec2 } from "../Utils/Common";
import { IDiagMovaleWidget } from "../Utils/PointerHandler";

export interface IDiagLayoutBlockProps extends IDiagMovaleWidget {

    is_placed: boolean;
    is_top: boolean;

    model: IDiagLayoutBlock;

    // 현재 에디터의 상태.
    isTop: boolean;

    back?: boolean;

    cellOffset?: IDiagVec2;

    cursor?: Cursor | string;

    onClick: (id: string, e?: FederatedPointerEvent) => void;
}

export const DiagLayoutBlock = (props: IDiagLayoutBlockProps) => {

    const isFront = props.isTop === props.is_top;
    const _isFront = (props.back) ? (!isFront) : (isFront);
    const { x, y, width, height } = DiagBlockConst.calcArea(_isFront, props.model);

    const innerLineWidth = 2;
    const innerProps = {
        width: width - (innerLineWidth * 2),
        height: height - (innerLineWidth * 2)
    };

    let tint = 0xff0000;
    if (props.back) {
        if (props.isTop) {
            tint = 0x0011ff;
        }
    } else {
        if (DiagBlockConst.isDoubleSided(props.model.layoutInfo)) {
            if (!props.isTop) {
                tint = 0x0011ff;
            }

        } else if (!props.is_top) {
            tint = 0x0011ff;
        }
    }
    // const tint = ((!props.back) && (DiagBlockConst.isDoubleSided(props.model.layoutInfo))) ?
    //     ((props.is_top) ? (0x0011ff) : (0xff0000)) :
    //     ((props.is_top) ? (0xff0000) : (0x0011ff));

    const blockScale = 0.67;

    // CAUTION : 픽시 버그인지 아래 2번 넣어야 대각선 실선이 사라진다.
    // <Sprite texture={Texture.WHITE} tint={(props.selected) ? (tint) : (0xffffff)} anchor={0.5} {...innerProps}></Sprite>
    return (props.model.layoutInfo.is_placed) ?
        (
            <Container cursor={(props.cursor) ? (props.cursor) : ("default")} x={x + props.pos.x} y={y + props.pos.y} angle={props.pos.r} anchor={0.5} eventMode="static" onmousedown={(e) => { if (isFront) props.onClick(props.id, e); }}>
                {
                    (props.cellOffset) ?
                        (<Sprite texture={Texture.WHITE} tint={tint} alpha={0.3} anchor={0.5} x={props.cellOffset.x} y={props.cellOffset.y} width={width} height={height}></Sprite>) :
                        (<></>)
                }
                <Sprite texture={Texture.WHITE} tint={tint} anchor={0.5} width={width} height={height}></Sprite>
                <Sprite texture={Texture.WHITE} tint={(props.selected) ? (tint) : (0xffffff)} anchor={0.5} {...innerProps}></Sprite>
                <Sprite texture={Texture.WHITE} tint={(props.selected) ? (tint) : (0xffffff)} anchor={0.5} {...innerProps}></Sprite>
                <Container cursor={(props.cursor) ? (props.cursor) : ("default")} scale={blockScale}>
                    <Sprite image={DiagBlockConst.remoteImageUrl(props.model.icon)} anchor={0.5} y={-6}></Sprite>
                    <Sprite texture={Texture.WHITE} tint={DiagBlockConst.lineColor(props.model)} anchor={0.5} width={12} height={3} y={-38}></Sprite>
                    <Text text={DiagBlockConst.typeString(props.model)} style={TextStyle.getB(14, 0x000000, 16)} anchor={0.5} y={30}></Text>
                </Container>
                {
                    (props.model.layoutInfo.is_auto) ?
                        (
                            <Container anchor={0.5} x={-width / 2} y={-height / 2}>
                                <Sprite image={DiagUtil.imageUrl("diag_menu")} anchor={0.5} tint={0x45d6df} scale={0.67} />
                                <Text text={"A"} style={TextStyle.getB(14, 0xffffff)} anchor={0.5}></Text>
                            </Container>
                        ) : (<></>)
                }
                {
                    ((props.model.layoutInfo.is_conflict) || (props.model.layoutInfo.is_escape)) ?
                        (
                            <Container anchor={0.5} x={-width / 2} y={-height / 2}>
                                <Sprite y={1} image={DiagUtil.imageUrl("diag_menu")} anchor={0.5} tint={0xe60000} scale={0.4} />
                                <Text text={"!"} style={TextStyle.getB(12, 0xffffff)} anchor={0.5}></Text>
                            </Container>
                        ) : (<></>)
                }
                {
                    (isFront) ? (<></>) : (<Sprite texture={Texture.WHITE} tint={0xe5e5e5} alpha={0.5} anchor={0.5} {...innerProps}></Sprite>)
                }
            </Container>
        ) :
        (<></>);
}