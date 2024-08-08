import { BaseDto, TeamMemberDto, UserCustomBlockDto, UserProjectInfoDto } from "@/apis/dto"
import { defaultDescriptionInfo } from "@/components/Description"

//------------------------------------------------------------------------------------------------------
export const UserDesc = {
  descA: {
    title: "사용자 정보",
    column: 2,
    keys: ["accountID", "username", "nickname", "resetPassword", "phone", "email", "profile_image"],
  } as defaultDescriptionInfo,
  descB: {
    column: 2,
    keys: ["address_name", "addressID", "receiver", "phone_number", "address", "postal_code", "detailAddress"],
    attribute: { style: { marginBottom: "20px" } },
  } as defaultDescriptionInfo,
  // descC: {
  //   title: "결제 정보",
  //   column: 3,
  //   keys: ["creditIndex", "credit_name", "crdeit_number"],
  // } as defaultDescriptionInfo,
  descD: {
    title: "사용자 프로젝트 정보",
    keys: ["index", "title", "updated_at", "projectID"],
  },
  descE: {
    title: "사용자 커스텀 블록 정보",
    keys: ["index", "name", "updated_at", "customblockID"],
  },
  descF: {
    title: "사용자 팀 정보",
    keys: ["index", "team_name", "role", "teamID"],
  },
  descG: {
    title: "사용자 활동 정보",
    column: 2,
    keys: ["created_at", "last_login_at"],
  } as defaultDescriptionInfo,
}

export const UserDescDetail = {
  // A
  accountID: { label: "아이디", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  username: { label: "이름", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  nickname: { label: "닉네임" },
  resetPassword: { label: "비밀번호 초기화" },
  phone: { label: "휴대폰" },
  email: { label: "이메일" },
  profile_image: { label: "프로필 이미지" },
  // B
  address_name: { label: "배송지 명", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  addressID: { label: "배송지 삭제", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  receiver: { label: "수령인" },
  phone_number: { label: "전화번호" },
  address: { label: "배송지 주소", span: 2 },
  postal_code: { label: "우편 번호", span: 2 },
  detailAddress: { label: "상세 주소", span: 2 },
  // C
  // creditIndex: { label: "No.", labelStyle: { width: "5%" }, contentStyle: { width: "5%" } },
  // credit_name: { label: "카드 이름", labelStyle: { width: "15%" }, contentStyle: { width: "30%" } },
  // crdeit_number: { label: "카드 번호", labelStyle: { width: "15%" }, contentStyle: { width: "30%" } },
  // D
  index: { label: "No.", align: "center" },
  title: { label: "프로젝트 이름", align: "center" },
  updated_at: { label: "마지막 수정 날짜", align: "center" },
  projectID: { label: "관리", align: "center" },
  // E
  name: { label: "커스텀 블록 이름", align: "center" },
  //updated_at: { label: "마지막 수정 날짜", align: "center" },
  customblockID: { label: "관리", align: "center" },
  // F
  team_name: { label: "이름", align: "center" },
  role: { label: "직책", align: "center" },
  teamID: { label: "관리", align: "center" },
  // G
  created_at: { label: "가입일", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  last_login_at: { label: "최종 로그인 날짜", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
}

//------------------------------------------------------------------------------------------------------
export const UserNullDataB = {
  addressID: null,
  is_default: false,
  address_name: "",
  receiver: "",
  phone_number: "",
  address: "",
  postal_code: "",
  detailAddress: "",
} as UserDescBType

//------------------------------------------------------------------------------------------------------
// Data Type
export class UserDescAType extends BaseDto {
  userID: number
  accountID: string
  resetPassword: number
  username: string
  nickname: string
  phone: {
    code: string
    value: string
    opt_in: boolean
  }
  email: {
    value: string
    opt_in: boolean
  }
  profile_image: string
}

export class UserDescBType extends BaseDto {
  addressID: number
  address: string
  detailAddress: string
  address_name: string
  is_default: boolean
  phone_number: string
  postal_code: string
  receiver: string
}

export class UserDescDType extends UserProjectInfoDto {
  index: number
}
export class UserDescEType extends UserCustomBlockDto {
  index: number
}

export class UserDescFType extends TeamMemberDto {
  index: number
}

export class UserDescGType extends BaseDto {
  userID: React.Key
  created_at: string
  last_login_at: number
}

// export class UserDescCType extends DefaultDataDtoRes {
//   creditID: number
//   creditIndex: number
//   credit_name?: string
//   crdeit_number?: string
// }
