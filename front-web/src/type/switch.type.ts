import { SwitchProps } from "antd"
import { AliasToken } from "antd/es/theme/interface"

export interface ISwitchProps extends SwitchProps {
  theme?: Partial<AliasToken>
  onToggleChange: () => void
}
