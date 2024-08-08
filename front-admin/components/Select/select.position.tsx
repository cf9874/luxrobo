import { ISelectProps } from "./select.type"
import { BasicSelect } from "./select.basic"
import { PoisitionNumOptions, PoisitionStringOptions } from "@/const"

export const PositionSelection = (props: ISelectProps) => {
  return <BasicSelect options={PoisitionNumOptions} {...props}></BasicSelect>
}
