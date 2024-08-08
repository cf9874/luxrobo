import { Expose } from "class-transformer"
import { BaseDto, BasicResponseDto } from "./base.dto"
import { teamAuth } from "@const/team.const"

export class TeamDto extends BaseDto {
  @Expose()
  role!: teamAuth

  @Expose()
  teamID!: number

  @Expose()
  team_name!: string

  @Expose()
  team_image!: string

  @Expose()
  email!: string

  @Expose()
  email_opt_in!: boolean

  // @Expose()
  // countrycode!: string

  @Expose()
  phone_number!: string

  @Expose()
  phone_opt_in!: boolean
}

export class TeamMemberDto extends BaseDto {
  @Expose()
  nickname!: string

  @Expose()
  role!: teamAuth

  @Expose()
  userID!: number

  @Expose()
  user_email!: string
}

// edit
export class TeamHandleDto extends BasicResponseDto {
  @Expose()
  teamID!: number
}

export class TeamProfileDto extends BaseDto {
  // @Expose()
  // countrycode!: string

  @Expose()
  email!: string

  @Expose()
  email_opt_in!: boolean

  @Expose()
  name!: string

  @Expose()
  phone_number!: string

  @Expose()
  phone_opt_in!: boolean

  @Expose()
  team_img!: string
}
export class TeamInviteDto extends BaseDto {
  @Expose()
  invitings!: {
    account_id: string
    result: string
  }[]
}
