import { SearchMatchingOptions } from "@/const"
import { BasicSelect } from "./select.basic"
import { ISelectProps } from "./select.type"

export const SearchMatchingSelection = (props: ISelectProps) => {
  return <BasicSelect options={SearchMatchingOptions} {...props}></BasicSelect>
}

export default SearchMatchingSelection
