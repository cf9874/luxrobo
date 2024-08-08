import { ICheckBoxProps } from "type"
import { Checkbox, ConfigProvider } from "antd"
import styles from "./checkbox.module.scss"

export const ColorCheckBox = (props: ICheckBoxProps) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          ...props.theme,
          colorPrimary: props.options?.bgColor ?? "#45d6df",
          colorBgBase: props.options?.bgColor ?? "#fff",
        },
      }}
    >
      <Checkbox
        className={
          props.checked
            ? props.options?.bgColor === "#ffffff"
              ? styles.color_checkBox_selected_white
              : styles.color_checkBox_selected
            : styles.color_checkBox
        }
        {...props}
      >
        {props.options?.title ?? props.children}
      </Checkbox>
    </ConfigProvider>
  )
}
