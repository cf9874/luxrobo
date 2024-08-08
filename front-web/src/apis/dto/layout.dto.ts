import { Expose } from "class-transformer"
import { BaseDto, BasicResponseDto } from "./base.dto"

export class LayoutBoardDto extends BaseDto {
  @Expose()
  hole_blocks!: {
    diameter: number
    pos: {
      r: number
      x: number
      y: number
    }
  }[]
  @Expose()
  image_blocks!: {
    imageStr: string
    is_top: boolean
    pos: {
      r: number
      x: number
      y: number
    }
  }[]
  @Expose()
  layout_blocks!: {
    block_id: string
    is_auto: boolean
    is_placed: boolean
    is_top: boolean
    is_conflict?: boolean
    is_escape?: boolean
    out_shape_b: {
      r: number
      x: number
      y: number
    }[]
    out_shape_t: {
      r: number
      x: number
      y: number
    }[]
    pos: {
      r: number
      x: number
      y: number
    }
  }[]

  @Expose()
  shape!: {
    r: number
    x: number
    y: number
  }[]

  @Expose()
  text_blocks!: {
    font_size: number
    is_top: boolean
    pos: {
      r: number
      x: number
      y: number
    }
    string: string
    stroke_width: number
  }[]
}
export class LayoutBlockInfo extends BaseDto {
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
  partID!: string
  @Expose()
  part_image!: string
  @Expose()
  part_name!: string
  @Expose()
  specification!: string
  @Expose()
  symbol_image!: string
  @Expose()
  type!: string
}
export class LayoutParams extends BaseDto {
  @Expose()
  block_params!: {
    block_id: string
    margin: number[]
  }[]
  @Expose()
  net_params!: {
    add_tp: boolean
    clearance: number
    net: string
    track_width: number
    via_drill: number
    via_hole: number
  }[]
  @Expose()
  part_params!: {
    footprint: string
    part_name: string
    part_prefix: string
    show_name: boolean
    show_prefix: boolean
  }[]
  @Expose()
  preference_params!: {
    grid_size: number
    unit: string
  }
}
export class LayoutHandleDto extends BasicResponseDto {}
