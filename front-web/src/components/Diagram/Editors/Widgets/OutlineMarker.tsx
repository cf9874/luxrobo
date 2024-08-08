import { Container, Text } from "@pixi/react";
import { DiagButton } from "components/Diagram/Widgets/Button";

import TextStyle from '../../Utils/TextStyle';
import { FederatedPointerEvent } from "pixi.js";

export interface IDiagOutlineMarkerProps {

    x: number;
    y: number;
    r: number;

    id: string;
    text: string;

    selected: boolean;

    onClick: (id: string) => void;
    onUp: (e: FederatedPointerEvent | undefined) => void;

    zoomScale: number;
}


const DiagOutlineMarker = (props: IDiagOutlineMarkerProps) => {

    return (
        <Container x={props.x * props.zoomScale} y={props.y * props.zoomScale} anchor={0.5}>
            <DiagButton x={0} y={0} images={[{ image: 'diag_menu', tint: (props.selected) ? (0x45d6df) : (0xffffff), x: 0, y: 0 }]} onClick={() => { props.onClick(props.id); }} onUp={(e) => { props.onUp(e); }} />
            <Text eventMode="none" text={props.text} style={TextStyle.getB(20, (props.selected) ? (0xffffff) : (0x45d6df))} anchor={0.5}></Text>
        </Container>
    );

};

export default DiagOutlineMarker;