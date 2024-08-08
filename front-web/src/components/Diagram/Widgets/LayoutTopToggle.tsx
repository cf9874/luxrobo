import { Graphics as _Graphics } from 'pixi.js';
import { Container, Sprite, Graphics, Text } from '@pixi/react';
import { useCallback, useEffect, useState } from 'react';
import { DiagUtil } from '../Utils/Common';
import TextStyle from '../Utils/TextStyle';


export interface ILayoutTopToggleProps {

    x: number;
    y: number;

    isTop: boolean;

    onToggle: () => void;
}

export const LayoutTopToggle = (props: ILayoutTopToggleProps) => {

    const [toggleInfo, setToggleInfo] = useState({ icon: "icon_toggle_top", iconX: 0, text: "Top", textX: 0, color: "0xff0000" });

    const draw = useCallback((g: _Graphics) => {

        g.clear();

        g.beginFill(0xffffff);
        g.drawRoundedRect(0, 0, 110, 40, 20);

        g.beginFill(toggleInfo.color);
        g.drawRoundedRect(2, 2, 106, 36, 20);

        g.beginFill(0xffffff);
        g.drawCircle(toggleInfo.iconX, 20, 18);

        g.endFill();

    }, [toggleInfo]);

    useEffect(() => {

        setToggleInfo((props.isTop) ?
            ({ icon: "icon_toggle_top", iconX: 20, text: "Top", textX: 65, color: "0xff0000" }) :
            ({ icon: "icon_toggle_bottom", iconX: 90, text: "Bottom", textX: 40, color: "0x7c7cfc" }));

    }, [props.isTop]);
    
    return (
        <Container x={props.x} y={props.y} anchor={0.5} eventMode={"static"} onmousedown={props.onToggle}>
            <Graphics draw={draw} anchor={0.5} />
            <Sprite image={DiagUtil.imageUrl(toggleInfo.icon)} x={toggleInfo.iconX} y={20} anchor={0.5}></Sprite>
            <Text text={toggleInfo.text} x={toggleInfo.textX} y={20} anchor={0.5} style={TextStyle.getB(16, 0xffffff)}></Text>
            <Text text={toggleInfo.text.toUpperCase()} x={110} y={90} anchor={1} style={TextStyle.getB(40, toggleInfo.color)}></Text>
        </Container>
    );

}