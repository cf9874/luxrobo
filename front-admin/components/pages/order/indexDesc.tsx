import { SimpleOrderInfoDto } from "@/apis/dto/order.dto"

//------------------------------------------------------------------------------------------------------
export const OrderIndex = {
  keys: ["index", "order_number", "project_name", "user_name", "total_fee", "created_at", "manage"],
}

export const OrderIndexDetail = {
  index: { label: "No.", sorter: true },
  order_number: { label: "주문 번호", sorter: true },
  project_name: { label: "프로젝트 이름", sorter: true },
  user_name: { label: "사용자", sorter: true },
  total_fee: { label: "결제 금액 / 승인 번호", sorter: true },
  created_at: { label: "주문일", sorter: true },
  manage: { label: "관리", align: "center" },
}
//------------------------------------------------------------------------------------------------------
export const OrderNullData = [
  {
    key: null,
    index: null,
    orderNumber: null,
    project: null,
    user: null,
    payment: null,
    purchaseDate: null,
    manage: null,
  },
]

//------------------------------------------------------------------------------------------------------
// Data Type
export class OrderIndexType extends SimpleOrderInfoDto {
  key: number
  index: number
  manage: React.Key
}
