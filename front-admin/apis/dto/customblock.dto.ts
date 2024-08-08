import { Expose, Type } from "class-transformer"
import { BaseDto } from "./base.dto"

export class CustomblockDto {
  @Expose()
  color!: string

  @Expose()
  created_at!: string

  @Expose()
  customblockID!: number

  @Expose()
  description!: string

  @Expose()
  name!: string

  @Expose()
  // @Type(() => NamingParam)
  naming_param!: NamingParam[]

  @Expose()
  partID!: string

  @Expose()
  pcb_board_file!: string

  @Expose()
  // @Type(() => SchemaBom)
  schema_bom!: SchemaBom[]

  @Expose()
  schematics_file!: string

  @Expose()
  specification!: {
    [key: string]: string
  }

  @Expose()
  teamID!: number

  @Expose()
  type!: string

  @Expose()
  updated_at!: string

  @Expose()
  userID!: number
  @Expose()
  owner!: string
  @Expose()
  workspace!: string
}

export class NamingParam {
  @Expose()
  io_type!: string

  @Expose()
  max_vol!: number

  @Expose()
  min_vol!: number

  @Expose()
  pin_name!: string

  @Expose()
  pin_type!: string
}

export class SchemaBom {
  @Expose()
  footprint!: string

  @Expose()
  part_name!: string

  @Expose()
  part_prefix!: string
}

export class SimpleCustomblockDto {
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

  //
  @Expose()
  uuid!: string
}
