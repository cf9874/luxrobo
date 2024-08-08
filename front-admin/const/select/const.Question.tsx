import { SelectProps } from "antd"

export const getQuestionCategory = (tag: number) => {
  switch (tag) {
    case 1:
      return "프로젝트 관련"
    case 2:
      return "오류 / 버그"
    case 3:
      return "주문 / 배송"
    case 4:
      return "기타"
    default:
      return ""
  }
}

export const questionCategoryOptions: SelectProps["options"] = [
  { value: 1, label: "프로젝트 관련" },
  { value: 2, label: "오류 / 버그" },
  { value: 3, label: "주문 / 배송" },
  { value: 4, label: "기타" },
]

export default questionCategoryOptions
