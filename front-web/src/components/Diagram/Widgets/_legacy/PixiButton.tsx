import { useCallback, useEffect, useState, ReactNode } from "react"

import '@pixi/events';
import { BlurFilter, TextStyle, Graphics as _Graphics, ColorSource, TextStyleFill, TextStyleFontWeight, TextStyleAlign } from 'pixi.js';
import { Stage, Container, Sprite, Text, Graphics } from '@pixi/react';

// import { IBasePixiProps } from "type";


export interface IPixiBtnProps {

    id: string

    x: number
    y: number

    width?: number
    height?: number

    radius?: number

    lineColor?: ColorSource
    lineWidth: number

    fillColor: ColorSource
    fillAlpha?: number

    image?: string
    imageOffset?: number
    imageScale?: number

    text?: string | undefined
    textFill?: TextStyleFill
    textOffset?: number

    align?: TextStyleAlign
    fontFamily?: string | string[]
    fontSize?: number | string
    fontWeight?: TextStyleFontWeight

    lineHeight?: number

    onClick?: (id: string) => void

    onCustomDraw?: (g: _Graphics, baseDraw: () => void) => void
    onCustomNode?: () => JSX.Element
}

export const getTextStyle = (props: IPixiBtnProps, size?: number): TextStyle | undefined => {

    if (!props.text) {
        return undefined;
    }

    return new TextStyle({

        fill: props.textFill ? props.textFill : 0x000000,
        fontFamily: props.fontFamily,
        fontSize: (size)? (size) : (props.fontSize),
        fontWeight: props.fontWeight,
        align: props.align,
        lineHeight: props.lineHeight

    });
}

export const PixiButton = (props: IPixiBtnProps) => {

    const draw = useCallback((g: _Graphics) => {

      const baseDraw = () => {

        g.lineStyle(props.lineWidth, props.lineColor)
        g.beginFill(props.fillColor, props.fillAlpha)
        if ((props.width) && (props.height)) {

          if (props.radius) {
            g.drawRoundedRect(0, 0, props.width, props.height, props.radius)
          } else {
            g.drawRect(0, 0, props.width, props.height)            
          }
        } else if (props.radius) {
          g.drawCircle(0, 0, props.radius)
        }

        g.endFill()
      }

      if (props.onCustomDraw) {

        props.onCustomDraw(g, baseDraw)
        return
      }
    
      g.clear()
      baseDraw()

    }, [])

      const [containerPos] = useState({
        x: props.x,
        y: props.y
      })

      const w = (props.width) ? (props.width) : ((props.radius) ? (props.radius) : (0))
      const h = (props.height) ? (props.height) : ((props.radius) ? (props.radius) : (0))

      const textOffset = (props.textOffset) ? (props.textOffset) : (0);
      const textY = ((props.image) ? (h) : (h / 2)) + textOffset;
      const [textProp] = useState({
        x: w / 2,
        y: textY,
        anchor: 0.5,
        text: props.text,
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
        style: getTextStyle(props)
      })

      const offset = (props.imageOffset) ? (props.imageOffset) : (0);
      const scale = (props.imageScale) ? (props.imageScale) : (1);
      const [spriteProp] = useState({
        image: (props.image) ? (`https://dev-edaapi.luxrobo.com/icons/${props.image}.svg`) : undefined,
        x: w / 2,
        y: h / 2 + offset,
        anchor: 0.5,
        scale,
      })

      return (
        <Container {...containerPos} anchor={0.5} >
            <Graphics interactive={true} draw={draw} onmousedown={() => { (props.onClick) ? (props.onClick(props.id)) : (console.log('No listeners')); }} />
            {(props.image) ? (<Sprite {...spriteProp} />) : (<></>)}
            {(props.text) ? (<Text {...textProp} />) : (<></>)}
            {(props.onCustomNode) ? (props.onCustomNode()) : (<></>)}
        </Container>
      );

}