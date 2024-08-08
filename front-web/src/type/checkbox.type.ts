import { CheckboxProps } from "antd"
import { AliasToken } from "antd/es/theme/internal"

export interface ICheckBoxProps extends CheckboxProps {
  theme?: Partial<AliasToken>
  options?: { title: string; bgColor?: string }
}
