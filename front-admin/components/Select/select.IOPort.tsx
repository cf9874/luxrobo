import React from "react"
import { ISelectProps } from "./select.type"
import { BasicSelect } from "./select.basic"
import { IOPortPinValues, IOPortPinValuesOptions, IOTypeOptions } from "@/const"

export const IOPortTypeSelection = (props: ISelectProps) => {
  return <BasicSelect options={IOTypeOptions} {...props}></BasicSelect>
}

//-----------------------------------------------------------------------------------------------
export const IOPOrtPinTypeSelection = (props: ISelectProps) => {
  return (
    <>
      <BasicSelect
        options={(() => {
          if (!props.option) return []
          if (Object.keys(IOPortPinValues).includes(props.option.toString())) {
            return IOPortPinValuesOptions[props.option]
          }
          return []
        })()}
        {...props}
      ></BasicSelect>
    </>
  )
}
