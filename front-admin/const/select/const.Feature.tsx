import { SelectProps } from "antd"

export const FeatureCategoryValues = [
  "Input",
  "Output",
  "Communication",
  "Battery",
  "Power",
  "Basic",
  "Assist",
  "MCU",
] as const

export type FeatureCategory = (typeof FeatureCategoryValues)[number]

export const toolCategoryOptions: SelectProps["options"] = FeatureCategoryValues.map(item => {
  return {
    value: item,
    label: <div>{item}</div>,
  }
})

//-------------------------------------------------------------------------
export const ToolKindValues = {
  Input: [
    "Switch",
    "Camera",
    "Inertial Sensor",
    "CDS Censor",
    "Pressure Sensor",
    "Infrared Sensor",
    "Ultrasonic Sensor",
    "TOF Sensor",
    "Temperature Sensor",
    "Moisture Sensor",
    "Gas Sensor",
    "GPS/GNSS",
    "PSD Sensor",
    "Potentio Meter",
    "Current Sensor",
    "Touch Sensor",
  ] as const,
  Output: ["Speacker", "LED", "LCD", "Motor", "Buzzer", "Vibration", "Matrix", "Relay", "DC", "AC", "Segment"] as const,
  Communication: ["Bluetooth", "Wi-Fi", "LTE Cellular", "Communication Output"] as const,
  Battery: ["Lipo", "Dry Cell", "Super Capacitor"] as const,
  Power: ["USB", "DC Jack", "Connector", "Terminal", "Cigar Jack"] as const,
  Basic: ["MCU", "Power"] as const,
  Assist: [
    "Resistor",
    "Capacitor",
    "Inductor",
    "Bead",
    "Fuse",
    "Crystal Unit",
    "Diode",
    "BJT",
    "MOSFET",
    "Amplifier",
    "DC-DC",
    "LDO",
    "Filter",
    "Antenna",
  ] as const,
  MCU: ["MCU"] as const,
}

export const toolKindValuesOptions = {
  Input: ToolKindValues["Input"].map(item => {
    return { value: item, label: <div>{item}</div> }
  }),
  Output: ToolKindValues["Output"].map(item => {
    return { value: item, label: <div>{item}</div> }
  }),
  Communication: ToolKindValues["Communication"].map(item => {
    return { value: item, label: <div>{item}</div> }
  }),
  Battery: ToolKindValues["Battery"].map(item => {
    return { value: item, label: <div>{item}</div> }
  }),
  Power: ToolKindValues["Power"].map(item => {
    return { value: item, label: <div>{item}</div> }
  }),
  Basic: ToolKindValues["Basic"].map(item => {
    return { value: item, label: <div>{item}</div> }
  }),
  Assist: ToolKindValues["Assist"].map(item => {
    return { value: item, label: <div>{item}</div> }
  }),
  MCU: ToolKindValues["MCU"].map(item => {
    return { value: item, label: <div>{item}</div> }
  }),
}
