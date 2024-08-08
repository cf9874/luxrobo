import { BaseDto, CompanyDto } from "@/apis/dto"
import { defaultDescriptionInfo } from "@/components/Description/description.type"

//------------------------------------------------------------------------------------------------------
// 각 description 정보
//(title(생략 가능), column(생략가능, default = 3), keys, attribute(description))
export const CompanyNewDesc = {
  descA: {
    title: "발주처 정보",
    column: 2,
    keys: ["name", "number", "webpage", "e-mail", "image"],
  } as defaultDescriptionInfo,
  descB: {
    title: "",
    column: 1,
    keys: ["rawData"],
  } as defaultDescriptionInfo,
}

//------------------------------------------------------------------------------------------------------
export const CompanyNewDescDetail = {
  // A
  name: { label: "발주처 명", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  number: { label: "번호", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  webpage: { label: "발주처 웹 주소" },
  "e-mail": { label: "발주처 이메일" },
  image: { label: "썸네일 이미지", span: 1, contentStyle: { paddingRight: 0 } },
  // B
  rawData: { label: "Raw Data", labelStyle: { width: "25%" }, contentStyle: { width: "75%" } },
}

//------------------------------------------------------------------------------------------------------
export const CompanyNewNullData = {
  companyID: null,
  date: {
    ["four_layer"]: {},
  },
  "e-mail": "",
  image: "",
  name: "",
  number: "",
  price: {
    ["four_layer"]: {},
  },
  webpage: "",
} as CompanyDto

//------------------------------------------------------------------------------------------------------
// Data Type
export class CompanyNewDescBType extends BaseDto {
  rawData: string
}
