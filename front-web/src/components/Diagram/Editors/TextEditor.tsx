import { IDiagGridProps } from "../Widgets/Grid";
import { EPointerType, IDiagMovaleWidget, IDiagPointerHandler } from "../Utils/PointerHandler";

import { PointerHandler } from "../Utils/PointerHandler";
import { DiagLayoutText, IDiagLayoutTextModifier, IDiagLayoutTextProps } from "../Widgets/LayoutText";
import { Cursor, FederatedPointerEvent } from "pixi.js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LayoutDiagLayout } from "../Parsers/LayoutDiagLayout";
import { DiagUtil, IDiagVec2 } from "../Utils/Common";
import { KeyboardUtil } from "../Utils/Keyboard";
import { stat } from "fs";

export interface IDiagTextEditorProps {

    texts: IDiagLayoutTextProps[];

    pointerHandler: IDiagPointerHandler;

    gridProps: IDiagGridProps;

    isTop: boolean;

    // modifier: IDiagLayoutTextModifier | undefined;

    onPointerDown: (id: string) => void;

    onUpdateProps: (updateTextProps: IDiagLayoutTextProps[], selectedTextProp?: IDiagLayoutTextProps) => void;

    onUpdateCursor: (cursor: Cursor | string) => void;

    onEscape: () => void;

    gridPos: IDiagVec2;
    zoomScale: number;
}

let textProps: IDiagLayoutTextProps[] = [];
// let lastSelectedText: IDiagLayoutTextProps | undefined;

let cachedGridPos: IDiagVec2;
let cachedZoomScale = 1;

const DiagTextEditor = (props: IDiagTextEditorProps) => {

    const [draggingText, setDraggingText] = useState(undefined as undefined | IDiagLayoutTextProps);
    const [pos, setPos] = useState({ x: 0, y: 0, r: 0});

    // textProps = props.texts;

    useEffect(() => {

        textProps = props.texts;

    }, [props.texts]);

    useEffect(() => {

        cachedGridPos = props.gridPos;

    }, [props.gridPos]);

    useEffect(() => {
        cachedZoomScale = 1 / props.zoomScale;
    }, [props.zoomScale]);

    const newText = (x: number, y: number) => {

        const font_size = 12;
        const string = 'Text';

        return LayoutDiagLayout.parseText({
            font_size,
            is_top: props.isTop,
            pos: { x, y, r: 0 },
            string,
            stroke_width: 5
        }, props.onPointerDown);
    }

    const onNewText = (e: FederatedPointerEvent) => {

        const x = (e.screen.x - cachedGridPos.x) * cachedZoomScale;
        const y = (e.screen.y - cachedGridPos.y) * cachedZoomScale;
        
        textProps.push(newText(x, y));

        // if (lastSelectedText) {
        //     lastSelectedText.selected = false;
        // }

        // const c = textProps[textProps.length - 1];
        // lastSelectedText = c;
        // // lastSelectedText.selected = true;
        // props.onUpdateProps(textProps, c);
        props.onUpdateProps(textProps, undefined);

        console.log(textProps.length);

        // if (setDW) {
        //     setDW({ ...newText(x, y) });
        // }

        setDraggingText({ ...newText(x, y) });
    }

    const onUpdateTexts = (target: IDiagMovaleWidget | undefined, state: EPointerType, e?: FederatedPointerEvent) => {

        // setTexts([...props.textProps]);

        // console.log(target);
        if (state === EPointerType.Up) {

            if ((target) && (e)) {
                onNewText(e);
            }
            

            // if (target) {

            //     // props.onUpdateProps([...textProps]);

            // } else if (e) {

            //     // new text
            //     // onNewText(e);
            // }

        }/* else if (target) {

            const t = target as IDiagLayoutTextProps;
            if (t) {
                lastSelectedText = t;
                props.onUpdateProps([...textProps], t);
            }
        }*/
    };

    // PointerHandler.listenMovable(props.pointerHandler, props.texts, { x: props.gridProps.sx, y: props.gridProps.sy }, onUpdateTexts);
    PointerHandler.listenMovable(props.pointerHandler, props.texts, { x: props.gridProps.sx, y: props.gridProps.sy }, onUpdateTexts, draggingText, undefined, (e, target) => {

        const t = target as IDiagLayoutTextProps;
        if (t) {

            t.pos.x = (e.screenX - cachedGridPos.x) * cachedZoomScale;
            t.pos.y = (e.screenY - cachedGridPos.y) * cachedZoomScale;

            setPos({...t.pos});

            // lastSelectedText = t;
            // props.onUpdateProps([...textProps], t);
        }

        return false;

    });

    useEffect(() => {
        
        props.onUpdateCursor("text");

        // if (textProps.length > 0) {
        //     lastSelectedText = textProps[0];
        //     lastSelectedText.selected = true;
        //     props.onUpdateProps(textProps, lastSelectedText);
        // }

        // if (setDW) {
        //     setDW(newText(-1000, 0));
        // }

        setDraggingText(newText(-1000, 0));

        return () => {

            for (let t of textProps) {

                t.selected = false;
            }

            // lastSelectedText = undefined;
            props.onUpdateProps(textProps);

            props.onUpdateCursor("default");
        };

    }, []);

    // useEffect(() => {

    //     if ((lastSelectedText) && (props.modifier)) {

    //         lastSelectedText.font_size = props.modifier.size;
    //         lastSelectedText.string = props.modifier.string;
    //         // setTexts([...props.textProps]);
    //         props.onUpdateProps([...textProps]);
    //     }

    // }, [props.modifier]);

    useEffect(() => {

        textProps = props.texts;

    }, [props.texts]);

    KeyboardUtil.listen(undefined, undefined, (key: string) => {

        if (key === 'Escape') {
            props.onEscape();
        }

    });

    // return (
    //     props.texts.map(t => (<DiagLayoutText key={t.id} {...t} isTop={props.isTop}></DiagLayoutText>))
    // );

    return (
        (draggingText) ?
            (<DiagLayoutText key={draggingText.id} {...draggingText} isTop={props.isTop} pos={pos}></DiagLayoutText>) :
            (<></>)
    );
}

export default DiagTextEditor;