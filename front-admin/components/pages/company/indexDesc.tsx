import { SearchCompanyDto } from "@/apis/dto"
//------------------------------------------------------------------------------------------------------
export const CompanyIndex = {
  keys: ["index", "name", "number", "webpage", "manage"],
}

export const CompanyIndexDetail = {
  index: { label: "No.", sorter: true },
  name: { label: "발주처명", sorter: true },
  number: { label: "번호", sorter: true },
  webpage: { label: "홈페이지", sorter: true },
  manage: { label: "관리", align: "center" },
}

//------------------------------------------------------------------------------------------------------
// Data Type
export class CompanyIndexType extends SearchCompanyDto {
  key: number
  index: number
  manage: number
}
