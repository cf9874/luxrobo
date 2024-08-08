import { InputProps } from "antd"
import { PasswordProps, TextAreaProps } from "antd/es/input"
import { AliasToken } from "antd/es/theme/internal"

export interface IInputProps extends InputProps {
  theme?: Partial<AliasToken>
  option?: string
  value?: any
}

export interface IPasswordInputProps extends PasswordProps {
  theme?: Partial<AliasToken>
  option?: string
}

//------------------------------------------------------------
export interface IInputAreaProps extends TextAreaProps {
  theme?: Partial<AliasToken>
  option?: React.Key
  value?: any
}
