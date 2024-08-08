import { Checkbox } from "antd"
import { ICheckboxProps } from "./checkbox.type"
import styles from "./checkbox.module.scss"

export const BasicCheckBox = (props: ICheckboxProps) => {
  const { className, option, ...newProps } = props

  switch (option) {
    default:
      return <Checkbox className={`${styles.checkbox_global} ${className}`} {...newProps}></Checkbox>
  }
}
