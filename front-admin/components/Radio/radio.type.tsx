import { RadioGroupProps, RadioProps } from "antd"
import { AliasToken } from "antd/es/theme/internal"

export interface IRadioType extends RadioProps {
  theme?: Partial<AliasToken>
  option?: React.Key
}

export interface IRadioGroupProps extends RadioGroupProps {
  theme?: Partial<AliasToken>
  option?: React.Key
}
