import { IButtonProps } from "./button.type"
import { BasicButton } from "./button.basic"
import styles from "./button.module.scss"

export const ObjectButton = (props: IButtonProps) => {
  switch (props.option) {
    default:
      return Object.entries(props.value).map(value => {
        // key = value[0], value = value[1]
        return <BasicButton {...{ ...props, value: JSON.stringify(value) }}>{props.children}</BasicButton>
      })
  }
}
