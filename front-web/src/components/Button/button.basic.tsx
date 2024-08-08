import { IButtonProps } from "type"
import styles from "./button.module.scss"

export const BasicButton = (props: IButtonProps) => {
  return (
    <button onClick={props.onClick} disabled={props.disabled} className={styles.general_basic_button} {...props}>
      {props.children}
    </button>
  )
}
