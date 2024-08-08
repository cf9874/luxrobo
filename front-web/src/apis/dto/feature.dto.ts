import { Expose } from "class-transformer"
import { BaseDto, BasicResponseDto } from "./base.dto"

export class FeatureInitDto extends BaseDto {
  @Expose()
  category!: string
  @Expose()
  color!: string
  @Expose()
  icon!: string
  @Expose()
  tags!: string[]
  @Expose()
  type!: string
  count: number = 0
}
export class FeatureDto extends BaseDto {
  @Expose()
  block_id!: string
  @Expose()
  custom!: boolean
  @Expose()
  part_id!: string
  @Expose()
  selected_option!: {
    [key: string]: string | undefined
  }
  @Expose()
  type!: string
  // @Expose()
  icon: string = "/icons/current.svg"
  // @Expose()
  category: string = "Input"
  index?: number
  id?: number = 0
}
export class FeatureOptionDto extends BaseDto {
  @Expose()
  choices!: string[][]
  @Expose()
  id!: number
  @Expose()
  is_sub!: boolean
  @Expose()
  option_num!: number
  @Expose()
  title!: string
  @Expose()
  desc!: string
  @Expose()
  user_input!: boolean
}
export class FeatureBlockOptionDto extends BaseDto {
  @Expose()
  info!: FeatureInitDto
  @Expose()
  option_links!: {
    child_level: number
    option_list: number[]
    parent_id: number
  }[]

  @Expose()
  options!: FeatureOptionDto[]
  @Expose()
  selected_option!: {
    [key: string]: string | undefined
  }
}
export class FeatureRecommendDto extends BaseDto {
  @Expose()
  part_id!: string

  @Expose()
  stock!: number
}

export class FeatureHandleDto extends BasicResponseDto {}

export interface IFeatureOption {
  [key: string]: string | undefined
}
