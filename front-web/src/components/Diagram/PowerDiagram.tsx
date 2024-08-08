/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react"

import { Stage, Container, Text, Sprite } from "@pixi/react"

import { IPowerDiagProps } from "type"
import { IDiagBlockProps } from "./Widgets/Block"
import { DiagBlock } from "./Widgets/Block"
import { DiagBaseMenu } from "./Widgets/BaseMenu"
import { EventMode, FederatedPointerEvent } from "pixi.js"
import { DiagUtil, IDiagVec2 } from "./Utils/Common"
import { IDummbyBlockInfo, ILineTextInfo, PowerDiagLayout } from "./Parsers/PowerDiagLayout"
import { DiagPowerNets, IDiagPowerNet } from "./Widgets/PowerNets"
import { DiagPowerLines } from "./Widgets/PowerLines"

import TextStyle from "./Utils/TextStyle"
import { DiagRegulators, IDiagRegulatorInfo } from "./Widgets/Regulators"
import { DiagPowerNetsEvent } from "./Widgets/PowerNetsEvent"
import { DiagBlockConst } from "./Models/Block"

let blockProps: IDiagBlockProps[] = []
let lineProps: number[] = []
let lineTextProps: ILineTextInfo[] = []
let netProps: IDiagPowerNet[] = []
let regProps: IDiagRegulatorInfo[] = []

let clicked: IDiagBlockProps | undefined
let lastPos: IDiagVec2 | undefined

let cachedDummyInfo: undefined | IDummbyBlockInfo

