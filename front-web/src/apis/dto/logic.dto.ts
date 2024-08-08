import { Expose } from "class-transformer"
import { BaseDto, BasicResponseDto } from "./base.dto"

export class LogicBlockInfoDto extends BaseDto {
  @Expose()
  block_id!: string
  @Expose()
  category!: string
  @Expose()
  color!: string
  @Expose()
  description!: string
  @Expose()
  footprint_image!: string
  @Expose()
  icon!: string
  @Expose()
  option_names!: {
    [key: string]: string
  }
  @Expose()
  part_id!: string
  @Expose()
  part_image!: string
  @Expose()
  part_name!: string
  @Expose()
  specification!: {
    [key: string]: string
  }
  @Expose()
  symbol_image!: string
  @Expose()
  type!: string
}

export class LogicCopyDto extends BaseDto {
  @Expose()
  block_id!: string
}
export class LogicBlockSchemaDto extends BaseDto {
  @Expose()
  params!: {
    naming_param: INamingParam[]
    schema_bom: ISchemaBom[]
  }
  @Expose()
  schema_image!: string
  @Expose()
  schematic!: string
}
export interface INamingParam {
  io_type: string
  max_vol: number
  min_vol: number
  pin_name: string
  pin_type: string
}
export interface ISchemaBom {
  footprint: string
  part_name: string
  part_prefix: string
}
export class LogicBlockVoltageDto extends BaseDto {
  @Expose()
  blockInfo!: {
    block_id: string
    category: string
    display_option: string[]
    is_sub: boolean
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
}
export class LogicHandleDto extends BasicResponseDto {}

export class LogicCustomDto extends BasicResponseDto {
  @Expose()
  color!: string
  @Expose()
  description!: string
  @Expose()
  name!: string
  @Expose()
  part_id!: string
  @Expose()
  specification!: {
    [key: string]: string
  }
  @Expose()
  type!: string
}
export class LogicCustomHandleDto extends BaseDto {
  @Expose()
  block_id!: string
  @Expose()
  part_id!: string
  @Expose()
  type!: string
}

export class LogicCustomInitDto extends BaseDto {
  @Expose()
  block_id!: string
  @Expose()
  category!: string
  @Expose()
  color!: string
  @Expose()
  description!: string
  @Expose()
  footprint_image!: string
  @Expose()
  icon!: string
  @Expose()
  option_names!: {
    [key: string]: string
  }
  @Expose()
  part_id!: string
  @Expose()
  part_image!: string
  @Expose()
  part_name!: string
  @Expose()
  specification!: {
    [key: string]: string
  }
  @Expose()
  symbol_image!: string
  @Expose()
  type!: string
  index = 1
  is_updated = false
}

export class LogicLinkDto extends BaseDto {
  @Expose()
  block_id!: string
  @Expose()
  target_blocks!: {
    link_status: boolean
    target_block_id: string
  }[]
  @Expose()
  type!: string
}
export class LogicPowerNetDto extends BaseDto {
  @Expose()
  group!: string[]
  @Expose()
  net_name!: string
  @Expose()
  outputs!: {
    regulator_id: string
    target_net_name: string
    type: string
  }[]
  @Expose()
  ref_voltage!: number
}

export class LogicCreatePowerNetDto extends BaseDto {
  @Expose()
  from_net_name!: string
  @Expose()
  new_net_out!: {
    regulator_id: string
    target_net_name: string
  }
}
