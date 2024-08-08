import {
  CUSTOM,
  COMPANY,
  PROJECT,
  ORDER,
  CONTACT,
  SHIP,
  SearchCompanyRangeOptions,
  SearchContactRangeOptions,
  SearchCustomBlockRangeOptions,
  SearchShippingRangeOptions,
  SearchOrderRangeOptions,
  SearchPartRangeOptions,
  SearchProjectRangeOptions,
  SearchTeamRangeOptions,
  SearchUserRangeOptions,
  TEAM,
  PART,
  USER,
  PROJECTWORKSPACEMODAL,
  SearchWorkspaceRangeOptions,
} from "@/const"
import { BasicSelect } from "./select.basic"
import { ISelectProps } from "./select.type"

export const SearchRangeSelection = (props: ISelectProps) => {
  switch (props.option) {
    case USER:
      return <BasicSelect options={SearchUserRangeOptions} {...props}></BasicSelect>
    case TEAM:
      return <BasicSelect options={SearchTeamRangeOptions} {...props}></BasicSelect>
    case PROJECT:
      return <BasicSelect options={SearchProjectRangeOptions} {...props}></BasicSelect>
    case PROJECTWORKSPACEMODAL:
      return <BasicSelect options={SearchWorkspaceRangeOptions} {...props}></BasicSelect>
    case CUSTOM:
      return <BasicSelect options={SearchCustomBlockRangeOptions} {...props}></BasicSelect>
    case PART:
      return <BasicSelect options={SearchPartRangeOptions} {...props}></BasicSelect>
    case COMPANY:
      return <BasicSelect options={SearchCompanyRangeOptions} {...props}></BasicSelect>
    case ORDER:
      return <BasicSelect options={SearchOrderRangeOptions} {...props}></BasicSelect>
    case SHIP:
      return <BasicSelect options={SearchShippingRangeOptions} {...props}></BasicSelect>
    case CONTACT:
      return <BasicSelect options={SearchContactRangeOptions} {...props}></BasicSelect>
    default:
      return <BasicSelect options={[]} {...props}></BasicSelect>
  }
}

export default SearchRangeSelection
