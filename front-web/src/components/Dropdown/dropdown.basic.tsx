import { ConfigProvider, Select } from "antd"
import { useState } from "react"
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons"

import { IDropDownSelectProps } from "type"

export const BasicDropdown = (props: IDropDownSelectProps) => {
  const [open, setOpen] = useState(false)

  return (
    <ConfigProvider
      theme={{
        token: {
          ...props?.theme,
        },
      }}
    >
      <Select
        {...props}
        disabled={props?.disabled}
        className={props.className}
        open={open}
        suffixIcon={
          open ? (
            <CaretUpOutlined
              style={{
                color: props.disabled ? "#dcdcdc" : "#1b3852",
              }}
              onClick={() => setOpen(true)}
            />
          ) : (
            <CaretDownOutlined
              style={{
                color: props.disabled ? "#dcdcdc" : "#1b3852",
              }}
              onClick={() => setOpen(false)}
            />
          )
        }
        // value={dropdownValue}
        // onChange={(_, i) => setSelectItem(DropdownUIProcessor.processLabel(i))}
        onChange={props.onChange}
        options={props.options}
        onClick={e => {
          props?.onClick && props?.onClick(e)
          setOpen(state => !state)
        }}
      />
    </ConfigProvider>
  )
}
