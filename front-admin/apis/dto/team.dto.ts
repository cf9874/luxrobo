import { Expose } from "class-transformer"

export class TeamAddressDto {
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

export class TeamAddressEditDto {
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

  @Expose()
  // postal_code!: number
  postal_code!: string

  @Expose()
  receiver!: string
}

export class CustomBlockInfoDto {
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

export class TeamMemberInfoDto {
  @Expose()
  email!: string

  @Expose()
  role!: number

  @Expose()
  userID!: number

  @Expose()
  user_name!: string
}

export class TeamProjectInfoDto {
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

export class TeamProfileInfoDto {
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
  teamID!: number

  @Expose()
  team_image!: string

  @Expose()
  team_name!: string
}
