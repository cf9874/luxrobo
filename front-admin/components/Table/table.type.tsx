import { TableProps } from "antd"
import { AliasToken } from "antd/es/theme/internal"

export interface ITableProps extends TableProps<any> {
  theme?: Partial<AliasToken>
  option?: React.Key
  tableInfo?: TableInfo
  tableDetails?: any
  render?: any
}

export interface TableInfo {
  title?: string | React.ReactNode
  keys?: string[] | (string | string[])[]
  attribute?: object
}
