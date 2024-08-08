import { useEffect, useState } from "react"

import { Container } from '@pixi/react';

import { FederatedPointerEvent } from "pixi.js";
import { IDiagLayoutBlockProps } from "../Widgets/LayoutBlock";
import { IDiagGridProps } from "../Widgets/Grid";
import { EPointerType, IDiagMovaleWidget, IDiagPointerHandler } from "../Utils/PointerHandler";
import { DiagBlockConst } from "../Models/Block";
import { DiagLayoutBlockMenu } from "../Widgets/LayoutBlockMenu";

import { KeyboardUtil } from "../Utils/Keyboard";
import { PointerHandler } from "../Utils/PointerHandler";
import { DiagUtil, IDiagVec2 } from "../Utils/Common";
import { IDiagLayoutTextProps } from "../Widgets/LayoutText";
import { IDiagLayoutImageProps } from "../Widgets/LayoutImage";
import { IDiagRulerProps } from "../Widgets/LayoutRulers";
import { IDiagLayoutHoleProps } from "../Widgets/LayoutHoles";

export interface IDiagLayoutEditorProps {

    x: number;
    y: number;

    width: number;
    height: number;

    pointerHandler: IDiagPointerHandler;

    blocks: IDiagLayoutBlockProps[];
    texts: IDiagLayoutTextProps[];
    images: IDiagLayoutImageProps[];
    rulers: IDiagRulerProps[];
    holes: IDiagLayoutHoleProps[];

    gridProps: IDiagGridProps;
    isTop: boolean;

    dragBlockId: string;

    gridPos: IDiagVec2;
    zoomScale: number;

    clearDiagram?: string;

    onUpdateBlocks: (blocks: IDiagLayoutBlockProps[], draggingBlock?: IDiagLayoutBlockProps, updateJson?: boolean) => void;

    onUpdateImages: (r: IDiagLayoutImageProps[]) => void;
    onUpdateTexts: (r: IDiagLayoutTextProps[]) => void;
    onUpdateHoles: (r: IDiagLayoutHoleProps[]) => void;
    onUpdateRulers: (r: IDiagRulerProps[]) => void;

    onUpdateJson: () => void;

    onOpenTextUi: (id: string) => void;
    onOpenHoleUi: (id: string) => void;
    onCloseNonBlockUi: (id: string) => void;

    onInfo: (id: string[]) => void;
    onRotate: (id: string[], d?: number) => void;
    onChangeLayer: (id: string[]) => void;
    onDelete: (id: string[]) => void;
}

enum EditMode {

    Default,
    Rotate
};

let editMode = EditMode.Default;

let blockProps: IDiagLayoutBlockProps[] = [];
let textProps: IDiagLayoutTextProps[] = [];
let imageProps: IDiagLayoutImageProps[] = [];
let rulerProps: IDiagRulerProps[] = [];
let holeProps: IDiagLayoutHoleProps[] = [];

let draggingBlock: IDiagLayoutBlockProps | undefined;
let cachedSelectedBlocks: IDiagLayoutBlockProps[] = [];

let cachedGridPos: IDiagVec2;
let cachedZoomScale = 1;

let cachedShiftDown: boolean;

let onUpdateSelectedNonBlock: (() => void) | undefined;
let onDeleteSelectedNonBlock: (() => void) | undefined;

let lastUpPos = { x: 0, y: 0, timeStamp: 0 };

// let lastDownPos = { x: 0, y: 0, timeStamp: 0};

let isMove = false;

let selectedNonBlock: IDiagMovaleWidget | undefined;

let cachedIsTop = true;

const movementOffset = { x: 0, y: 0 };

