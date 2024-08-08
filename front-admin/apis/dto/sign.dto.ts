import { Expose } from "class-transformer"
import { BaseDto } from "./base.dto"

export class SignInDto extends BaseDto {
  @Expose()
  access_token: string

  @Expose()
  last_login_at: number

  @Expose()
  refresh_token: string
}
