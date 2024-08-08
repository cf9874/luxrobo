import { Expose } from "class-transformer"
import { BaseDto, BasicResponseDto } from "./base.dto"

export class AddressDto extends BaseDto {
  @Expose()
  address_json_string!: string

  @Expose()
  address_name!: string

  @Expose()
  is_default!: boolean

  @Expose()
  phone_number!: string

  @Expose()
  postal_code!: number

  @Expose()
  receiver!: string

  @Expose()
  addressID!: number
}

export class AddressHandleDto extends BasicResponseDto {
  @Expose()
  addressID!: number
}
