import { SelectProps } from "antd"
import {
  CircuitProgressValues,
  MovingProgressValues,
  PartProgressValues,
  ShippingProgressValues,
  StepConditionValues,
  shippingCondition,
} from "../const.shippingCondition"

// order_step
export const orderStepSelection: SelectProps["options"] = Object.keys(shippingCondition).map(item => {
  return {
    value: Number(item),
    label: <div>{shippingCondition[item]}</div>,
  }
})

// per_step
export const shippingConditionOptions: SelectProps["options"] = Object.keys(StepConditionValues).map(item => {
  return {
    value: Number(item),
    label: <div>{StepConditionValues[item]}</div>,
  }
})

//------------------------------------------------------------------------------------------------------
//progress
export const shipmentToolProgressOptions: SelectProps["options"] = Object.keys(PartProgressValues).map(item => {
  return {
    value: Number(item),
    label: <div>{PartProgressValues[item]}</div>,
  }
})
export const shipmentCircuitProgressOptions: SelectProps["options"] = Object.keys(CircuitProgressValues).map(item => {
  return {
    value: Number(item),
    label: <div>{CircuitProgressValues[item]}</div>,
  }
})
export const shipmentMovementProgressOptions: SelectProps["options"] = Object.keys(MovingProgressValues).map(item => {
  return {
    value: Number(item),
    label: <div>{MovingProgressValues[item]}</div>,
  }
})
export const shipmentShipProgressOptions: SelectProps["options"] = Object.keys(ShippingProgressValues).map(item => {
  return {
    value: Number(item),
    label: <div>{ShippingProgressValues[item]}</div>,
  }
})

export default shipmentToolProgressOptions
