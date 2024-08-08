import { SimplePartDto } from "@/apis/dto/part.dto"

//------------------------------------------------------------------------------------------------------
export const PartIndex = {
  keys: ["index", "uuid", "category", "type", "part_name", "stock", "price", "manage"],
}

export const PartIndexDetail = {
  index: { label: "No.", sorter: true },
  uuid: { label: "부품 ID", sorter: true },
  category: { label: "카테고리", sorter: true },
  type: { label: "종류", sorter: true },
  part_name: { label: "부품 명", sorter: true },
  stock: { label: "재고 상태", sorter: true },
  price: { label: "가격", sorter: true },
  manage: { label: "관리", align: "center" },
}

//------------------------------------------------------------------------------------------------------
// Data Type
export class PartIndexType extends SimplePartDto {
  key: number
  index: number
  manage: React.Key
}
