import { SimpleCustomblockDto } from "@/apis/dto/customblock.dto"
//------------------------------------------------------------------------------------------------------
export const CustomIndex = {
  keys: ["index", "uuid", "name", "owner", "updated_at", "manage"],
}

export const CustomIndexDetail = {
  index: { label: "No.", sorter: true },
  uuid: { label: "커스텀 블록 ID", sorter: true },
  name: { label: "커스텀 블록 이름", sorter: true },
  owner: { label: "사용자", sorter: true },
  updated_at: { label: "최근 수정 날짜", sorter: true },
  manage: { label: "관리", align: "center" },
}

//------------------------------------------------------------------------------------------------------
export class CustomIndexType extends SimpleCustomblockDto {
  key: number
  index: number
  manage: React.Key
}
