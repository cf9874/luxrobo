import { Graphics as _Graphics } from 'pixi.js';
import { Container, Sprite } from '@pixi/react';
import { DiagButton, IDiagBtnImage } from './Button';


export interface IDiagBaseMenuProps {

    x: number;
    y: number;

    onUndo: () => void;
    onRedo: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetView: () => void;
}

export const DiagBaseMenu = (props: IDiagBaseMenuProps) => {

    const backImage: IDiagBtnImage = { image: 'diag_menu', x: 0, y: 0 };

    const x = 0;
    const y = -2;

    const undoImages: IDiagBtnImage[] = [ backImage, { image: 'icon_undo', x, y } ];
    const redoImages: IDiagBtnImage[] = [ backImage, { image: 'icon_redo', x, y } ];
    const zInImages: IDiagBtnImage[] = [ backImage, { image: 'icon_zoomin', x, y } ];
    const zOutImages: IDiagBtnImage[] = [ backImage, { image: 'icon_zoomout', x, y } ];
    const resetImages: IDiagBtnImage[] = [ backImage, { image: 'icon_reset_screen', x, y } ];

    return (
        <Container anchor={0.5} x={props.x} y={props.y}>
            <DiagButton x={0} y={0} images={undoImages} onClick={() => { props.onUndo(); }}></DiagButton>
            <DiagButton x={0} y={64} images={redoImages} onClick={() => { props.onRedo(); }}></DiagButton>
            <DiagButton x={0} y={64*2} images={zInImages} onClick={() => { props.onZoomIn(); }}></DiagButton>
            <DiagButton x={0} y={64*3} images={zOutImages} onClick={() => { props.onZoomOut(); }}></DiagButton>
            <DiagButton x={0} y={64*4} images={resetImages} onClick={() => { props.onResetView(); }}></DiagButton>
        </Container>
    );

}