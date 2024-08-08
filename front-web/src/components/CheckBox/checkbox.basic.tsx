import { Checkbox, ConfigProvider } from "antd"
import styles from "./checkbox.module.scss"
import { ICheckBoxProps } from "type"
export const BasicCheckBox = (props: ICheckBoxProps) => {
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
      <Checkbox className={props.checked ? styles.checkBox_selected : styles.checkBox} {...props}>
        {props.options?.title ?? props.children}
      </Checkbox>
    </ConfigProvider>
  )
}
