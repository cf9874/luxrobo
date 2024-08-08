import { Checkbox } from "antd"
import { ICheckboxGropuProps } from "./checkbox.type"
import styles from "./checkbox.module.scss"

export const BasicCheckBoxGroup = (props: ICheckboxGropuProps) => {
  const { className, children, option, ...newProps } = props

  switch (option) {
    default:
      return (
        <Checkbox.Group className={className} {...newProps}>
          {children}
        </Checkbox.Group>
      )
  }
}
