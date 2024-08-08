import { Graphics as _Graphics } from 'pixi.js';
import { Container, Sprite } from '@pixi/react';
import { DiagButton, IDiagBtnImage } from './Button';
import { IDiagLayoutBlockProps } from './LayoutBlock';
import { IDiagVec2 } from '../Utils/Common';
import { DiagBlockConst } from '../Models/Block';
import { useEffect, useState } from 'react';


export interface IDiagLayoutBlockMenuProps {

    x: number;
    y: number;

    selectedBlocks: IDiagLayoutBlockProps[];

    zoomScale: number;

    onInfo: () => void;
    onRotate: () => void;
    onChange: () => void;
    onDelete: () => void;
}

const calcCenter = (targets: IDiagLayoutBlockProps[]): IDiagVec2 => {

    let x = Infinity, y = Infinity, ex = 0, ey = 0;
    for (const t of targets) {

        const area = DiagBlockConst.calcArea4CD(true, t.model);

        const tx = t.pos.x + area.x;
        const ty = t.pos.y + area.y;

        x = Math.min(x, tx);
        y = Math.min(y, ty);
        ex = Math.max(ex, tx + area.width);
        ey = Math.max(ey, ty + area.height);
    }
    
    return { x: (ex - x) / 2 + x, y: (ey - y) / 2 + y };
}

export const DiagLayoutBlockMenu = (props: IDiagLayoutBlockMenuProps) => {

    const [center, setCenter] = useState({ x: 0, y: 0});

    const backImage: IDiagBtnImage = { image: 'diag_menu', x: 0, y: 0, scale: 0.5 };
    const disableBackImage: IDiagBtnImage = { image: 'diag_menu', x: 0, y: 0, scale: 0.5, tint: 0x8b8b8b };

    const x = 0;
    const y = -1;
    const scale = undefined;

    const infoImages: IDiagBtnImage[] = [ backImage, { image: 'icon_info', x, y, scale } ];
    const disableInfoImages: IDiagBtnImage[] = [ disableBackImage, { image: 'icon_info', x, y, scale } ];
    const rotateImages: IDiagBtnImage[] = [ backImage, { image: 'icon_rotate', x, y, scale } ];
    const changeImages: IDiagBtnImage[] = [ backImage, { image: 'icon_change', x, y, scale } ];
    const closeImages: IDiagBtnImage[] = [ backImage, { image: 'icon_close', x, y, scale } ];

    useEffect(() => {

        setCenter(calcCenter(props.selectedBlocks));

    }, [props.selectedBlocks]);

    return (
        <Container anchor={0.5} scale={props.zoomScale} x={(props.x + center.x) * props.zoomScale} y={(props.y + center.y) * props.zoomScale}>
            <DiagButton x={-42} y={0} images={(props.selectedBlocks.length === 1) ? (infoImages) : (disableInfoImages)} onClick={() => { if (props.selectedBlocks.length === 1) props.onInfo(); }}></DiagButton>
            <DiagButton x={-14} y={0} images={rotateImages} onClick={() => { props.onRotate(); }}></DiagButton>
            <DiagButton x={14} y={0} images={changeImages} onClick={() => { props.onChange(); }}></DiagButton>
            <DiagButton x={42} y={0} images={closeImages} onClick={() => { props.onDelete(); }}></DiagButton>
        </Container>
    );

}