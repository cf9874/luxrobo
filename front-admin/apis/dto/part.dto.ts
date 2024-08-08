import { Expose } from "class-transformer"
import { BaseDto } from "./base.dto"

export class PartDto {
  @Expose()
  category!: string

  @Expose()
  created_at!: string

  @Expose()
  datasheet_url!: string

  @Expose()
  description!: string

  @Expose()
  footprint!: string

  @Expose()
  manufacturer!: string

  @Expose()
  mouser_url!: string

  @Expose()
  options!: {
    [key in string]: string
  }

  @Expose()
  // part_id!: string
  part_id!: number

  @Expose()
  part_image!: string

  @Expose()
  part_name!: string

  @Expose()
  pcb_board_file!: string

  @Expose()
  price!: number

  @Expose()
  quantity_prices!: string

  @Expose()
  schematic!: string

  @Expose()
  schematics_file!: string

  @Expose()
  stock!: number

  @Expose()
  type!: string

  @Expose()
  updated_at!: string

  @Expose()
  version!: string
}

export class SimplePartDto {
  @Expose()
  category!: string

  @Expose()
  is_schematic!: boolean

  @Expose()
  // part_id!: string
  part_id!: number

  @Expose()
  part_name!: string

  @Expose()
  price!: number

  @Expose()
  stock!: number

  @Expose()
  type!: string

  //
  @Expose()
  uuid!: string
}
