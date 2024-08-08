import { useCallback, useEffect, useState } from "react"

import { BlurFilter, TextStyle, Graphics as _Graphics, ColorSource, TextStyleFill, TextStyleFontWeight, TextStyleAlign } from 'pixi.js';
import { Stage, Container, Sprite, Text, Graphics } from '@pixi/react';

import { IPixiBtnProps, PixiButton, getTextStyle } from "./PixiButton";


export interface IBlockWidgetProps extends IPixiBtnProps {

  blockRadius?: number
  blockInnerOffset: number
  blockColor: ColorSource
  blockWidth: number

  blockCount: number
  blockConuntSize: number
  blockCountX: number
  blockCountY: number
}

export const TestBlockWidget = (props: IBlockWidgetProps) => {

  // const [sx] = useState(props.width - 10)

  const [textProp] = useState({
    x: props.blockCountX,
    y: props.blockCountY,
    anchor: 0.5,
    text: props.blockCount.toString(),
    // style: new TextStyle({
    //     align: 'center',
    //     fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
    //     fontSize: 20,
    //     fontWeight: '400',
    //     fill: ['#000000', '#008088'], // gradient
    //     stroke: '#01d27e',
    //     strokeThickness: 1,
    //     letterSpacing: 1,
    //     dropShadow: true,
    //     dropShadowColor: '#ccced2',
    //     dropShadowBlur: 4,
    //     dropShadowAngle: Math.PI / 6,
    //     dropShadowDistance: 6,
    //     wordWrap: true,
    //     wordWrapWidth: props.width,
    //   })
    style: getTextStyle(props, props.blockConuntSize)
  })

  // const ext: IBlockWidgetProps = {
  //   ...props,
  //   onCustomDraw: (g: _Graphics, baseDraw: () => void) => {

  //     g.clear()
  //     baseDraw()

  //     const r = (props.blockRadius) ? (props.blockRadius) : (props.radius)

  //     g.lineStyle(props.blockWidth, props.blockColor)
  //     // g.beginFill(0xffffff)
  //     g.drawRoundedRect(props.blockInnerOffset, props.blockInnerOffset, props.width - (props.blockInnerOffset * 2), props.height - (props.blockInnerOffset * 2), r)
  //     // g.endFill()

  //     g.moveTo(props.width / 2, props.height + 2)
  //     g.lineStyle(2, 0xb2b2b2)
  //     g.bezierCurveTo(props.width / 2, props.height + 50, props.width * 2, props.height * 2 - 50, props.width * 2, props.height * 2)
  //     g.moveTo(0, 0)

  //     g.beginFill(0xffffff)
  //     g.lineStyle(2, 0xb2b2b2)
  //     g.drawCircle(props.width / 2, props.height + 2, 6)
  //     g.endFill()
  //   },
  //   onCustomNode: () => {
  //     return (
  //       <Container>
  //         <Text {...textProp}></Text>
  //         <Sprite image={'assets/block_active.svg'} x={props.width}></Sprite>          
  //         <Sprite image={'assets/line_active.svg'} x={props.width + 8} y={6} tint={0x5ff053}></Sprite>          
  //       </Container>
  //     )
  //   }
  // }

  return (
    <>
      {/* <PixiButton {...ext}>
      </PixiButton> */}
    </>
    
  );

}