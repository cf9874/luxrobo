import { Expose } from "class-transformer"

export class UserAddressDto {
  @Expose()
  addressID!: number

  @Expose()
  address_json_string!: string

  @Expose()
  address_name!: string

  @Expose()
  is_default!: boolean

  @Expose()
  phone_number!: string

  // @Expose()
  // postal_code!: number
  @Expose()
  postal_code!: string

  @Expose()
  receiver!: string
}

export class UserCustomBlockDto {
  @Expose()
  customblockID!: number

  @Expose()
  name!: string

  @Expose()
  owner!: string

  @Expose()
  partID!: number

  @Expose()
  updated_at!: string

  @Expose()
  workspace!: string
}

export class UserProjectInfoDto {
  @Expose()
  active_user!: string

  @Expose()
  owner!: string

  @Expose()
  projectID!: number

  @Expose()
  teamID!: number

  @Expose()
  title!: string

  @Expose()
  updated_at!: string

  @Expose()
  userID!: number

  @Expose()
  workspace!: string
}

export class UserSimpleInfoDto {
  @Expose()
  accountID!: string

  @Expose()
  countrycode!: string

  @Expose()
  created_at!: string

  @Expose()
  email!: string

  @Expose()
  email_opt_in!: boolean

  @Expose()
  last_login_at!: number

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

export class TeamMemberDto {
  @Expose()
  countrycode!: string

  @Expose()
  email!: string

  @Expose()
  email_opt_in!: boolean

  @Expose()
  phone_number!: string

  @Expose()
  phone_opt_in!: boolean

  @Expose()
  role!: number

  @Expose()
  teamID!: number

  @Expose()
  team_image!: string

  @Expose()
  team_name!: string
}
