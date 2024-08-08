import { Select } from "antd"
import { ISelectProps } from "./select.type"
import styles from "./select.module.scss"
import { BasicSelectDropDown } from "./selectDropDown.basic"

export const BasicSelect = (props: ISelectProps) => {
  const { className, children, ...newProps } = props

  return (
    <Select
      className={`${styles.select_global} ${className}`}
      dropdownStyle={{
        padding: "4px",
        margin: 0,
        //
        fontSize: "14px",
        color: "rgba(0,0,0,0.88)",
        //
        backgroundColor: "white",
        borderRadius: "8px",
      }}
      dropdownRender={menu => <BasicSelectDropDown>{menu}</BasicSelectDropDown>}
      {...newProps}
    >
      {children}
    </Select>
  )
}
