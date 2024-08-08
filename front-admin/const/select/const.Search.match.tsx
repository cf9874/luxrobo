import { DefaultOptionType } from "antd/es/select"

export const SearchMatchingOptions: DefaultOptionType["options"] = [
  {
    value: true,
    label: "일치",
  },
  {
    value: false,
    label: "포함",
  },
]

export default SearchMatchingOptions
