import { Radio } from "antd"
import { IRadioGroupProps } from "./radio.type"
import styles from "./radio.module.scss"

// options를 props로 넘겨줘야함 - 현재 사용 x
export const BasicRadioGroup = (props: IRadioGroupProps) => {
  const { theme, option, className, ...newProps } = props

  return <Radio.Group className={`${styles.radioGroup_global} ${className}`} {...newProps}></Radio.Group>
}
