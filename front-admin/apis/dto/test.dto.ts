import { Expose } from "class-transformer"
import { BaseDto, BasicResponseDto } from "./base.dto"

export class TestDto extends BaseDto {
  @Expose()
  testID!: number
}

export class TestHandleDto extends BasicResponseDto {
  @Expose()
  testID: number | null = null
}
