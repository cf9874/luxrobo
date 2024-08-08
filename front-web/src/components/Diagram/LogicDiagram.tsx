/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react"

import { Stage, Container } from "@pixi/react"

import { Graphics as _Graphics } from "pixi.js"

import { ILogicDiagProps } from "type"
import { KeyboardUtil } from "./Utils/Keyboard"
import { DiagGrid } from "./Widgets/Grid"
import { DiagBlock } from "./Widgets/Block"

import { IDiagLogicLinkInfo, DiagLogicLinks } from "./Widgets/LogicLinks"
import { IDiagLogicBlockProps, LogicDiagLayout } from "./Parsers/LogicDiagLayout"
import { DiagBaseMenu } from "./Widgets/BaseMenu"
import { FederatedPointerEvent } from "pixi.js"
import { DiagBlockCategory, DiagBlockConst } from "./Models/Block"
import { DiagUtil } from "./Utils/Common"
import DiagLinkEditor from "./Editors/LinkEditor"
import { PointerHandler } from "./Utils/PointerHandler"

let blockProps: IDiagLogicBlockProps[] = []
let linkProps: IDiagLogicLinkInfo = { conns: [], links: [], mainLink: null }
let clicked: undefined | IDiagLogicBlockProps
let clickedForLink: undefined | IDiagLogicBlockProps
let lastUpPos = { x: 0, y: 0, timeStamp: 0 }
let cachedLinkSrc: IDiagLogicBlockProps | undefined
const deferredClickInfo = { pos: { x: 0, y: 0 }, timeStamp: 0, blockId: "" }

