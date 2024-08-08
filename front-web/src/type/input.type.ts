import { InputProps } from "antd"
import { AliasToken } from "antd/es/theme/internal"

export interface IInputProps extends InputProps {
  theme?: Partial<AliasToken>
}
