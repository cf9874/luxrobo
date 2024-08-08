import { Radio } from "antd"
import { IRadioType } from "./radio.type"
import styles from "./radio.module.scss"

export const BasicRadio = (props: IRadioType) => {
  const { theme, option, className, ...newProps } = props

  return <Radio className={`${styles.radio_global} ${className}`} {...newProps}></Radio>
}
