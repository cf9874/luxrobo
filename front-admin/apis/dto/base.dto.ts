import { Expose, instanceToPlain } from "class-transformer"

export class BaseDto {
  // toJson<T extends BaseDto>(): T {
  //   return instanceToPlain(this) as T
  // }
}

export class BasicResponseDto extends BaseDto {
  @Expose()
  message: string
}
