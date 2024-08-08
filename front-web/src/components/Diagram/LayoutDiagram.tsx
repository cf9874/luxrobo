/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useRef, useState } from "react"

import { Stage, Container } from "@pixi/react"

import { ILayoutDiagProps } from "type"
import { Cursor, FederatedPointerEvent } from "pixi.js"
import { DiagBaseMenu } from "./Widgets/BaseMenu"
import { DiagLayoutMenu, ELayoutEditMode } from "./Widgets/LayoutMenu"
import { DiagGrid } from "./Widgets/Grid"
import { DiagLayoutBlock, IDiagLayoutBlockProps } from "./Widgets/LayoutBlock"
import { LayoutDiagLayout } from "./Parsers/LayoutDiagLayout"
import { DiagLayoutBoard } from "./Widgets/LayoutBoard"
import { DiagBlockConst, IDiagLayoutInfoScheme, ILayoutDiagPos } from "./Models/Block"
import { PointerHandler } from "./Utils/PointerHandler"
import DiagOutlineEditor, { IDiagOutlineEditorProps } from "./Editors/OutlineEditor"
import DiagTextEditor from "./Editors/TextEditor"
import DiagTextUiEditor from "./Editors/TextUiEditor"
import { DiagLayoutText, IDiagLayoutTextModifier, IDiagLayoutTextProps } from "./Widgets/LayoutText"
import DiagLayoutEditor, { IDiagLayoutEditorProps } from "./Editors/LayoutEditor"
import DiagImportImageEditor from "./Editors/ImportImageEditor"
import { DiagLayoutImage, IDiagLayoutImageProps } from "./Widgets/LayoutImage"
import DiagPlaceImageEditor from "./Editors/PlaceImageEditor"
import { DiagUtil, IDiagVec2 } from "./Utils/Common"
import { DiagLayoutHoles, IDiagLayoutHoleProps } from "./Widgets/LayoutHoles"
import DiagHoleEditor from "./Editors/HoleEditor"
import DiagHoleUiEditor from "./Editors/HoleUiEditor"
import { LayoutTopToggle } from "./Widgets/LayoutTopToggle"
import OutlineUiEditor from "./Editors/OutlineUiEditor"
import DiagImportOutlineEditor from "./Editors/ImportOutlineEditor"
import { DiagLayoutRulers, IDiagRulerProps } from "./Widgets/LayoutRulers"
import DiagRulerEditor from "./Editors/RulerEditor"

let blockProps: IDiagLayoutBlockProps[] = []
let draggingBlock: IDiagLayoutBlockProps | undefined
let shapeProps: ILayoutDiagPos[] = []
let textProps: IDiagLayoutTextProps[] = []
let imageProps: IDiagLayoutImageProps[] = []
let holeProps: IDiagLayoutHoleProps[] = []
let rulerProps: IDiagRulerProps[] = []
let cachedIsTop: boolean = true;

let cachedEditMode: ELayoutEditMode = ELayoutEditMode.None;

let cachedGridSize: number = 20;

