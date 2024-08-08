import { Graphics as _Graphics } from 'pixi.js';
import { Container, Sprite } from '@pixi/react';
import { DiagButton, IDiagBtnImage } from './Button';
import { DiagSwitch } from './Switch';
import { useState } from 'react';


export interface IDiagLayoutMenuProps {

    x: number;
    y: number;

    activeId: string;
    onSetActiveId: (id: string) => void;

    onSetting: (a?: string) => void;
    onRuler: (d?: string) => void;
    onText: (d?: string) => void;
    onImage: (d?: string) => void;
    onHole: (d?: string) => void;
    onOutline: (d?: string) => void;
}

export enum ELayoutEditMode {

    None,
    Ruler,
    Text,
    Hole,
    Outline,
    ImportOutline,
    ImportImage,
    PlaceImage,
    OpenTextEditor,
    OpenHoleEidotr
}

export const DiagLayoutMenu = (props: IDiagLayoutMenuProps) => {

    const backImage: IDiagBtnImage = { image: 'diag_menu', x: 0, y: 0 };
    
    const x = 0;
    const y = -2;

    const settingImages: IDiagBtnImage[] = [ backImage, { image: 'icon_setting', x, y } ];
    const rulerImages: IDiagBtnImage[] = [ backImage, { image: 'icon_ruler', x, y } ];
    const textImages: IDiagBtnImage[] = [ backImage, { image: 'icon_text', x, y } ];
    const importImages: IDiagBtnImage[] = [ backImage, { image: 'icon_image', x, y } ];
    const holeImages: IDiagBtnImage[] = [ backImage, { image: 'icon_hole', x, y } ];
    const outlineImages: IDiagBtnImage[] = [ backImage, { image: 'icon_outline', x, y } ];

    const downTiltColors = [0x45d6df, 0x45d6df];

    const handleAction = (groupId: string, action: (d?: string) => void, actionData?: string) => {

        if ((!actionData) || ((actionData) && (actionData === 'active'))) {

            props.onSetActiveId(groupId);
        }

        action(actionData);
    };

    return (
        <Container anchor={0.5} x={props.x} y={props.y}>
            <DiagButton x={65} y={-64} images={settingImages} onClick={(e, d) => { handleAction('setting', props.onSetting, d); }}></DiagButton>
            <DiagSwitch groupId={'ruler'} groupActiveId={props.activeId} downTiltColors={downTiltColors} x={0} y={0} images={rulerImages} onClick={(e, d) => { handleAction('ruler', props.onRuler, d); }}></DiagSwitch>
            <DiagSwitch groupId={'text'} groupActiveId={props.activeId} downTiltColors={downTiltColors} x={0} y={64} images={textImages} onClick={(e, d) => { handleAction('text', props.onText, d); }}></DiagSwitch>
            <DiagSwitch groupId={'image'} groupActiveId={props.activeId} downTiltColors={downTiltColors} x={0} y={64*2} images={importImages} onClick={(e, d) => { handleAction('image', props.onImage, d); }}></DiagSwitch>
            <DiagSwitch groupId={'hole'} groupActiveId={props.activeId} downTiltColors={downTiltColors} x={0} y={64*3} images={holeImages} onClick={(e, d) => { handleAction('hole', props.onHole, d); }}></DiagSwitch>
            <DiagSwitch groupId={'outline'} groupActiveId={props.activeId} downTiltColors={downTiltColors} x={0} y={64*4} images={outlineImages} onClick={(e, d) => { handleAction('outline', props.onOutline, d); }}></DiagSwitch>
        </Container>
    );

}