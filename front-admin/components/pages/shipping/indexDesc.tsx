import { SimpleShippingInfoDto } from "@/apis/dto/order.dto"
import { DefaultDataDtoRes } from "@/apis/dto/pages.dto.res"

//------------------------------------------------------------------------------------------------------
export const ShippingIndex = {
  keys: ["index", "order_number", "project_name", "user_name", "order_step", "created_at", "manage"],
}

export const ShippingIndexDetail = {
  index: { label: "No.", sorter: true },
  order_number: { label: "주문 번호", sorter: true },
  project_name: { label: "프로젝트 이름", sorter: true },
  user_name: { label: "사용자", sorter: true },
  order_step: { label: "주문 및 배송 상태", sorter: true },
  created_at: { label: "주문일", sorter: true },
  manage: { label: "관리", align: "center" },
}

//------------------------------------------------------------------------------------------------------
export const ShippingNullData = [
  {
    key: null,
    index: null,
    orderNumber: null,
    project: null,
    user: null,
    current: null,
    purchaseDate: null,
    manage: null,
  },
]
//------------------------------------------------------------------------------------------------------
// Data Type
export class ShipmentIndexType extends DefaultDataDtoRes {
  key: React.Key
  id: React.Key
  orderNumber?: string
  project?: string
  user?: string
  current?: string
  purchaseDate?: string
  manage?: React.Key
}

export class ShippingIndexType extends SimpleShippingInfoDto {
  key: number
  index: number
  manage: React.Key
}

//------------------------------------------------------------------------------------------------------