const LayoutDiag = (props: ILayoutDiagProps) => {

  const rootRef = useRef(null);

  const [blocks, setBlocks] = useState(blockProps)
  const [shape, setShape] = useState(shapeProps)
  const [texts, setTexts] = useState(textProps)
  const [images, setImages] = useState(imageProps)
  const [holes, setHoles] = useState(holeProps)
  const [rulers, setRulers] = useState(rulerProps);

  const [clearDiagram, setClearDiagram] = useState('');

  const [isTop, setIsTop] = useState(cachedIsTop)
  const [editMode, setEditMode] = useState(ELayoutEditMode.None)
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  const [cursor, setCursor] = useState("default" as Cursor | string)

  const [textModifier, setTextModifier] = useState(undefined as undefined | IDiagLayoutTextModifier)
  const [textUiProps, setTextUiProps] = useState({ pos: { x: -1000, y: 0 }, size: 12, string: "Text" })

  const [draggingImage, setDraggingImage] = useState(undefined as IDiagLayoutImageProps | undefined)

  const [holeUiTarget, setHoleUiTarget] = useState({ pos: { x: -1000, y: 0 }, diameter: 5 })

  const [layoutMenuActiveId, setLayoutMenuActiveId] = useState('');

  useEffect(() => {

    cachedGridSize = props.gridSize;

  }, [props.gridSize]);

  useEffect(() => {

    cachedIsTop = isTop;

  }, [isTop]);

  useEffect(() => {

    cachedEditMode = editMode;

  }, [editMode]);

  const clearSelectedBlocks = () => {

    blockProps = blockProps.map((v) => {
      v.selected = false;
      return v;
    });

    setBlocks([...blockProps]);

    setClearDiagram(DiagUtil.id());
  }

  const onRelease = () => {

    clearSelectedBlocks();
    clearNonBlocks();

    props.onRelease();
  };

  const gridProps = {
    sx: 10,
    sy: 10,
    width: props.width,
    height: props.height,
    lineWidth: 1,
    lineColor: 0xe5e5e5,
    interval: props.gridSize,
    fillColor: 0xf0f0f0,
    cursor,

    onDown: (e: FederatedPointerEvent) => {

      props.menuHooks._internalProps.onStartDragGrid(e);
      onRelease();
    },
    onMove: props.menuHooks._internalProps.onDragGrid,
    onUp: (e: FederatedPointerEvent) => {
      props.menuHooks._internalProps.onEndDragGrid(e);
    },
  }

  const getCellOffset = (t: IDiagLayoutBlockProps) => {
    return DiagBlockConst.getCellOffset({ x: t.pos.x, y: t.pos.y }, cachedGridSize)
  }

  const { pointerHandler, onPointerDown, onPointerMove, onPointerUp } = PointerHandler.init();

  const checkUpMode = (): boolean => {

    switch (cachedEditMode) {

      case ELayoutEditMode.OpenTextEditor:
      case ELayoutEditMode.OpenHoleEidotr:
        return true;
    }

    return false;
  }

  useEffect(() => {

    const funcs = PointerHandler.listen(pointerHandler, undefined, undefined, (e) => {

      if ((e) && (e.eventPhase > 1) && (checkUpMode())) {
  
        onCloseNonBlockUi();
      }

      return () => {
            
          pointerHandler.release(funcs);
      };
  
    });

  }, []);

  useEffect(() => {
    const i = LayoutDiagLayout.layout({ x: 0, y: 0 }, props.json, onPointerDown)

    blockProps = i.blocks
    textProps = i.texts
    imageProps = i.images
    shapeProps = i.shape
    holeProps = i.holes

    setBlocks([...i.blocks])
    setShape([...i.shape])
    setTexts([...i.texts])
    setImages([...i.images])
    setHoles([...i.holes])
  }, [props.json])

  const onUpdateJson = () => {
    const layout: IDiagLayoutInfoScheme = {
      hole_blocks: LayoutDiagLayout.convertHoleInfo(holeProps),
      image_blocks: LayoutDiagLayout.convertImageInfo(imageProps),
      layout_blocks: LayoutDiagLayout.convertBlockInfo(blockProps),
      shape: shapeProps,
      text_blocks: LayoutDiagLayout.convertTextInfo(textProps),
    }

    props.onUpdateJson(JSON.stringify({ layout }))
  }

  const onUpdateBlocks = (
    updatedBlockProps: IDiagLayoutBlockProps[],
    updatedDraggingBlock?: IDiagLayoutBlockProps,
    updateJson?: boolean,
  ) => {
    const ldb = draggingBlock

    draggingBlock = updatedDraggingBlock
    blockProps = updatedBlockProps
    setBlocks([...blockProps])

    if (updateJson) {
      if (ldb) {
        ldb.isTop = cachedIsTop;
        ldb.is_placed = true;
        props.onPlaceBlock(ldb.model.block_id, cachedIsTop);
      }

      onUpdateJson()
    }
  }

  const onUpdateImages = (r: IDiagLayoutImageProps[]) => { setImages([...(imageProps = r)]) };
  const onUpdateTexts = (r: IDiagLayoutTextProps[]) => { setTexts([...(textProps = r)]) };
  const onUpdateHoles = (r: IDiagLayoutHoleProps[]) => { setHoles([...(holeProps = r)]) };
  const onUpdateRulers = (r: IDiagRulerProps[]) => { setRulers([...(rulerProps = r)]) };

  const updateAllNonBlock = () => {

    onUpdateTexts(textProps);
    onUpdateImages(imageProps);
    onUpdateRulers(rulerProps);
    onUpdateHoles(holeProps);
};

  const deselectAllNonBlock = () => {

    textProps.forEach((v) => (v.selected = false));
    imageProps.forEach((v) => (v.selected = false));
    rulerProps.forEach((v) => (v.selected = false));
    holeProps.forEach((v) => (v.selected = false));
  };

  const onClearMode = () => {

    setEditMode(ELayoutEditMode.None);

    deselectAllNonBlock();
    updateAllNonBlock();

  }

  const onCloseNonBlockUi = () => {

    onClearMode();

    onUpdateJson();
  }

  const onOpenTextUi = (id: string) => {

    const t = textProps.find((v) => (v.id === id));
    if (!t) {
      throw new Error(`Not found block! (ID: ${id})`);
    }

    setTextUiProps({ pos: t.pos, size: t.font_size, string: t.string });
    setEditMode(ELayoutEditMode.OpenTextEditor);
  };

  const onOpenHoleUi = (id: string) => {

    const t = holeProps.find((v) => (v.id === id));
    if (!t) {
      throw new Error(`Not found block! (ID: ${id})`);
    }

    setHoleUiTarget({ ...t });
    setEditMode(ELayoutEditMode.OpenHoleEidotr);
  };

  const menuY = props.height - 288
  const testBoardScale = 1

  useEffect(() => {

    if (props.dragBlockId) {

      onClearMode();

    }

  }, [props.dragBlockId]);

  const layoutEditorProps: IDiagLayoutEditorProps = {
    x: 0,
    y: 0,

    width: props.width,
    height: props.height,

    pointerHandler,

    blocks,
    texts,
    images,
    rulers,
    holes,

    gridProps,
    isTop,

    dragBlockId: props.dragBlockId,

    gridPos: props.menuHooks._internalProps.gridPos,
    zoomScale: props.menuHooks._internalProps.zoomScale,

    clearDiagram,

    onUpdateBlocks,
    onUpdateImages,
    onUpdateTexts,
    onUpdateHoles,
    onUpdateRulers,
    
    onUpdateJson,

    onOpenTextUi,
    onOpenHoleUi,
    onCloseNonBlockUi,        

    onInfo: (ids: string[]) => {

        const filtered = blockProps.filter((v) => (ids.indexOf(v.model.block_id) > -1));

        for (const b of filtered) {
            props.onClick(b.model.block_id);
        }
    },
    onRotate: (ids: string[], d?: number) => {

        const filtered = blockProps.filter((v) => (ids.indexOf(v.model.block_id) > -1));

        if (d !== undefined) {

          for (const b of filtered) {
            b.pos.r = d;
          }

        } else {

          const delta = 90;
          for (const b of filtered) {

              b.pos.r += delta;
              if (b.pos.r >= 360) {
                b.pos.r -= 360;
              } else if (b.pos.r < 0) {
                b.pos.r += 360;
              }
          }
        }

        setBlocks([...blockProps])
        onUpdateJson()
    },
    onChangeLayer: (ids: string[]) => {

        const filtered = blockProps.filter((v) => (ids.indexOf(v.model.block_id) > -1));

        for (const b of filtered) {

            if (b.is_top !== isTop) {
                throw new Error(`Not found a block, ID: ${b.model.block_id}`)
            }

            b.is_top = !isTop
        }

        setBlocks([...blockProps])
        onUpdateJson()
    },
    onDelete: (ids: string[]) => {
      props.onDeleteBlocks(ids);
    }
  };

  const onEscape = () => {      
    setEditMode(ELayoutEditMode.None);
    setLayoutMenuActiveId('');
  };

  const outlineEditorProps: IDiagOutlineEditorProps = {
    x: 0,
    y: 0,

    pointerHandler,

    shape,

    gridProps,

    testBoardScale,

    onUpdateJson,
    onUpdateShape: shape => {
      setShape([...shape])
    },

    gridPos: props.menuHooks._internalProps.gridPos,
    zoomScale: props.menuHooks._internalProps.zoomScale,
  }

  const clearNonBlocks = () => {

    textProps.forEach((v) => (v.selected = false));
    imageProps.forEach((v) => (v.selected = false));
    rulerProps.forEach((v) => (v.selected = false));
    holeProps.forEach((v) => (v.selected = false));

    onUpdateTexts(textProps);
    onUpdateImages(imageProps);
    onUpdateRulers(rulerProps);
    onUpdateHoles(holeProps);
  };

  const checkSetEditMode = (active: boolean, mode: ELayoutEditMode) => {

    if (active) {
      clearNonBlocks();
      setEditMode(mode);
    } else {
      setEditMode(ELayoutEditMode.None);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  const onUpdateCursor = (cursor: Cursor | string) => {
    setCursor(cursor)
  }

  useEffect(() => {

    const t = textProps.find((v) => (v.selected));
    if ((t) && (textModifier)) {

        t.font_size = textModifier.size;
        t.string = textModifier.string;
        // setTexts([...props.textProps]);
        onUpdateTexts([...textProps]);
    }

  }, [textModifier]);

  const textEditorProps = {
    texts,
    pointerHandler,
    gridProps,
    isTop,
    // modifier: textModifier,
    onPointerDown,
    onUpdateProps: (updateTextProps: IDiagLayoutTextProps[], selectedTextProp?: IDiagLayoutTextProps) => {
      textProps = updateTextProps
      setTexts([...updateTextProps])

      if (selectedTextProp) {
        setTextUiProps({ pos: selectedTextProp.pos, size: selectedTextProp.font_size, string: selectedTextProp.string })
      } else {
        onUpdateJson()
      }
    },
    onEscape,
    onUpdateCursor,
    gridPos: props.menuHooks._internalProps.gridPos,
    zoomScale: props.menuHooks._internalProps.zoomScale,
  }

  const textUiEditorProps = {
    gridProps,
    target: textUiProps,
    onChnage: (m: IDiagLayoutTextModifier) => {
      setTextModifier({ ...m })
    },

    gridPos: props.menuHooks._internalProps.gridPos,
    zoomScale: props.menuHooks._internalProps.zoomScale,
    rootRef
  }

  const onImportOutline = (vertices: IDiagVec2[], size: { width: number; height: number }, offset?: IDiagVec2) => {

    if (vertices) {

      if (!offset) {
        throw new Error(`Required value$offset`);
      }
  
      setShape([...vertices.map(v => {
  
        return ({
          x: (v.x + offset.x) * size.width,
          y: (v.y + offset.y) * size.height,
          r: 0
        });
  
      })]);
    }

    setEditMode(ELayoutEditMode.Outline);
  }

  const createImage = (pos: ILayoutDiagPos, svg: string, width: number, height: number) => {

    return {
      id: DiagUtil.id(),
      pos: { ...pos },
      selected: true,
      is_top: isTop,
      image_str: svg,
      width,
      height,
      model: {
        image_str: svg,
        is_top: isTop,
        pos: { x: 0, y: 0, r: 0 },
        width,
        height,
      },
      isTop,
      onClick: onPointerDown,
    }
  }

  const onImportImage = (svg: string, size: { width: number; height: number }) => {
    if (svg === "") {
      setEditMode(ELayoutEditMode.None)
      return
    }

    setDraggingImage({ ...createImage({ x: 0, y: 0, r: 0}, svg, size.width, size.height) });
    setEditMode(ELayoutEditMode.PlaceImage)
  }

  const placeImageProps = {
    images,
    pointerHandler,
    draggingImage,
    gridProps,
    isTop,
    onUpdateImage: () => {
      setImages([...imageProps])
    },
    onPlaceImage: (u: IDiagLayoutImageProps) => {
      // setDraggingImage(undefined)

      // const exists = imageProps.find(i => i.id === u.id)
      // if (!exists) {
        imageProps.push(u)
      // }

      setImages([...imageProps])
      onUpdateJson();

      setDraggingImage({ ...createImage({ ...u.pos }, u.image_str, u.width, u.height) });
    },
    onEscape,
    gridPos: props.menuHooks._internalProps.gridPos,
    zoomScale: props.menuHooks._internalProps.zoomScale,
  }

  const holeEditProps = {
    holes,
    pointerHandler,
    onUpdateCursor,
    onUpdateHole: (_holes: IDiagLayoutHoleProps[]) => {

      onUpdateHoles(_holes)

      // console.log(_holes)
      // setHoles([..._holes])

      // const s = _holes.find(h => h.selected)
      // if (s) {
      //   setHoleUiTarget({ ...s })
      // }
    },
    onRelease: () => {
      setHoleUiTarget({ pos: { x: -1000, y: 0 }, diameter: 5 })
    },
    onEscape,
    isTop,
    gridPos: props.menuHooks._internalProps.gridPos,
    zoomScale: props.menuHooks._internalProps.zoomScale,
  }

  const holeUiEditorProps = {
    gridProps,
    target: holeUiTarget,
    onChange: (diameter: number) => {
      const t = holes.find(h => h.selected)
      if (t) {
        t.diameter = diameter
        setHoles([...holes])
      }
    },
    gridPos: props.menuHooks._internalProps.gridPos,
    zoomScale: props.menuHooks._internalProps.zoomScale,
    rootRef
  }

  const outlineUiEditorProps = {
    x: props.width - 350,
    y: 100,

    shape,
    onChange: (shape: ILayoutDiagPos[]) => {
      shapeProps = shape
      setShape([...shape])
      onUpdateJson()
    },
    onImport: () => {
      setEditMode(ELayoutEditMode.ImportOutline)
    },
  }

  const rulerEditorProps = {

    blocks: blockProps,
    rulers: rulers,
    pointerHandler,
    onUpdateRulers: (rulers: IDiagRulerProps[]) => { rulerProps = [...rulers]; setRulers([...rulerProps]); },
    onUpdateCursor,
    onEscape,
    isTop,
    gridPos: props.menuHooks._internalProps.gridPos,
    zoomScale: props.menuHooks._internalProps.zoomScale,
    onPointerDown,
    clearDiagram

  };

  return (
    <div ref={rootRef}>
      <Stage      
        width={props.width}
        height={props.height}
        options={{ backgroundColor: 0xffffff, antialias: true, autoDensity: true, resolution: window.devicePixelRatio }}
        onContextMenu={e => e.preventDefault()}
      >
        <Container
          cursor={cursor}
          eventMode="static"
          scale={props.menuHooks._internalProps.zoomScale}
          {...props.menuHooks._internalProps.gridPos}
          onrightdown={props.onRightDown}
          onmousemove={onPointerMove}
          onmouseup={onPointerUp}
          onmouseupoutside={onPointerUp}
        >
          <DiagGrid
            {...gridProps}
            offset={props.menuHooks._internalProps.gridPos}
            zoomScale={props.menuHooks._internalProps.zoomScale}
            interval={props.gridSize}
          />
          <Container x={gridProps.sx} y={gridProps.sy}>
            <DiagLayoutBoard
              x={0}
              y={0}
              shape={shape}
              lineColor={editMode === ELayoutEditMode.Outline ? 0x45d6df : 0x000000}
              onDown={onRelease}
            />
            {blocks.map(b => {
              if (draggingBlock === b) {
                return
              }

              if (!DiagBlockConst.isDoubleSided(b.model.layoutInfo)) {
                return
              }

              const key = b.id + "b"
              return <DiagLayoutBlock key={key} cursor={cursor} {...b} isTop={isTop} back={true} />
            })}
            {blocks.map(b => {
              if (draggingBlock === b || b.model.layoutInfo.is_top === isTop) {
                return
              }

              return <DiagLayoutBlock key={b.id} cursor={cursor} {...b} isTop={isTop} />
            })}
            {blocks.map(b => {
              if (draggingBlock === b || b.model.layoutInfo.is_top !== isTop) {
                return
              }

              return <DiagLayoutBlock key={b.id} cursor={cursor} {...b} isTop={isTop} />
            })}
            {draggingBlock ? (
              <DiagLayoutBlock
                key={draggingBlock.id}
                cursor={cursor}
                {...draggingBlock}
                isTop={isTop}
                cellOffset={getCellOffset(draggingBlock)}
              />
            ) : (
              <></>
            )}
            {
              texts.map(t => <DiagLayoutText key={t.id} {...t} isTop={isTop}></DiagLayoutText>)
            }
            {editMode === ELayoutEditMode.Text ? (
              <DiagTextEditor {...textEditorProps}></DiagTextEditor>
            ) : (
              <></>              
            )}
            {images.map(i => (
              <DiagLayoutImage key={i.id} {...i} isTop={isTop}></DiagLayoutImage>
            ))}
            {editMode === ELayoutEditMode.PlaceImage ? (
              <DiagPlaceImageEditor {...placeImageProps}></DiagPlaceImageEditor>
            ) : (
              <></>
            )}
            {<DiagLayoutHoles x={0} y={0} onClick={onPointerDown} holes={holes}></DiagLayoutHoles>}
            {editMode === ELayoutEditMode.Hole ? <DiagHoleEditor {...holeEditProps} /> : <></>}
            {
              <DiagLayoutRulers x={0} y={0} rulers={rulers} isTop={isTop}></DiagLayoutRulers>
            }
          </Container>
        </Container>
        <DiagBaseMenu
          x={props.width - 45}
          y={menuY}
          onUndo={props.onUndo}
          onRedo={props.onRedo}
          onZoomIn={props.menuHooks.setZoomIn}
          onZoomOut={props.menuHooks.setZoomOut}
          onResetView={props.menuHooks.resetView}
        />
        <DiagLayoutMenu
          x={props.width - 110}
          y={menuY}
          activeId={layoutMenuActiveId}
          onSetActiveId={setLayoutMenuActiveId}
          onSetting={(d?: string) => {
            setEditMode(ELayoutEditMode.None)
            props.onSetting()
          }}
          onRuler={(d?: string) => {
            checkSetEditMode(d === "active", ELayoutEditMode.Ruler)
          }}
          onText={(d?: string) => {
            checkSetEditMode(d === "active", ELayoutEditMode.Text)
          }}
          onImage={(d?: string) => {
            checkSetEditMode(d === "active", ELayoutEditMode.ImportImage)
          }}
          onHole={(d?: string) => {
            checkSetEditMode(d === "active", ELayoutEditMode.Hole)
          }}
          onOutline={(d?: string) => {
            checkSetEditMode(d === "active", ELayoutEditMode.Outline)
          }}
        />
        <LayoutTopToggle
          x={props.width - 110 - 22}
          y={22}
          onToggle={() => {
            setIsTop(!isTop)
          }}
          isTop={isTop}
        />
        {editMode === ELayoutEditMode.Ruler ? (
          <DiagRulerEditor {...rulerEditorProps}></DiagRulerEditor>
        ) : (
          <></>
        )}
        {editMode === ELayoutEditMode.Outline ? (
          <DiagOutlineEditor {...outlineEditorProps}></DiagOutlineEditor>
        ) : editMode === ELayoutEditMode.None ? (
          <DiagLayoutEditor {...layoutEditorProps}></DiagLayoutEditor>
        ) : (
          <></>
        )}
      </Stage>
      {editMode === ELayoutEditMode.OpenTextEditor ? <DiagTextUiEditor {...textUiEditorProps}></DiagTextUiEditor> : <></>}
      {editMode === ELayoutEditMode.ImportImage ? (
        <DiagImportImageEditor onApply={onImportImage} grid={props.gridSize}></DiagImportImageEditor>
      ) : (
        <></>
      )}
      {editMode === ELayoutEditMode.ImportOutline ? (
        <DiagImportOutlineEditor onApply={onImportOutline} grid={props.gridSize}></DiagImportOutlineEditor>
      ) : (
        <></>
      )}
      {editMode === ELayoutEditMode.OpenHoleEidotr ? <DiagHoleUiEditor {...holeUiEditorProps} /> : <></>}
      {editMode === ELayoutEditMode.Outline ? <OutlineUiEditor {...outlineUiEditorProps}></OutlineUiEditor> : <></>}
    </div>
  )
}

export default LayoutDiag
