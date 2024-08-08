import { Button, Image } from "antd"
import { IButtonProps } from "./button.type"
import { ObjectButton } from "./button.object"
import { useRouter } from "next/router"
import styles from "./button.module.scss"

export const BasicButton = (props: IButtonProps) => {
  const router = useRouter()
  const { className, children, ...newProps } = props

  if (typeof props.value === "object" && !Array.isArray(props.value) && props.value !== null)
    return (
      <>
        <ObjectButton className={`${styles.button_global} ${className}`} {...newProps}></ObjectButton>
      </>
    )

  switch (props.option) {
    default:
      return (
        <Button className={`${styles.button_global} ${className}`} {...newProps}>
          {children}
        </Button>
      )
  }
}
