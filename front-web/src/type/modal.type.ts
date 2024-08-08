import { ReactNode } from "react"
import { StoreBlock } from "redux/reducers/cart"

export interface IModalProps {
  header: ReactNode
  width?: number
  height?: number
  children: ReactNode
  footer?: ReactNode
  customClose?: () => void
}

export interface ICommonModalProps {
  selectItem?: number | null
  onApply?: () => Promise<void>
}

export interface IFeatureOptionModalProps extends ICommonModalProps {
  blockData: StoreBlock
}
