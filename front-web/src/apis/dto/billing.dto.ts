import { Expose } from "class-transformer"
import { BaseDto } from "./base.dto"

export class BillingDto extends BaseDto {
  @Expose()
  seq_no!: number
  @Expose()
  billStep!: number
  @Expose()
  order_id!: string
  @Expose()
  customer_key!: string
}

export class BillCancelDto extends BaseDto {
  @Expose()
  billStep!: number
  @Expose()
  seq_no!: string
}

export class BillEndDto extends BaseDto {
  @Expose()
  billStep!: number
  @Expose()
  seq_no!: number
}
