import { Expose, Transform } from "class-transformer"
import { BaseDto } from "./base.dto"

export class OrderDto {
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
  receipt!: string

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
  order_number!: string

  @Expose()
  order_step!: number

  @Expose()
  prices!: {
    delivery_fee: number
    estimated_fee: number
    order_fee: number
    part_fee: number
    total_fee: number
  }

  @Expose()
  project_name!: string

  @Expose()
  project_seq!: number

  @Expose()
  seq_no!: number

  @Expose()
  shipping_id!: number

  @Expose()
  team_seq!: number

  @Expose()
  user_name!: string

  @Expose()
  user_seq!: number

  //
  @Expose()
  payment_key!: number

  @Expose()
  created_at!: string

  // @Expose()
  // company_name!: string

  @Expose()
  address_info!: {
    addressID: number
    address_json_string: string
    address_name: string
    is_default: boolean
    phone_number: string
    postal_code: string
    receiver: string
  }

  @Expose()
  // @Transform(({ value }) => (value ? JSON.parse(value as string) : null), { toClassOnly: true })
  company_data!: CompanyJson | null
}

export interface CompanyJson {
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

export class SimpleOrderInfoDto {
  @Expose()
  created_at!: string

  @Expose()
  order_number!: string

  @Expose()
  project_name!: string

  @Expose()
  project_seq!: number

  @Expose()
  seq_no!: number

  @Expose()
  team_seq!: number

  @Expose()
  total_fee!: number

  @Expose()
  user_name!: string

  @Expose()
  user_seq!: number

  //
  @Expose()
  payment_key!: number
}

export class ShippingInfoDto {
  @Expose()
  bom_file!: string

  @Expose()
  gerber_file!: string

  @Expose()
  order_number!: string

  @Expose()
  order_step!: number

  @Expose()
  project_name!: string

  @Expose()
  project_seq!: number

  @Expose()
  seq_no!: number

  @Expose()
  shipiing_company!: string

  @Expose()
  shipping_id!: number

  @Expose()
  shipping_number!: string

  @Expose()
  team_seq!: number

  @Expose()
  user_name!: string

  @Expose()
  user_seq!: number

  //
  @Expose()
  created_at!: string

  @Expose()
  part_company!: string

  @Expose()
  part_number!: string
}

export class SimpleShippingInfoDto {
  @Expose()
  created_at!: string

  @Expose()
  order_number!: string

  @Expose()
  order_step!: number

  @Expose()
  project_name!: string

  @Expose()
  project_seq!: number

  @Expose()
  seq_no!: number

  @Expose()
  team_seq!: number

  @Expose()
  user_name!: string

  @Expose()
  user_seq!: number
}
