import { Expose, Transform } from "class-transformer"
import { BaseDto } from "./base.dto"

// export class OrderDto extends BaseDto {
//   @Expose()
//   installment!: string
//   @Expose()
//   order_address!: string
//   @Expose()
//   order_card!: string
//   @Expose()
//   order_price!: string
//   @Expose()
//   order_status!: string
//   @Expose()
//   part_total_price!: string
//   @Expose()
//   project!: string
//   @Expose()
//   shipping_price!: string
//   @Expose()
//   total_price!: string
// }

// export class OrderDetailDto extends BaseDto {
//   @Expose()
//   is_smt!: boolean
//   @Expose()
//   is_work!: boolean
//   @Expose()
//   maker!: string
//   @Expose()
//   order_date!: string
//   @Expose()
//   order_quntity!: string
//   @Expose()
//   pcb_order_option!: string
// }

// export class OrderShippingDto extends BaseDto {
//   @Expose()
//   shipping_info!: {
//     action: string
//     point: string
//     time: string
//   }[]
// }
//
export class OrderCompanyDto extends BaseDto {
  @Expose()
  seq_no!: number

  @Expose()
  company_id!: string

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (value ? JSON.parse(value as string) : null), { toClassOnly: true })
  company_data!: CompanyJson | null
}

interface CompanyJson {
  name: string
  number: string
  image: string
  webpage: string
  "e-mail": string
  price: {
    ["four_layer"]: { [key in string]: string }
  }
  date: {
    ["four_layer"]: { [key in string]: string }
  }
}

export class OrderSheetCreateDto extends BaseDto {
  @Expose()
  address_seq!: number

  @Expose()
  amount!: number

  @Expose()
  company_id!: string

  @Expose()
  is_motion!: boolean

  @Expose()
  is_smt!: boolean

  @Expose()
  options!: {
    board_type: string
    finished_copper: string
    min_holl_size: string
    min_track_spacing: string
    silkscreen: string
    solder_mask: string
    surface_finish: string
    thickness: string
    via_process: string
  }

  @Expose()
  prices!: {
    delivery_fee: number
    estimated_fee: number
    order_fee: number
    part_fee: number
    total_fee: number
    made_fee: number
  }
}

export class OrderSheetDto extends BaseDto {
  @Expose()
  address_seq!: number

  @Expose()
  company_id!: string

  @Expose()
  is_motion!: boolean

  @Expose()
  is_smt!: boolean

  @Expose()
  options!: {
    board_type: string
    finished_copper: string
    min_holl_size: string
    min_track_spacing: string
    silkscreen: string
    solder_mask: string
    surface_finish: string
    thickness: string
    via_process: string
  }

  @Expose()
  @Transform(value => {
    const status = value as unknown as number

    if (isNaN(status) || status === undefined || status === null || status < 2) {
      return 1
    } else {
      return status - 2
    }
  })
  order_step!: number

  @Expose()
  prices!: {
    delivery_fee: number
    estimated_fee: number
    order_fee: number
    part_fee: number
    total_fee: number
    made_fee: number
  }

  @Expose()
  project_seq!: number

  @Expose()
  seq_no!: number

  @Expose()
  team_seq!: number

  @Expose()
  user_seq!: number
}

export class OrderHistoryDto extends BaseDto {
  @Expose()
  project_seq!: number

  @Expose()
  project_name!: string
  // 주문 seq_no
  @Expose()
  seq_no!: number
  // 주문번호
  @Expose()
  order_number!: number
  // 주문 일시 정보
  @Expose()
  created_at!: string
  @Expose()
  amount!: number
  @Expose()
  prices!: {
    part_fee: number
    order_fee: number
    estimated_fee: number
    delivery_fee: number
    total_fee: number
    made_fee: number
  }
  @Expose()
  options!: {
    board_type: string
    thickness: string
    solder_mask: string
    silkscreen: string
    surface_finish: string
    via_process: string
    finished_copper: string
    min_holl_size: string
    min_track_spacing: string
  }
  // Order Status
  @Expose()
  @Transform(value => {
    const status = value as unknown as number

    if (isNaN(status) || status === undefined || status === null || status < 2) {
      return 1
    } else {
      return status - 2
    }
  })
  order_step!: number
  @Expose()
  address_seq!: number
  @Expose()
  user_seq!: number
  @Expose()
  team_seq!: number
  // 추가된 내용
  @Expose()
  address_name!: string
  @Expose()
  receiver!: string
  @Expose()
  phone_number!: string
  @Expose()
  address_json_string!: string
  @Expose()
  postal_code!: string
  @Expose()
  method!: string
  @Expose()
  is_smt!: boolean
  @Expose()
  is_motion!: string

  @Expose()
  receipt!: string

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (value ? JSON.parse(value as string) : null), { toClassOnly: true })
  company_data!: CompanyJson | null
  // 결제방법
  // Methods string `json:"methods"`
}
export class OrderShippingDto extends BaseDto {
  @Expose()
  created_at!: string
  @Expose()
  order_number!: string
  @Expose()
  shipping_company!: string
  @Expose()
  shipping_number!: string
}
