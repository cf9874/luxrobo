import { Expose } from "class-transformer"
import { BaseDto } from "./base.dto"

export class ContactDto extends BaseDto {
  @Expose()
  contactID!: number

  @Expose()
  content!: string

  @Expose()
  created_at!: string

  @Expose()
  phone_number!: string

  @Expose()
  reply!: string

  @Expose()
  tag!: number

  @Expose()
  title!: string

  @Expose()
  updated_at!: string

  @Expose()
  userID!: number

  @Expose()
  writer!: string
}
