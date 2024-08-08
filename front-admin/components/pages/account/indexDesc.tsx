import { AccountDto } from "@/apis/dto/admins.dto"

export const AccountIndex = {
  keys: ["auth_name", "user_name", "accountID"],
}

export const AccountIndexDetail = {
  auth_name: { label: "권한 구분", align: "center" },
  user_name: { label: "이름", align: "center" },
  accountID: { label: "아이디", align: "center" },
}

export class AccountIndexType extends AccountDto {
  key: number
}

export class AccountNewIndexType extends AccountIndexType {
  password: string
}