const LogicDiag = (props: ILogicDiagProps) => {
  const [blocks, setBlocks] = useState(blockProps)
  const [links, setLinks] = useState(linkProps)
  const [linkSrc, setLinkSrc] = useState(undefined as IDiagLogicBlockProps | undefined)

  const onClick = (id: string, e: FederatedPointerEvent) => {
    deferredClickInfo.timeStamp = 0
    clickedForLink = undefined

    clicked = blockProps.find(v => v.id === id)
    if (clicked) {
      const c = clicked.model.category
      // if (c === DiagBlockConst.category(DiagBlockCategory.Power)) {
      //   clicked = undefined
      //   return
      // }

      blockProps.map(b => {
        b.selected = false
      })

      clicked.selected = true

      if (cachedLinkSrc) {
        if (cachedLinkSrc.model.block_id !== clicked.model.block_id) {
          props.onLink(cachedLinkSrc.model.block_id, clicked.model.block_id)
        }

        clicked.selected = false
        clickedForLink = clicked = undefined
      } else if (c !== DiagBlockConst.category(DiagBlockCategory.Power)) {
        deferredClickInfo.pos = { ...e.screen }
        deferredClickInfo.timeStamp = e.timeStamp
        deferredClickInfo.blockId = clicked.model.block_id
        // props.onClick(clicked.model.block_id)
      }

      setBlocks([...blockProps])

      clickedForLink = clicked
      if (
        c === DiagBlockConst.category(DiagBlockCategory.MCU) ||
        c === DiagBlockConst.category(DiagBlockCategory.Power)
      ) {
        clicked = undefined
      }
    }
  }

  KeyboardUtil.listen(
    () => {
      if (clicked) {
        props.onCopy(clicked.model.block_id)
      } else {
        console.log(`No target.`)
      }
    },
    async () => {
      await props.onPaste()
    },
  )

  const gridProps = {
    sx: 10,
    sy: 0,
    width: props.width,
    height: props.height,
    lineWidth: 1,
    lineColor: 0xe5e5e5,
    interval: 20,
    fillColor: 0xf0f0f0,

    onDown: (e: FederatedPointerEvent) => {
      blockProps.map(b => {
        b.selected = false
      })
      setBlocks([...blockProps])

      props.menuHooks._internalProps.onStartDragGrid(e)

      props.onRelease()
      clickedForLink = undefined

      props.menuHooks._internalProps.onStartDragGrid(e)
    },

    onMove: props.menuHooks._internalProps.onDragGrid,

    onUp: (e: FederatedPointerEvent) => {
      props.menuHooks._internalProps.onEndDragGrid(e)
    },
  }

  const onMove = (e: FederatedPointerEvent) => {
    if (clicked) {
      clicked.pos.x =
        (e.screen.x - props.menuHooks._internalProps.cachedGridPos.x) *
        props.menuHooks._internalProps.cachedZoomInfo.scale
      clicked.pos.y =
        (e.screen.y - props.menuHooks._internalProps.cachedGridPos.y) *
        props.menuHooks._internalProps.cachedZoomInfo.scale

      setLinks({ ...LogicDiagLayout.calcLinks(blockProps, linkProps.links) })
      setBlocks([...blockProps])
    }
  }

  const onDoubleClick = (t: IDiagLogicBlockProps | undefined) => {
    if (t) {
      cachedLinkSrc = t
      setLinkSrc(cachedLinkSrc)
      props.onDoublClick()
    }
  }

  const onUp = (e: FederatedPointerEvent) => {
    if (e.eventPhase < 2) {
      return
    }

    cachedLinkSrc = undefined
    setLinkSrc(cachedLinkSrc)

    if (clicked) {
      clicked = undefined
    }

    if (deferredClickInfo.timeStamp > 0) {
      if (DiagUtil.lengthVec2(e.screen, deferredClickInfo.pos) < 3) {
        props.onClick(deferredClickInfo.blockId)
      }
    }
    if (lastUpPos.timeStamp === 0 || e.timeStamp - lastUpPos.timeStamp > 300) {
      lastUpPos = { x: e.screen.x, y: e.screen.y, timeStamp: e.timeStamp }
    } else {
      if (DiagUtil.lengthVec2(e.screen, lastUpPos) < 3) {
        onDoubleClick(clickedForLink)
      }

      lastUpPos = { x: 0, y: 0, timeStamp: 0 }
    }
  }

  const { pointerHandler, onPointerMove } = PointerHandler.init()

  useEffect(() => {
    const w = LogicDiagLayout.layout(props.json, onClick)
    blockProps = w.blocks
    linkProps = w.links

    setBlocks([...blockProps])
    setLinks(linkProps)
  }, [props.json])

  const diagLinkProps = {
    x: 0,
    y: 0,

    gridProps,
    gridPos: props.menuHooks._internalProps.gridPos,
    zoomScale: props.menuHooks._internalProps.zoomScale,

    pointerHandler,
  }

  return (
    <Stage
      width={props.width}
      height={props.height}
      options={{ backgroundColor: 0xffffff, antialias: true, autoDensity: true, resolution: window.devicePixelRatio }}
      onContextMenu={e => e.preventDefault()}
    >
      <Container
        scale={props.menuHooks._internalProps.zoomScale}
        anchor={0.5}
        {...props.menuHooks._internalProps.gridPos}
        onrightdown={props.onRightDown}
        onmousemove={(e: FederatedPointerEvent) => {
          onPointerMove(e)
          onMove(e)
        }}
        onmouseup={(e: FederatedPointerEvent) => {
          onUp(e)
        }}
        onmouseupoutside={(e: FederatedPointerEvent) => {
          onUp(e)
        }}
      >
        <DiagGrid
          {...gridProps}
          offset={props.menuHooks._internalProps.gridPos}
          zoomScale={props.menuHooks._internalProps.zoomScale}
        />
        {blocks.map(b => (
          <DiagBlock key={b.id} {...b}></DiagBlock>
        ))}
        <DiagLogicLinks x={0} y={0} links={links}></DiagLogicLinks>
        {linkSrc ? <DiagLinkEditor {...diagLinkProps} src={linkSrc}></DiagLinkEditor> : <></>}
      </Container>
      <DiagBaseMenu
        x={props.width - 45}
        y={props.height - 388}
        onUndo={props.onUndo}
        onRedo={props.onRedo}
        onZoomIn={props.menuHooks.setZoomIn}
        onZoomOut={props.menuHooks.setZoomOut}
        onResetView={props.menuHooks.resetView}
      />
    </Stage>
  )
}

export default LogicDiag
