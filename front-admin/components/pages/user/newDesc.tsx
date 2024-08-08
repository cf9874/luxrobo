import { BaseDto } from "@/apis/dto"
import { defaultDescriptionInfo } from "@/components/Description"

//------------------------------------------------------------------------------------------------------
export const UserNewDesc = {
  descA: {
    title: "사용자 정보",
    column: 2,
    keys: ["accountID", "username", "nickname", "password", "phone", "email", "profile_image"],
  } as defaultDescriptionInfo,
  descB: {
    column: 2,
    keys: ["address_name", "addressID", "receiver", "phone_number", "address", "postal_code", "detailAddress"],
    attribute: { style: { marginBottom: "20px" } },
  } as defaultDescriptionInfo,
}

export const UserNewDescDetail = {
  // A
  accountID: { label: "아이디", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  username: { label: "이름", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  nickname: { label: "닉네임" },
  password: { label: "비밀번호" },
  phone: { label: "휴대폰" },
  email: { label: "이메일" },
  profile_image: { label: "프로필 이미지", span: 2 },
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
export const UserNewNUllDataA = {
  accountID: "",
  username: "",
  nickname: "",
  password: "",
  phone: {
    code: "",
    value: "",
    opt_in: false,
  },
  email: {
    value: "",
    opt_in: false,
  },
} as UserNewDescAType

export const UserNewNullDataB = {
  addressID: null,
  address_name: "",
  receiver: "",
  phone_number: "",
  address: "",
  postal_code: "",
  detailAddress: "",
} as UserNewDescBType

//------------------------------------------------------------------------------------------------------
// Data Type
export class UserNewDescAType extends BaseDto {
  accountID: string
  username: string
  nickname: string
  password: string
  phone: {
    code: string
    value: string
    opt_in: boolean
  }
  email: {
    value: string
    opt_in: boolean
  }
  profile_image: File
}

export class UserNewDescBType extends BaseDto {
  addressID: number
  address_name: string
  receiver: string
  phone_number: string
  postal_code: string
  address: string
  detailAddress: string
}
