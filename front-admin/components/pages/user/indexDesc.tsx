import { UserSimpleInfoDto } from "@/apis/dto"

//------------------------------------------------------------------------------------------------------
export const UserIndex = {
  keys: ["index", "accountID", "username", "email", "phone_number", "last_login_at", "manage"],
}

export const UserIndexDetail = {
  index: { label: "No.", sorter: true },
  accountID: { label: "아이디", sorter: true },
  username: { label: "이름", sorter: true },
  email: { label: "이메일", sorter: true },
  phone_number: { label: "핸드폰", sorter: true },
  last_login_at: { label: "최근 접속일", sorter: true },
  manage: { label: "관리", align: "center" },
}

//------------------------------------------------------------------------------------------------------
export class UserIndexType extends UserSimpleInfoDto {
  key: number
  index: number
  manage: React.Key
}
//------------------------------------------------------------------------------------------------------