const PowerDiag = (props: IPowerDiagProps) => {
  const [blocks, setBlocks] = useState(blockProps)
  const [lines, setLines] = useState(lineProps)
  const [nets, setNets] = useState(netProps)
  const [lineTexts, setLineTexts] = useState(lineTextProps)
  const [regs, setRegs] = useState(regProps)

  const [em, setEM] = useState("none" as EventMode)

  const [dummyInfo, setDummyInfo] = useState(undefined as undefined | IDummbyBlockInfo)
  const [dummyPos, setDummyPos] = useState(undefined as undefined | IDiagVec2)

  const onClickBlock = (id: string) => {
    clicked = blockProps.find(v => v.id === id)
    if (clicked) {
      props.onClick(clicked.model.block_id)

      lastPos = { x: clicked.pos.x, y: clicked.pos.y }
      setEM("static")
    }
  }

  const onClickReg = (id: string) => {
    props.onClick(id)
  }

  // CopyNPasteUtil.listen(
  //     () => {

  //         const clicked = blockProps.find(v => v.selected);
  //         if (clicked) {
  //             props.onCopy(clicked.model.block_id);
  //         } else {
  //             console.log(`No target.`);
  //         }
  //     },
  //     () => { props.onPaste(); }
  // );

  useEffect(() => {
    const w = PowerDiagLayout.layout({ x: 0, y: 0 }, props.json, onClickBlock, dummyInfo)

    blockProps = w.blocks
    lineProps = w.lines
    lineTextProps = w.lineTexts
    netProps = w.nets
    regProps = w.regs

    if (clicked) {
      const pos: IDiagVec2 = { ...clicked.pos }
      clicked = blockProps.find(v => v.model.block_id === clicked?.model.block_id)
      if (clicked) {
        clicked.pos.x = pos.x
        clicked.pos.y = pos.y
      }
    }

    setBlocks([...blockProps])
    setLines([...lineProps])
    setLineTexts([...lineTextProps])
    setNets([...netProps])
    setRegs([...regProps])
    setDummyPos(w.dummyPos)
  }, [props.json, dummyInfo])

  const onPointerMove = (e: FederatedPointerEvent) => {
    // console.log(e.eventPhase);
    if (clicked) {
      clicked.pos.x =
        (e.screen.x - props.menuHooks._internalProps.gridPos.x) * props.menuHooks._internalProps.cachedZoomInfo.scale
      clicked.pos.y =
        (e.screen.y - props.menuHooks._internalProps.gridPos.y) * props.menuHooks._internalProps.cachedZoomInfo.scale
      setBlocks([...blockProps])
    } else {
      props.menuHooks._internalProps.onDragGrid(e)
    }
  }

  const onReleaseDrag = () => {
    clicked = undefined
    setDummyPos(undefined)
    setDummyInfo(undefined)
    cachedDummyInfo = undefined
    setEM("none")
  }

  const onPointerUp = (e: FederatedPointerEvent) => {
    props.menuHooks._internalProps.onEndDragGrid(e);

    if (e.eventPhase < 2) {
      return
    }

    if (clicked && lastPos) {
      clicked.pos.x = lastPos.x
      clicked.pos.y = lastPos.y

      setBlocks([...blockProps])

      onReleaseDrag()
    }
  }

  const onMoveNet = (e: FederatedPointerEvent, net: string) => {
    if (clicked) {
      const srcId = clicked.model.block_id
      const srcNet = netProps.find(v => v.info.group.indexOf(srcId) > -1)
      if (!srcNet) {
        throw new Error(`Not found a power net. block id : ${srcId}`)
      }

      const n = netProps.find(v => v.info.net_name === net)
      if (n) {
        const filtered = blockProps.filter(v => n.info.group.indexOf(v.model.block_id) > -1)
        const x =
          (e.screenX - props.menuHooks._internalProps.cachedGridPos.x) *
          props.menuHooks._internalProps.cachedZoomInfo.scale
        let min = Number.POSITIVE_INFINITY
        let rightId = undefined as undefined | string

        for (const b of filtered) {
          if (x < b.pos.x) {
            if (b.pos.x < min) {
              min = b.pos.x
              rightId = b.model.block_id
            }
          }
        }

        const g = n.info.group.filter(g => {
          if (g === srcId) {
            return
          }

          return filtered.find(v => v.model.block_id === g)
        })

        const idx = rightId ? g.indexOf(rightId) : g.length
        if (idx === -1) {
          setDummyInfo(undefined)
        } else if (!cachedDummyInfo || cachedDummyInfo.idx !== idx || cachedDummyInfo.netName !== n.info.net_name) {
          cachedDummyInfo = {
            srcNet: srcNet?.info.net_name,
            srcId,
            netName: n.info.net_name,
            idx,
          }

          setDummyInfo({ ...cachedDummyInfo })
        }
      }
    }
  }

  const onDropNet = (e: FederatedPointerEvent, net: string) => {
    if (clicked) {
      const t: IDiagBlockProps = clicked
      const n = netProps.find(v => v.info.group.indexOf(t.model.block_id) > -1)
      if (!n) {
        throw new Error(`Not found power net.`)
      }
      if (n.info.net_name !== net) {
        void props.onNetChanged(clicked.model.block_id, net)
      } else if (lastPos) {
        clicked.pos.x = lastPos.x
        clicked.pos.y = lastPos.y

        setBlocks([...blockProps])
      }

      onReleaseDrag()
    }
  }

  const correctScale = () => {
    if (props.menuHooks._internalProps.zoomScale) {
      return 1 / props.menuHooks._internalProps.zoomScale
    }

    return 1
  }

  return (
    <Stage
      width={props.width}
      height={props.height}
      options={{ backgroundColor: 0xffffff, antialias: true, autoDensity: true, resolution: window.devicePixelRatio }}
      onContextMenu={e => e.preventDefault()}
    >
      <Container
        eventMode="static"
        scale={props.menuHooks._internalProps.zoomScale}
        onrightdown={props.onRightDown}
        onmousedown={e => {
          if (e.eventPhase === 2) props.menuHooks._internalProps.onStartDragGrid(e);
        }}
        onmousemove={(e: FederatedPointerEvent) => {
          onPointerMove(e)
        }}
        onmouseup={(e: FederatedPointerEvent) => {
          onPointerUp(e)
        }}
        onmouseupoutside={(e: FederatedPointerEvent) => {
          onPointerUp(e)
        }}
        {...props.menuHooks._internalProps.gridPos}
      >
        <DiagPowerLines
          x={0}
          y={0}
          width={props.width}
          height={props.height}
          offset={props.menuHooks._internalProps.gridPos}
          zoomScale={props.menuHooks._internalProps.zoomScale}
          lines={lines}
          lineColor={0xe5e5e5}
          fillColor={0xf0f0f0}
        ></DiagPowerLines>
        <DiagPowerNets x={0} y={0} nets={nets}></DiagPowerNets>
        <DiagRegulators x={0} y={0} regs={regs} onClick={onClickReg}></DiagRegulators>
        {dummyPos ? (
          <Sprite
            image={DiagUtil.imageUrl(DiagBlockConst.defBackImg().block)}
            tint={0xe2e2e2}
            anchor={0.5}
            {...dummyPos}
          ></Sprite>
        ) : (
          <></>
        )}
        {blocks.map(b => {
          return <DiagBlock key={b.id} {...b}></DiagBlock>
        })}
        <DiagPowerNetsEvent
          x={0}
          y={0}
          nets={nets}
          em={em}
          onPointerMove={onMoveNet}
          onPointerUp={onDropNet}
        ></DiagPowerNetsEvent>
        {lineTexts.map(t => (
          <Text
            key={DiagUtil.id()}
            text={t.text}
            x={(props.width - 12 - props.menuHooks._internalProps.gridPos.x) * correctScale()}
            y={t.y}
            anchor={1}
            style={TextStyle.getB(40, 0xc3c3c3)}
          ></Text>
        ))}
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

export default PowerDiag
