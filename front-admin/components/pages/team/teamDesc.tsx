import { BaseDto } from "@/apis/dto"
import { CustomBlockInfoDto, TeamMemberInfoDto, TeamProjectInfoDto } from "@/apis/dto/team.dto"
import { defaultDescriptionInfo } from "@/components/Description"

//------------------------------------------------------------------------------------------------------
export const TeamDesc = {
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
  // descC: {
  //   title: "결제 정보",
  //   column: 3,
  //   keys: ["cardIndex", "cardName", "cardNum"],
  // } as defaultDescriptionInfo,
  descD: {
    title: "팀 프로젝트 정보",
    keys: ["index", "title", "updated_at", "projectID"],
  },
  descE: {
    title: "팀 커스텀 정보",
    keys: ["index", "name", "updated_at", "customblockID"],
  },
  descF: {
    title: "팀 멤버 정보",
    keys: ["index", "user_name", "user_email", "role", "userID"],
  },
}

export const TeamDescDetail = {
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
  // C
  // cardIndex: { label: "No.", labelStyle: { width: "5%" }, contentStyle: { width: "5%" } },
  // cardName: { label: "카드 이름", labelStyle: { width: "15%" }, contentStyle: { width: "30%" } },
  // cardNum: { label: "카드 번호", labelStyle: { width: "15%" }, contentStyle: { width: "30%" } },
  // D
  index: { label: "No.", align: "center" },
  title: { label: "프로젝트 이름", align: "center" },
  updated_at: { label: "마지막 수정 날짜", align: "center" },
  projectID: { label: "관리", align: "center" },
  // E
  name: { label: "커스텀 블록 이름", align: "center" },
  // updated_at: { label: "마지막 수정 날짜", align: "center" },
  customblockID: { label: "관리", align: "center" },
  // F
  user_name: { label: "이름", align: "center" },
  user_email: { label: "이메일", align: "center" },
  role: { label: "직책", align: "center" },
  userID: { label: "관리", align: "center" },
}
//------------------------------------------------------------------------------------------------------

// export const TeamNullDataA = [
//   {
//     id: null,
//     name: null,
//     image: null,
//     phone: {
//       value: null,
//       radioValue: null,
//     },
//     email: {
//       value: null,
//       radioValue: null,
//     },
//   },
// ]

export const TeamNullDataB = {
  addressID: null,
  is_default: false,
  address_name: "",
  receiver: "",
  phone_number: "",
  address: "",
  postal_code: "",
  detailAddress: "",
} as TeamDescBType

// export const TeamNullDataC = [
//   {
//     id: null,
//     cardIndex: null,
//     cardName: null,
//     cardNum: null,
//   },
// ]

// export const TeamNullDataD = [
//   {
//     key: null,
//     index: null,
//     projectName: null,
//     project_update_dt: null,
//     project_manage: null,
//   },
// ]

// export const TeamNullDataE = [
//   {
//     key: null,
//     index: null,
//     customName: null,
//     custom_update_dt: null,
//     custom_manage: null,
//   },
// ]

// export const TeamNullDataF = [
//   {
//     key: null,
//     index: null,
//     memberName: null,
//     memberEmail: null,
//     memberPosition: null,
//     member_manage: null,
//   },
// ]
//------------------------------------------------------------------------------------------------------
export class TeamDescAType extends BaseDto {
  teamID: number
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

export class TeamDescBType extends BaseDto {
  addressID: number
  address_name: string
  receiver: string
  phone_number: string
  postal_code: string
  address: string
  detailAddress: string
  is_default: boolean
}

export class TeamDescDType extends TeamProjectInfoDto {
  index: number
}

export class TeamDescEType extends CustomBlockInfoDto {
  index: number
}

export class TeamDescFType extends TeamMemberInfoDto {
  index: number
}

// export class TeamDescCType extends DefaultDataDtoRes {
//   id: React.Key
//   cardIndex: React.Key
//   cardName?: string
//   cardNum?: string
// }
