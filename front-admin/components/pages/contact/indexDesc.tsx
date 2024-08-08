import { ContactDto } from "@/apis/dto/contact.dto"

//------------------------------------------------------------------------------------------------------
export const ContactIndex = {
  keys: ["index", "tag", "title", "writer", "updated_at", "manage"],
}

export const ContactIndexDetail = {
  index: { label: "No.", sorter: true },
  tag: { label: "분류", sorter: true },
  title: { label: "문의 제목", sorter: true },
  writer: { label: "작성자", sorter: true },
  updated_at: { label: "작성일", sorter: true },
  manage: { label: "관리", align: "center" },
}

//------------------------------------------------------------------------------------------------------
// Data Type
export class ContactIndexType extends ContactDto {
  index: number
  key: number
  manage: number
}
