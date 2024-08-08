import { SelectProps } from "antd"

export const PoisitionStringOptions: SelectProps["options"] = [
  { value: "admin", label: "Administrator" },
  { value: "member", label: "Team Member" },
]

export const PoisitionNumOptions: SelectProps["options"] = [
  { value: 1, label: "Administrator" },
  { value: 2, label: "Team Member" },
]

export default PoisitionStringOptions
