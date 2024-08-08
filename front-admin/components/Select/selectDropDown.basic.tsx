import { ISelectDropDownProps } from "./select.type"
import styles from "./select.module.scss"

export const BasicSelectDropDown = (props: ISelectDropDownProps) => {
  const { option, className, children, ...newProps } = props

  switch (option) {
    default:
      return (
        <div className={`${styles.select_dropdown_global} ${className}`} {...newProps}>
          {children}
        </div>
      )
  }
}
