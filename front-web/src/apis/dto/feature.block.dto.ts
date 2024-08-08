import { Expose } from "class-transformer"
import { BaseDto } from "./base.dto"
// import { IFeatureBlock } from "type"

export class FeatureBlockDto extends BaseDto {
  @Expose()
  type!: string

  @Expose()
  category!: string

  @Expose()
  icon!: string

  @Expose()
  tags: string[] = []

  @Expose()
  color!: string

  // @Expose()
  // color: string = ""

  count = 0

  increaseCount() {
    this.count = this.count += 1
  }

  decreaseCount() {
    this.count = this.count -= 1
  }

  isSameBlock(type: string) {
    return this.type === type
  }
}
