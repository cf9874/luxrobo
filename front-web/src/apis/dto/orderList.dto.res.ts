// import { IsBoolean, IsInt, IsString } from "class-validator"
import { Expose } from "class-transformer"

export class OrderListDtoRes {
  @Expose()
  seq!: number

  @Expose()
  project!: {
    name: string
  }

  @Expose()
  price!: {
    order_price: number
    part_total_price: number
    expected_fee: number
    shipping_price: number
    total_price: number
  }
  @Expose()
  order!: {
    order_company: string
    order_no: number
    order_date: string
    order_quantity: number
    order_status: number
    order_address: string
    order_card: string
    is_smt: boolean
    is_work: boolean
    deliver_company: string
    deliver_no: number
  }
  @Expose()
  pcb_option!: {
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
}
