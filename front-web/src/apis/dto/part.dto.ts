import { Expose } from "class-transformer"
import { BaseDto, BasicResponseDto } from "./base.dto"

export class PartDto extends BaseDto {
  @Expose()
  add_blocks!: PartBlockDto[]
  @Expose()
  deleted_block_ids!: string[]
}

export class PartMouserUrl extends BaseDto {
  @Expose()
  url!: string
}

export class PartLisSaveDto extends BaseDto {
  @Expose()
  block_id!: string
  @Expose()
  part_id!: string
  @Expose()
  type!: string
}

export class PartBlockDto extends BaseDto {
  @Expose()
  BlockInfo!: {
    block_id: string
    category: string
    display_option: string[]
    is_sub: boolean
    original_part_id: string
    is_schema_changed: boolean
    icon?: string
    color?: string
    selected_option: {
      [key: string]: string
    }
    type: string
  }
  @Expose()
  part_info!: {
    datasheet_url: string
    description: string
    is_support: boolean
    manufacturer: string
    mouser_url: string
    part_id: string
    part_image: string
    part_name: string
    quantity_prices: {
      price: number
      quantity: number
    }[]
    stock: number
  }
  index?: number
  count?: number
  totalPrice?: number
}

export class PartSearchDto extends BaseDto {
  datasheet_url!: string
  description!: string
  is_support!: boolean
  manufacturer!: string
  mouser_url!: string
  part_id!: string
  part_image!: string
  part_name!: string
  quantity_prices!: {
    price: number
    quantity: number
  }[]
  stock!: number
}
export class PartHandleDto extends BasicResponseDto {
  @Expose()
  project_id!: number
}
