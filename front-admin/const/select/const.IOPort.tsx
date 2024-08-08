import { SelectProps } from "antd"

export const IOTypeValues = [
  "VDD",
  "GND",
  "GPIO",
  "ADC",
  "PWM",
  "UART",
  "I2C",
  "I2S",
  "SPI",
  "USB",
  "CAN",
  "ETC",
] as const

export type IOType = (typeof IOTypeValues)[number]

export const IOTypeOptions: SelectProps["options"] = IOTypeValues.map(item => {
  return { value: item, label: <div>{item}</div> }
})

export default IOTypeOptions

//-----------------------------------------------------------------------------------------------
export const IOPortPinValues = {
  VDD: ["IN", "OUT"] as const,
  GND: [] as const,
  GPIO: [] as const,
  ADC: [] as const,
  PWM: [] as const,
  UART: ["RX", "TX"] as const,
  I2C: ["SDA", "SCL"] as const,
  I2S: ["SDATA", "SCLK", "LRCLK", "MCLK"] as const,
  SPI: ["SDO", "SDI", "SCK"] as const,
  USB: ["Dp", "Dm"] as const,
  CAN: ["CanH", "CanL"] as const,
  ETC: [] as const,
}

export const IOPortPinValuesOptions = {
  VDD: IOPortPinValues["VDD"].map(item => {
    return { value: item, lavel: <div>{item}</div> }
  }),
  GND: IOPortPinValues["GND"].map(item => {
    return { value: item, lavel: <div>{item}</div> }
  }),
  GPIO: IOPortPinValues["GPIO"].map(item => {
    return { value: item, lavel: <div>{item}</div> }
  }),
  ADC: IOPortPinValues["ADC"].map(item => {
    return { value: item, lavel: <div>{item}</div> }
  }),
  PWM: IOPortPinValues["PWM"].map(item => {
    return { value: item, lavel: <div>{item}</div> }
  }),
  UART: IOPortPinValues["UART"].map(item => {
    return { value: item, lavel: <div>{item}</div> }
  }),
  I2C: IOPortPinValues["I2C"].map(item => {
    return { value: item, lavel: <div>{item}</div> }
  }),
  I2S: IOPortPinValues["I2S"].map(item => {
    return { value: item, lavel: <div>{item}</div> }
  }),
  SPI: IOPortPinValues["SPI"].map(item => {
    return { value: item, lavel: <div>{item}</div> }
  }),
  USB: IOPortPinValues["USB"].map(item => {
    return { value: item, lavel: <div>{item}</div> }
  }),
  CAN: IOPortPinValues["CAN"].map(item => {
    return { value: item, lavel: <div>{item}</div> }
  }),
  ETC: IOPortPinValues["ETC"].map(item => {
    return { value: item, lavel: <div>{item}</div> }
  }),
}