const DiagLayoutEditor = (props: IDiagLayoutEditorProps) => {

    const onCheckPlaceBlock = () => {

        if (draggingBlock) {

            if (cachedSelectedBlocks.length === 0) {

                const o = getCellOffset(draggingBlock);
    
                draggingBlock.pos.x = draggingBlock.pos.x + o.x;
                draggingBlock.pos.y = draggingBlock.pos.y + o.y;
                draggingBlock.selected = false;
    
                props.onUpdateBlocks(blockProps, undefined, true);
            }

            draggingBlock = undefined;
        }
    }

    const shiftDown = KeyboardUtil.listen();

    useEffect(() => {

        cachedShiftDown = shiftDown;

    }, [shiftDown]);

    useEffect(() => {

        cachedIsTop = props.isTop;

    }, [props.isTop]);

    // const [draggingBlock, setDraggingBlock] = useState(undefined as IDiagLayoutBlockProps | undefined);
    const [selectedBlocks, setSelectedBlocks] = useState([] as IDiagLayoutBlockProps[]);

    useEffect(() => {

        cachedGridPos = props.gridPos;

    }, [props.gridPos]);

    useEffect(() => {

        cachedZoomScale = 1 / props.zoomScale;

    }, [props.zoomScale]);

    const clearBlockProps = () => {

        for (const b of blockProps) {

            b.selected = false;
        }
    }
    
    const setCachedSelectedBlock = (set: IDiagLayoutBlockProps[]) => {

        cachedSelectedBlocks = set;
        setSelectedBlocks([...cachedSelectedBlocks]);
    }

    const updateMovementOffset = (t: IDiagMovaleWidget, e: FederatedPointerEvent) => {

        movementOffset.x = (t.pos.x / cachedZoomScale) - e.screenX + cachedGridPos.x;
        movementOffset.y = (t.pos.y / cachedZoomScale) - e.screenY + cachedGridPos.y;
    };

    const applyMovementThing = (t: IDiagMovaleWidget, e: FederatedPointerEvent) => {

        t.pos.x = (e.screen.x + movementOffset.x - cachedGridPos.x) * cachedZoomScale;
        t.pos.y = (e.screen.y + movementOffset.y - cachedGridPos.y) * cachedZoomScale;
    };

    const onPointerDown = (id: string | undefined, e?: FederatedPointerEvent) => {

        if ((!id) || (!e)) {
            return;
        }

        const clicked = blockProps.find(v => v.id === id);
        if ((clicked) && (!draggingBlock)) {

            if (cachedShiftDown) {

                const idx = cachedSelectedBlocks.indexOf(clicked);
                if (idx > -1) {

                    draggingBlock = undefined;
                    clicked.selected = false;
                    cachedSelectedBlocks.splice(idx, 1);
                    setCachedSelectedBlock(cachedSelectedBlocks);
                    props.onUpdateBlocks(blockProps);
                    return;
                }

            } else {

                clearBlockProps();

                setCachedSelectedBlock([]);
            }

            clicked.selected = true;

            cachedSelectedBlocks.push(clicked);
            setCachedSelectedBlock(cachedSelectedBlocks);

            draggingBlock = clicked;

            updateMovementOffset(draggingBlock, e);

            props.onUpdateBlocks(blockProps, clicked);

            deselectAllNonBlock();
            updateAllNonBlock();

            // lastDownPos = {
            //     x: e.screen.x,
            //     y: e.screen.y,
            //     timeStamp: e.timeStamp
            // };         
        }
    };

    const onRotate = (e: FederatedPointerEvent) => {

        if (cachedSelectedBlocks.length > 0) {

            const t = cachedSelectedBlocks[0];
            const { width, height } = DiagBlockConst.calcArea(true, t.model);;

            const x = e.screenX - (t.pos.x + (width / 2));
            const y = e.screenY - (t.pos.y + (height / 2));

            let d = 0;
            if (Math.abs(x) > Math.abs(y)) {

                d = (x > 0) ? (90) : (270);

            } else {

                d = (y > 0) ? (180) : (0);
            }

            props.onRotate(cachedSelectedBlocks.map((v) => (v.model.block_id)), d);
        }

    }

    const onPointerMove = (e: FederatedPointerEvent | undefined) => {

        if (e) {

            if (editMode === EditMode.Rotate) {
            
                // const bound = 1;
                // const d = e.movement.x;
                // if ((d > bound) || (d < -bound)) {
                //     if ((e.timeStamp - rotSensitive) > 300) {
                //         props.onRotate(cachedSelectedBlocks.map((v) => (v.model.block_id)), (d > 0) ? (90) : (-90));
                //         rotSensitive = e.timeStamp;
                //     }
                // }

                onRotate(e);
    
            } else if (draggingBlock) {
    
                // if (DiagUtil.lengthVec2(e.screen, lastDownPos) < 3) {
    
                //     draggingBlock = undefined;
                //     return;
                // }

                setCachedSelectedBlock([]);
    
                applyMovementThing(draggingBlock, e);
    
                props.onUpdateBlocks(blockProps, draggingBlock);
            }

        }
    };

    const clearSelectedBlocks = () => {

        for (const b of cachedSelectedBlocks) {
            b.selected = false;
        }

        props.onUpdateBlocks(blockProps);
        setCachedSelectedBlock([]);
    };

    const getCellOffset = (t: IDiagLayoutBlockProps) => {

        return DiagBlockConst.getCellOffset({ ...t.pos }, props.gridProps.interval);
    };

    const onPointerUp = (e: FederatedPointerEvent | undefined) => {

        if (!e) {
            return;
        }

        if (e.eventPhase < 2) {
            return;
        }

        if (editMode === EditMode.Rotate) {
            
            //if (clearMode) {
                editMode = EditMode.Default;
//                clearMode = false;
                clearSelectedBlocks();
            // } else {
            //     clearMode = true;                
            // }
        }

        onCheckPlaceBlock();
    };

    const removeArray = (array: any[], t: any) => {
        
        array.splice(array.indexOf(t), 1);
    }

    const onDownNonBlock = (target: IDiagMovaleWidget) => {

        const deletedFunc = (array: any) => {

            if (selectedNonBlock) {
                removeArray(array, selectedNonBlock);
                if (!onUpdateSelectedNonBlock) {
                    throw new Error(`Invalid Proc!!!!!!!`);
                }

                onUpdateSelectedNonBlock();
            }
        };

        if (textProps.find((v) => (v.id === target.id))) {

            onUpdateSelectedNonBlock = () => { props.onUpdateTexts(textProps); };
            onDeleteSelectedNonBlock = () => { deletedFunc(textProps); };

        } else if (imageProps.find((v) => (v.id === target.id))) {

            onUpdateSelectedNonBlock = () => { props.onUpdateImages(imageProps); };
            onDeleteSelectedNonBlock = () => { deletedFunc(imageProps); };

        } else if (rulerProps.find((v) => (v.id === target.id))) {

            onUpdateSelectedNonBlock = () => { props.onUpdateRulers(rulerProps); };
            onDeleteSelectedNonBlock = () => { deletedFunc(rulerProps); };

        } else if (holeProps.find((v) => (v.id === target.id))) {

            onUpdateSelectedNonBlock = () => { props.onUpdateHoles(holeProps); };
            onDeleteSelectedNonBlock = () => { deletedFunc(holeProps); };

        } else {

            throw new Error(`Invalid Proc!!!!`);
        }
    };

    const updateAllNonBlock = () => {

        props.onUpdateTexts(textProps);
        props.onUpdateImages(imageProps);
        props.onUpdateRulers(rulerProps);
        props.onUpdateHoles(holeProps);
    };

    const deselectAllNonBlock = () => {

        textProps.forEach((v) => (v.selected = false));
        imageProps.forEach((v) => (v.selected = false));
        rulerProps.forEach((v) => (v.selected = false));
        holeProps.forEach((v) => (v.selected = false));
    };

    const onDoubleClick = (target: IDiagMovaleWidget) => {

        deselectAllNonBlock();
        target.selected = true;
        updateAllNonBlock();

        if (textProps.find((v) => (v.id === target.id))) {

            props.onOpenTextUi(target.id);

        } else if (imageProps.find((v) => (v.id === target.id))) {

            // INFO: Do nothing

        } else if (rulerProps.find((v) => (v.id === target.id))) {            

            // INFO: Do nothing

        } else if (holeProps.find((v) => (v.id === target.id))) {

            props.onOpenHoleUi(target.id);

        } else {

            throw new Error(`Invalid Proc!!!!`);
        }

    };

    const onUpdateNonBlocks = (target: IDiagMovaleWidget | undefined, state: EPointerType, e?: FederatedPointerEvent) => {

        if (target) {
            
            if (state === EPointerType.Down) {

                onDownNonBlock(target);
                deselectAllNonBlock();
                target.selected = true;
                isMove = false;

                updateAllNonBlock();

            } else if ((e) && (state === EPointerType.Up)) {

                if ((lastUpPos.timeStamp === 0) || ((e.timeStamp - lastUpPos.timeStamp) > 300)) {

                    lastUpPos = { x: e.screen.x, y: e.screen.y, timeStamp: e.timeStamp };
        
                } else {
        
                    if (DiagUtil.lengthVec2(e.screen, lastUpPos) < 3) {

                        onDoubleClick(target);

                    } else {

                        lastUpPos = { x: 0, y: 0, timeStamp: 0 };                        
                    }
                }
             
                if (onUpdateSelectedNonBlock) {

                    if (isMove) {
                        props.onUpdateJson();
                    }
                    
                    // onUpdateSelectedNonBlock = undefined;
                }
            }
        }

        selectedNonBlock = target;
    };

    PointerHandler.listenMovable(props.pointerHandler, [...props.images, ...props.texts, ...props.holes, ...props.rulers], { x: 0, y: 0 }, onUpdateNonBlocks, undefined, (d, t, e) => {

        if ((t) && (e)) {

            updateMovementOffset(t, e);
        }

        return true;

    }, (e, target) => {

        if (onUpdateSelectedNonBlock) {

            onUpdateSelectedNonBlock();
            isMove = true;
            applyMovementThing(target, e);
        }
        
        return false;
    });

    KeyboardUtil.listen(undefined, undefined, (key: string) => {

        if (key === 'Delete') {

            if (selectedNonBlock) {

                if (onDeleteSelectedNonBlock) {
                    onDeleteSelectedNonBlock();
                }
                
                selectedNonBlock = undefined;
            }
        }

        // } else if (key === 'Escape') {

        //     console.log(selectedNonBlock);
        // }
    });

    useEffect(() => {

        const funcs = PointerHandler.listen(props.pointerHandler, onPointerDown, onPointerMove, onPointerUp);

        return () => {
            
            props.pointerHandler.release(funcs);
            clearSelectedBlocks();

            // deselectAllNonBlock();
            // updateAllNonBlock();
        };

    }, []);

    useEffect(() => {

        if (props.dragBlockId !== '') {
            
            if (blockProps.length > 0) {

                const t = blockProps.find((v) => (v.model.block_id === props.dragBlockId));
                if (!t) {
                    throw new Error(`Not found block!`);
                }

                draggingBlock = t;
                draggingBlock.is_top = cachedIsTop;
                props.onUpdateBlocks(blockProps, t);
                t.model.layoutInfo.is_placed = true;

            } else {

                throw new Error(`No blocks!`);
            }

        } else if (draggingBlock) {

            draggingBlock = undefined;
        }

    }, [props.dragBlockId]);

    useEffect(() => {

        onCheckPlaceBlock();        
        cachedSelectedBlocks = [];
        setSelectedBlocks(cachedSelectedBlocks);

    }, [props.clearDiagram]);

    useEffect(() => { blockProps = props.blocks; }, [props.blocks]);
    useEffect(() => { textProps = props.texts; }, [props.texts]);
    useEffect(() => { imageProps = props.images; }, [props.images]);
    useEffect(() => { rulerProps = props.rulers; }, [props.rulers]);
    useEffect(() => { holeProps = props.holes; }, [props.holes]);

    const checkDo = (action: (id: string[]) => void) => {

        const t = cachedSelectedBlocks[0];
        action(cachedSelectedBlocks.map((v) => (v.model.block_id)));
        clearSelectedBlocks();
    };
    
    return (
        <Container x={props.x} y={props.y} anchor={0.5}>
            {
                (selectedBlocks.length > 0) ?
                    (<DiagLayoutBlockMenu x={props.gridPos.x * cachedZoomScale} y={props.gridPos.y * cachedZoomScale} selectedBlocks={selectedBlocks} zoomScale={props.zoomScale}
                        onInfo={() => { checkDo(props.onInfo); }}
                        onRotate={() => { editMode = EditMode.Rotate; }}
                        onChange={() => { checkDo(props.onChangeLayer); }}
                        onDelete={ () => { checkDo(props.onDelete); }}
                    />) :
                    (<></>)
            }      
        </Container>
    );
}

export default DiagLayoutEditor;