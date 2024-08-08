import { ButtonProps } from "antd"
import { AliasToken } from "antd/es/theme/internal"

export interface IButtonProps extends ButtonProps {
  theme?: Partial<AliasToken>
  option?: React.Key
  value?: any
}

export interface IExcelButtonProps extends IButtonProps {
  headers?: {
    label: any
    key: string
  }[]
  filename?: string
}

export interface IFileButtonProps extends IButtonProps {
  // option
  handleFile?: any
  handleFiles?: any
}
