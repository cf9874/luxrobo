// import { IsBoolean, IsInt, IsString } from "class-validator"
import { Expose } from "class-transformer"
import { BaseDto, BasicResponseDto } from "./base.dto"

export class SignInDto extends BaseDto {
  @Expose()
  // @Transform(v => (v.obj.data as SignInDto).access_token)
  access_token!: string
  @Expose()
  // @Transform(v => (v.obj.data as SignInDto).last_login_at)
  last_login_at!: number
  @Expose()
  // @Transform(v => (v.obj.data as SignInDto).refresh_token)
  refresh_token!: string
  // @Expose()
  // now!: number
}

export class UserDto extends BaseDto {
  @Expose()
  accountID!: string

  @Expose()
  countrycode!: string

  @Expose()
  email!: string

  @Expose()
  email_opt_in!: boolean

  @Expose()
  nickname!: string

  @Expose()
  phone_number!: string

  @Expose()
  phone_opt_in!: boolean

  @Expose()
  profile_image!: string

  @Expose()
  userID!: number

  @Expose()
  username!: string
}
export class ProfileDto extends BaseDto {
  @Expose()
  profile_image!: string

  @Expose()
  nickname!: string

  @Expose()
  email!: string

  @Expose()
  countrycode!: string

  @Expose()
  phone_number!: string

  @Expose()
  accountID!: string

  @Expose()
  email_opt_in!: boolean

  @Expose()
  phone_opt_in!: boolean

  @Expose()
  userID!: number

  @Expose()
  username!: string
}

export class UserHandleDto extends BasicResponseDto {
  @Expose()
  userID!: number
}

export class UserSearchDto extends BaseDto {
  @Expose()
  accountID!: string

  @Expose()
  userID!: number
}
export class BillingInfo extends BaseDto {
  @Expose()
  card_token!: string[]
}
export class BillingHandleDto extends BaseDto {
  @Expose()
  billingID!: number
}
