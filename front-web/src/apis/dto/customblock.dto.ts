import { Expose } from "class-transformer"
import { BaseDto } from "./base.dto"

export class CustomblockDto extends BaseDto {
  @Expose()
  color!: string
  @Expose()
  customblockID!: number
  @Expose()
  description!: string
  @Expose()
  name!: string
  @Expose()
  partID!: string
  @Expose()
  specification!: {
    [key: string]: string
  }
  @Expose()
  teamID!: number
  @Expose()
  type!: string
  @Expose()
  userID!: number
  @Expose()
  created_at!: string
  @Expose()
  updated_at!: string
}

export class CustomblockSchDto extends BaseDto {
  @Expose()
  params!: {
    naming_param: {
      io_type: string
      max_vol: number
      min_vol: number
      pin_name: string
      pin_type: string
    }[]
    schema_bom: {
      footprint: string
      part_name: string
      part_prefix: string
    }
  }
}
export class CustomblockEditDto extends BaseDto {
  @Expose()
  new_color!: string
  @Expose()
  new_description!: string
  @Expose()
  new_name!: string
  @Expose()
  new_specification!: {
    [key: string]: string
  }
}

export class CustomblockHandleDto extends BaseDto {
  @Expose()
  customblockID!: number
}
