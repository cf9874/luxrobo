import { useCallback } from "react"

import { Graphics as _Graphics, ColorSource, Cursor, FederatedPointerEvent, Texture } from 'pixi.js';
import { Container, Graphics, Sprite } from '@pixi/react';
import { IDiagVec2 } from "../Utils/Common";

// import { IBasePixiProps } from "type";


export interface IDiagGridProps {

    sx: number;
    sy: number;

    width: number;
    height: number;

    interval: number;

    lineColor: ColorSource;
    lineWidth: number;

    cursor?: Cursor | string;

    fillColor?: ColorSource;

    offset?: IDiagVec2;

    zoomScale?: number;
    
    onDown?: (e: FederatedPointerEvent) => void;
    onMove?: (e: FederatedPointerEvent) => void;
    onUp?: (e: FederatedPointerEvent) => void;
}

export const DiagGrid = (props: IDiagGridProps) => {

  const correctScale = () => {

    if ((props.zoomScale) && (props.zoomScale < 1)) {

      return 1 / props.zoomScale;
    }

    return 1;
  }

  const draw = useCallback((g: _Graphics) => {

    const scale = correctScale();
    const width = ((props.offset) ? (props.width - props.offset.x) : (props.width)) * scale;
    const height = ((props.offset) ? (props.height - props.offset.y) : (props.height)) * scale;

    g.clear()

    if (props.fillColor) {

      g.beginFill(props.fillColor);
      g.drawRect(0, 0, width, height);
      g.endFill();
    }

    g.lineStyle(props.lineWidth, props.lineColor);

    for (let x = props.sx; x < width; x += props.interval)
    {
      g.moveTo(x, props.sy);
      g.lineTo(x, props.sy + height);
    }

    for (let y = props.sy; y < height; y += props.interval)
    {
      g.moveTo(props.sx, y);
      g.lineTo(props.sx + width, y);
    }

  }, [props.offset, props.zoomScale]);

  const checkAction = (e: FederatedPointerEvent, action?: (e: FederatedPointerEvent) => void) => {

    if (action) {
      action(e);
    }
  }

  return (
    <Container cursor={(props.cursor) ? (props.cursor) : ("default")} eventMode={'static'} onmousedown={(e) => { checkAction(e, props.onDown); }} onmousemove={(e) => { checkAction(e, props.onMove); }} onmouseup={(e) => { checkAction(e, props.onUp); }} onmouseupoutside={(e) => { checkAction(e, props.onUp); }}>
      <Graphics draw={draw} />
      <Sprite x={(props.offset) ? (-props.offset.x) : (0)} y={(props.offset) ? (-props.offset.y) : (0)} texture={Texture.WHITE} width={props.width} height={props.width} alpha={0}></Sprite>
    </Container>
  );

}