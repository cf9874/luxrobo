import { Expose, instanceToPlain } from "class-transformer"

export class BaseDto {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJson<T extends BaseDto>(): T {
    // const instance = plainToInstance(Type, this)
    return instanceToPlain(this) as T
  }

  // @Exclude({ toPlainOnly: true })
  // data!: unknown

  // toJson<T>() {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //   return JSON.parse(JSON.stringify(this)) as T
  // }
}
export class BasicResponseDto extends BaseDto {
  @Expose()
  message!: string
}
