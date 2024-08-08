import { AuthDto } from "@/apis/dto/admins.dto"

export const AuthIndex = {
  keys: [
    "auth_name",
    "auth_user",
    "auth_team",
    "auth_project",
    "auth_customblock",
    "auth_part",
    "auth_company",
    "auth_order",
    "auth_contact",
  ],
}

export const AuthIndexDetail = {
  auth_name: { label: "권한 구분", align: "center" },
  auth_user: { label: "사용자", align: "center" },
  auth_team: { label: "팀", align: "center" },
  auth_project: { label: "프로젝트", align: "center" },
  auth_customblock: { label: "커스텀 블록", align: "center" },
  auth_part: { label: "부품", align: "center" },
  auth_company: { label: "발주처", align: "center" },
  auth_order: { label: "주문 / 배송", align: "center" },
  auth_contact: { label: "문의", align: "center" },
}

export class AuthIndexType extends AuthDto {
  key: number
}
