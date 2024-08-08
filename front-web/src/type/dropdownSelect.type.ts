import { SelectProps } from "antd"
import { AliasToken } from "antd/es/theme/interface"
import { DefaultOptionType } from "antd/es/select"

export interface IDropDownSelectProps extends SelectProps {
  theme?: Partial<AliasToken>
  options: SelectProps["options"]
}

export type DropDownOption = DefaultOptionType | DefaultOptionType[]
