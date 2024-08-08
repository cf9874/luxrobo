import { FederatedPointerEvent } from "pixi.js"
import { useState } from "react"

export interface IDiagVec2 {
  x: number
  y: number
}

export interface IDiagLine {
  p1: IDiagVec2
  p2: IDiagVec2
}

export enum EDiagPointerEventType {
  Down,
  Move,
  Up,
}

export class DiagUtil {
  static readonly assetPath = "/assets/"
  static readonly assetExt = ".svg"

  static id(): string {
    return Math.random().toString(36).substring(2, 12)
  }

  static imageUrl(name: string): string {
    return DiagUtil._imageUrl(DiagUtil.assetPath, name)
  }

  static _imageUrl(path: string, name: string): string {
    return `${path}${name}${DiagUtil.assetExt}`
  }

  static addVec2(pos: IDiagVec2, offset: IDiagVec2): IDiagVec2 {
    return { x: pos.x + offset.x, y: pos.y + offset.y }
  }

  static lengthVec2(v1: IDiagVec2, v2: IDiagVec2): number {

    const v = {
      x: v1.x - v2.x,
      y: v1.y - v2.y
    };

    return Math.sqrt(v.x*v.x+v.y*v.y);
  }

  static normalizeVec2(s: IDiagVec2, e: IDiagVec2): IDiagVec2 {

    const v = {
      x: e.x - s.x,
      y: e.y - s.y
    };

    const m = Math.sqrt((v.x * v.x) + (v.y * v.y));

    return { x: v.x / m, y: v.y / m };
  }
}

let zoomFactor = 1;
export const useZoomController = () => {

  const [zoomScale, setZoomScale] = useState(zoomFactor);

  const onZoomIn = () => {

    zoomFactor = Math.min(2, zoomFactor + 0.25);
    setZoomScale(zoomFactor);
  };

  const onZoomOut = () => {

      zoomFactor = Math.max(0.5, zoomFactor - 0.25);
      setZoomScale(zoomFactor);
  };

  const resetZoom = () => {

    zoomFactor = 1;
  }

  return { zoomScale, setZoomScale, onZoomIn, onZoomOut, resetZoom };
}