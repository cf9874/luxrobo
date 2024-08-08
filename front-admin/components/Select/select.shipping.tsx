import { ISelectProps } from "./select.type"
import { BasicSelect } from "./select.basic"
import {
  orderStepSelection,
  shipmentCircuitProgressOptions,
  shippingConditionOptions,
  shipmentMovementProgressOptions,
  shipmentShipProgressOptions,
  shipmentToolProgressOptions,
} from "@/const"

//------------------------------------------------------------------------------------------------------
// Selection
// order_step
export const ShippingOrderStepSelection = (props: ISelectProps) => {
  return <BasicSelect options={orderStepSelection} {...props}></BasicSelect>
}

// per_step
export const ShippingStepSelection = (props: ISelectProps) => {
  return <BasicSelect options={shippingConditionOptions} {...props}></BasicSelect>
}

// progress
export const ShippingPartProgressSelection = (props: ISelectProps) => {
  return <BasicSelect options={shipmentToolProgressOptions} {...props}></BasicSelect>
}
export const ShippingCircuitProgressSelection = (props: ISelectProps) => {
  return <BasicSelect options={shipmentCircuitProgressOptions} {...props}></BasicSelect>
}
export const ShippingMotionProgressSelection = (props: ISelectProps) => {
  return <BasicSelect options={shipmentMovementProgressOptions} {...props}></BasicSelect>
}
export const ShippingShipProgressSelection = (props: ISelectProps) => {
  return <BasicSelect options={shipmentShipProgressOptions} {...props}></BasicSelect>
}
