import { ConfigProvider, Input } from "antd"
import { IPasswordInputProps } from "./input.type"
import styles from "./input.module.scss"

export const PasswordInput = (props: IPasswordInputProps) => {
  const { className, ...newProps } = props

  switch (props.option) {
    default:
      //return <Input.Password {...newProps}></Input.Password>
      return <Input.Password className={`${styles.input_password_global} ${className}`} {...newProps}></Input.Password>
  }
}
