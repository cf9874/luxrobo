import { ConfigProvider, Input } from "antd"
const { TextArea } = Input
import { IInputAreaProps } from "./input.type"
import { ObjectInputArea } from "./inputArea.object"
import styles from "./input.module.scss"

export const BasicInputArea = (props: IInputAreaProps) => {
  if (typeof props.value === "object" && !Array.isArray(props.value) && props.value !== null)
    return <ObjectInputArea {...props}></ObjectInputArea>

  const { theme, option, className, ...newProps } = props

  switch (option) {
    case "small":
      return (
        <ConfigProvider theme={{ token: { ...theme } }}>
          <TextArea
            className={`${styles.input_global} ${className}`}
            autoSize={{ minRows: 3 }}
            {...newProps}
          ></TextArea>
        </ConfigProvider>
      )
    case "smallFixed":
      return (
        <ConfigProvider theme={{ token: { ...theme } }}>
          <TextArea
            className={`${styles.input_global} ${className}`}
            autoSize={{ minRows: 3, maxRows: 3 }}
            {...newProps}
          ></TextArea>
        </ConfigProvider>
      )
    case "big":
      return (
        <ConfigProvider theme={{ token: { ...theme } }}>
          <TextArea
            className={`${styles.input_global} ${className}`}
            autoSize={{ minRows: 20 }}
            {...newProps}
          ></TextArea>
        </ConfigProvider>
      )
    case "bigFixed":
      return (
        <ConfigProvider theme={{ token: { ...theme } }}>
          <TextArea
            className={`${styles.input_global} ${className}`}
            autoSize={{ minRows: 20, maxRows: 20 }}
            {...newProps}
          ></TextArea>
        </ConfigProvider>
      )
    case "middleFixed":
      return (
        <ConfigProvider theme={{ token: { ...theme } }}>
          <TextArea
            className={`${styles.input_global} ${className}`}
            autoSize={{ minRows: 10, maxRows: 10 }}
            {...newProps}
          ></TextArea>
        </ConfigProvider>
      )
    case "middle":
      return (
        <ConfigProvider theme={{ token: { ...theme } }}>
          <TextArea
            className={`${styles.input_global} ${className}`}
            autoSize={{ minRows: 10 }}
            {...newProps}
          ></TextArea>
        </ConfigProvider>
      )
    default:
      return (
        <ConfigProvider theme={{ token: { ...theme } }}>
          <TextArea className={`${styles.input_global} ${className}`} autoSize={true} {...newProps}></TextArea>
        </ConfigProvider>
      )
  }
}
