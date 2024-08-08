import { BaseDto } from "@/apis/dto"
import { DescriptionsProps } from "antd"
import { AliasToken } from "antd/es/theme/internal"
import React from "react"

export interface IDescriptionProps extends DescriptionsProps {
  theme?: Partial<AliasToken>
}

export interface IObjectDescriptionProps extends DescriptionsProps {
  theme?: Partial<AliasToken>
  descInfo?: defaultDescriptionInfo
  descDetails?: any
  data?: BaseDto
  render?: any
  renderIndex?: number
}

export interface ITableDescriptionProps extends DescriptionsProps {
  theme?: Partial<AliasToken>
  descInfo?: defaultDescriptionInfo
  descDetails?: any
  data?: BaseDto[]
  render?: any
}

// 각 description 정보
//(title(생략 가능), column(생략가능, default = 3), keys, attribute(description))
export interface defaultDescriptionInfo {
  title?: string | React.ReactNode
  column?: number
  keys?: string[] | string[][]
  attribute?: object
}
