import { SelectProps } from "antd"
import { BasicProps } from "antd/es/layout/layout"
import { AliasToken } from "antd/es/theme/internal"

export interface ISelectProps extends SelectProps {
  theme?: Partial<AliasToken>
  option?: React.Key
}

export interface ISelectItemProps extends BasicProps {
  theme?: Partial<AliasToken>
  option?: React.Key
}

export interface ISelectDropDownProps extends BasicProps {
  theme?: Partial<AliasToken>
  option?: React.Key
}
