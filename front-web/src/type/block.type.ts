import { CATEGORY_COLOR } from "@const/block.const"
import { ButtonProps } from "antd"

export interface IBlockProps extends ButtonProps {
  src: string
  count?: number
  onClick?: () => void
  isCart?: boolean
  activeColor?: CATEGORY_COLOR | string
  hoverAction?: boolean
}
