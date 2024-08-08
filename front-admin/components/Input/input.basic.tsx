import { ConfigProvider, Input } from "antd"
import { IInputProps } from "./input.type"
import { InputObject } from "./input.object"
import styles from "./input.module.scss"

export const BasicInput = (props: IInputProps) => {
  const { className, ...newProps } = props

  if (typeof props.value === "object" && !Array.isArray(props.value) && props.value !== null)
    return <InputObject className={`${styles.input_global} ${className}`} {...newProps}></InputObject>

  switch (props.option) {
    default:
      return <Input className={`${styles.input_global} ${className}`} {...newProps}></Input>
  }
}
