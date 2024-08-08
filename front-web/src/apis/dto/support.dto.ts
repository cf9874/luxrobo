import { Expose, Transform } from "class-transformer"
import { BaseDto, BasicResponseDto } from "./base.dto"
import dayjs from "dayjs"
export class AlarmDto extends BaseDto {
  @Expose()
  alarmID!: number
  @Expose()
  projectID!: number
  @Expose()
  orderID!: number
  @Expose()
  project_name!: string
  @Expose()
  code!: number
  @Expose()
  is_checked!: boolean
  @Expose()
  @Transform(v => dayjs(v.value as string).format("YYYY-MM-DD HH:mm:ss"))
  updated_at!: string
  @Expose()
  @Transform(v => dayjs(v.value as string).format("YYYY-MM-DD HH:mm:ss"))
  created_at!: string
}
export class AlarmHandleDto extends BasicResponseDto {
  @Expose()
  alarmID!: number
}

export class FaqDto extends BaseDto {
  @Expose()
  content!: string
  @Expose()
  @Transform(v => dayjs(v.value as string).format("YYYY-MM-DD"))
  created_at!: string
  @Expose()
  faqID!: number
  @Expose()
  title!: string
  @Expose()
  @Transform(v => dayjs(v.value as string).format("YYYY-MM-DD"))
  updated_at!: string
  @Expose()
  UploadImage!: string
  @Expose()
  views!: number
  @Expose()
  writer!: string

  isNew() {
    const now = dayjs()
    const createAt = dayjs(this.created_at)
    const diff = createAt.diff(now)
    const diffHour = diff / (1000 * 60 * 60)

    return Math.abs(diffHour) <= 24
  }
}
export class FaqHandleDto extends BasicResponseDto {
  @Expose()
  faqID!: number
}

export class NoticeDto extends BaseDto {
  @Expose()
  content!: string
  @Expose()
  @Transform(v => dayjs(v.value as string).format("YYYY-MM-DD"))
  created_at!: string
  @Expose()
  noticeID!: number
  @Expose()
  title!: string
  @Expose()
  @Transform(v => dayjs(v.value as string).format("YYYY-MM-DD"))
  updated_at!: string
  @Expose()
  upload_image!: string
  @Expose()
  views!: number
  @Expose()
  writer!: string
  isNew() {
    const now = dayjs()
    const createAt = dayjs(this.created_at)
    const diff = createAt.diff(now)
    const diffHour = diff / (1000 * 60 * 60)

    return Math.abs(diffHour) <= 24
  }
}
export class NoticeHandleDto extends BasicResponseDto {
  @Expose()
  noticeID!: number
}

export class ContactDto extends BaseDto {
  @Expose()
  contactID!: number
  @Expose()
  content!: string
  @Expose()
  @Transform(v => dayjs(v.value as string).format("YYYY-MM-DD"))
  created_at!: string
  @Expose()
  phone_number!: string
  @Expose()
  tag!: number
  @Expose()
  title!: string
  @Expose()
  @Transform(v => dayjs(v.value as string).format("YYYY-MM-DD"))
  updated_at!: string
  @Expose()
  userID!: number
  @Expose()
  writer!: string
}
export class ContactHandleDto extends BasicResponseDto {
  @Expose()
  contactID!: number
}
