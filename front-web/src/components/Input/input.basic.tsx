import { useState } from "react"
import { ConfigProvider, Input } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { IInputProps } from "type"

export const BasicInput = (props: IInputProps) => {
  const [toggle, setToggle] = useState(false)
  return (
    <ConfigProvider
      theme={{
        token: { ...props.theme },
      }}
    >
      <Input
        style={{
          ...props.style,
        }}
        styles={{
          suffix: {
            color: toggle ? "#45d6df" : "#1b3852",
          },
        }}
        onFocus={e => {
          //props로 받기
          props.onFocus?.(e)
          setToggle(true)
        }}
        onBlur={e => {
          //props로 받기
          props.onBlur?.(e)
          setToggle(false)
        }}
        type="primary"
        placeholder="Search"
        suffix={
          <SearchOutlined
            onClick={props.onClick}
            onChange={props.onChange}
            onSubmit={props.onSubmit}
            style={{
              fontSize: 16,
              cursor: "pointer",
              color: toggle ? "#45d6df" : "#1b3852",
            }}
          />
        }
        {...props}
      >
        {props.children}
      </Input>
    </ConfigProvider>
  )
}
