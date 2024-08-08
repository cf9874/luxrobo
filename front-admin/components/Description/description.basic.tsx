import { ConfigProvider, Descriptions } from "antd"
import { IDescriptionProps, defaultDescriptionInfo } from "./description.type"
import { isArray } from "class-validator"

export const BasicDescription = (props: IDescriptionProps) => {
  const { theme, ...newProps } = props
  return (
    <ConfigProvider theme={{ token: { ...props.theme } }}>
      <Descriptions {...newProps}></Descriptions>
    </ConfigProvider>
  )
}
