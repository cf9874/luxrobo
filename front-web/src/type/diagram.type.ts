import { IDiagVec2 } from "components/Diagram/Utils/Common"
import { FederatedPointerEvent } from "pixi.js"
import { ReactNode } from "react"

interface IBasePixiProps {
  children?: ReactNode
}

interface IInternalProps {
  gridPos: IDiagVec2
  cachedGridPos: IDiagVec2

  onStartDragGrid: (e: FederatedPointerEvent) => void
  onDragGrid: (e: FederatedPointerEvent) => void
  onEndDragGrid: (e: FederatedPointerEvent) => void

  zoomScale: number
  cachedZoomInfo: { scale: number }
}

export interface IUseDiagMenuResult {
  // CAUTION: 응용레벨에서 사용하지 말 것!
  _internalProps: IInternalProps

  setZoomIn: () => void
  setZoomOut: () => void
  resetView: () => void
}

interface IBaseDiagProps extends IBasePixiProps {
  menuHooks: IUseDiagMenuResult

  json: string

  width: number
  height: number

  onUndo: () => void
  onRedo: () => void

  onRightDown: (e: PointerEvent) => void
}

interface IBaseENDProps extends IBaseDiagProps {
  onClick: (targetId: string) => void
  onRelease: () => void
}

export interface ILogicDiagProps extends IBaseENDProps {
  onCopy: (targetId: string) => void
  onPaste: () => Promise<void>
  onLink: (blockId: string, targetBlockId: string) => void
  onDoublClick: () => void
}

export interface IPowerDiagProps extends IBaseENDProps {
  onNetChanged: (blockId: string, newNetName: string) => Promise<void>
}

export interface ILayoutDiagProps extends IBaseENDProps {
  // Layout Parameter Setting > Preference
  // 현재는 mil 기준. (10 = 그리드 한칸의 크기가 10 mil)
  gridSize: number

  onUpdateJson: (json: string) => void

  onSetting: () => void

  dragBlockId: string
  onPlaceBlock: (id: string, isTop: boolean) => void
  onDeleteBlocks: (ids: string[]) => void
}

export interface IImageDiagProps {
  image: Blob | undefined
  onLoadImage: (width: number, height: number, data: string | IDiagVec2[]) => void

  width: number
  height: number

  grid: number
  invert: boolean

  anchor: number
}
