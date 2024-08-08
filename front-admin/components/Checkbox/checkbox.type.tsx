import { CheckboxProps } from "antd"
import { CheckboxGroupProps } from "antd/es/checkbox"
import { AliasToken } from "antd/es/theme/internal"

export interface ICheckboxProps extends CheckboxProps {
  theme?: Partial<AliasToken>
  option?: React.Key
}

export interface ICheckboxGropuProps extends CheckboxGroupProps {
  theme?: Partial<AliasToken>
  option?: React.Key
}
