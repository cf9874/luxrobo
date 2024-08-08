import { Expose } from "class-transformer"
import { BaseDto, BasicResponseDto } from "./base.dto"

export class AuthDto extends BaseDto {
  @Expose()
  auth_ID!: number

  @Expose()
  auth_admin!: boolean

  @Expose()
  auth_name!: string

  @Expose()
  auth_user!: boolean

  @Expose()
  auth_team!: boolean

  @Expose()
  auth_project!: boolean

  @Expose()
  auth_customblock!: boolean

  @Expose()
  auth_part!: boolean

  @Expose()
  auth_company!: boolean

  @Expose()
  auth_order!: boolean

  @Expose()
  auth_contact!: boolean
}

export class AccountDto extends BaseDto {
  @Expose()
  authID!: number

  @Expose()
  accountID!: string

  @Expose()
  adminID!: number

  @Expose()
  auth_name!: string

  @Expose()
  user_name!: string
}

export class AccountDetailDto extends BaseDto {
  @Expose()
  accountID!: string

  @Expose()
  adminID!: number

  @Expose()
  auth_ID!: number

  @Expose()
  auth_admin!: boolean

  @Expose()
  auth_company!: boolean

  @Expose()
  auth_contact!: boolean

  @Expose()
  auth_customblock!: boolean

  @Expose()
  auth_name!: string

  @Expose()
  auth_order!: boolean

  @Expose()
  auth_part!: boolean

  @Expose()
  auth_project!: boolean

  @Expose()
  auth_team!: boolean

  @Expose()
  auth_user!: boolean

  @Expose()
  user_name!: string
}

export class searchAccountDto {
  @Expose()
  accountID!: string

  @Expose()
  email!: string

  @Expose()
  name!: string

  @Expose()
  phone_number!: string

  @Expose()
  teamID: number

  @Expose()
  userID: number
}
