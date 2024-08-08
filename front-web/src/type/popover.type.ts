import { ReactNode } from "react"

export enum Placement {
  left,
  center,
}

export interface IPopoverProps {
  width: number
  height?: number
  placement: Placement
  children: ReactNode
  title?: string
  text: string | ReactNode
  showClose?: boolean
}
