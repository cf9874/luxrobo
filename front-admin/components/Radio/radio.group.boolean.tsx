import { Radio } from "antd"
import { IRadioGroupProps } from "./radio.type"
import { BasicRadioGroup } from "./radio.group.basic"
import styles from "./radio.module.scss"

const EN_BooleanOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
]

const KR_BooleanOptions = [
  { label: "예", value: true },
  { label: "아니오", value: false },
]

const BooleanOptions = [
  { label: "true", value: true },
  { label: "false", value: false },
]

export const BooleanRadioGroup = (props: IRadioGroupProps) => {
  const { theme, option, className, ...newProps } = props

  switch (props.option) {
    case "custom":
      // 현재 사용되는 경우 x - 사용시 props로 options를 받는다고 가정
      return <BasicRadioGroup className={`${styles.radioGroup_global} ${className}`} {...newProps}></BasicRadioGroup>
    case "KR":
      return (
        <BasicRadioGroup
          className={`${styles.radioGroup_global} ${className}`}
          options={KR_BooleanOptions}
          {...newProps}
        ></BasicRadioGroup>
      )
    case "EN":
      return (
        <BasicRadioGroup
          className={`${styles.radioGroup_global} ${className}`}
          options={EN_BooleanOptions}
          {...newProps}
        ></BasicRadioGroup>
      )
    default:
      return (
        <BasicRadioGroup
          className={`${styles.radioGroup_global} ${className}`}
          options={BooleanOptions}
          {...newProps}
        ></BasicRadioGroup>
      )
  }
}
