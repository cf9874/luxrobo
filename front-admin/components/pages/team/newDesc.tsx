import { BaseDto } from "@/apis/dto"
import { defaultDescriptionInfo } from "@/components/Description"

//------------------------------------------------------------------------------------------------------
export const TeamNewDesc = {
  descA: {
    title: "팀 정보",
    column: 2,
    keys: ["team_name", "phone", "email", "team_image"],
  } as defaultDescriptionInfo,
  descB: {
    column: 2,
    keys: ["address_name", "addressID", "receiver", "phone_number", "address", "postal_code", "detailAddress"],
    attribute: { style: { marginBottom: "20px" } },
  } as defaultDescriptionInfo,
}

export const TeamNewDescDetail = {
  // A
  team_name: { label: "팀 이름", span: 2, labelStyle: { width: "25%" }, contentStyle: { width: "75%" } },
  phone: { label: "휴대폰", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  email: { label: "이메일", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  team_image: { label: "프로필 이미지", span: 2 },
  // B
  address_name: { label: "배송지 명", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  addressID: { label: "배송지 삭제", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  receiver: { label: "수령인" },
  phone_number: { label: "전화번호" },
  address: { label: "배송지 주소", span: 2 },
  postal_code: { label: "우편 번호", span: 2 },
  detailAddress: { label: "상세 주소", span: 2 },
}
//------------------------------------------------------------------------------------------------------
export const TeamNewNullDataA = {
  team_name: "",
  phone: {
    code: "",
    value: "",
    opt_in: false,
  },
  email: {
    value: "",
    opt_in: false,
  },
  team_image: null,
} as TeamNewDescAType

export const TeamNewNullDataB = {
  addressID: null,
  address_name: "",
  receiver: "",
  phone_number: "",
  address: "",
  postal_code: "",
  detailAddress: "",
} as TeamNewDescBType

//------------------------------------------------------------------------------------------------------
export class TeamNewDescAType extends BaseDto {
  //teamID: number
  team_name: string
  phone: {
    code: string
    value: string
    opt_in: boolean
  }
  email: {
    value: string
    opt_in: boolean
  }
  team_image: string
}

export class TeamNewDescBType extends BaseDto {
  addressID: number
  address_name: string
  receiver: string
  phone_number: string
  postal_code: string
  address: string
  detailAddress: string
}
