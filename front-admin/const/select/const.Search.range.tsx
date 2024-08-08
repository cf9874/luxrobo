import { DefaultOptionType } from "antd/es/select"

export const SearchUserRangeOptions: DefaultOptionType["options"] = [
  { value: 1, label: "전체" },
  { value: 2, label: "아이디" },
  { value: 3, label: "이름" },
  { value: 4, label: "이메일" },
  { value: 5, label: "핸드폰" },
]
export const SearchTeamRangeOptions: DefaultOptionType["options"] = [
  { value: 1, label: "전체" },
  { value: 2, label: "팀 이름" },
  { value: 3, label: "이메일" },
  { value: 4, label: "핸드폰" },
]
export const SearchProjectRangeOptions: DefaultOptionType["options"] = [
  { value: 1, label: "전체" },
  { value: 2, label: "이름" },
  { value: 3, label: "작성자" },
  { value: 4, label: "작업 공간" },
  { value: 5, label: "프로젝트 ID" },
]
export const SearchWorkspaceRangeOptions: DefaultOptionType["options"] = [
  { value: 1, label: "전체" },
  { value: 2, label: "이름/이메일" },
  { value: 3, label: "이메일" },
  { value: 4, label: "핸드폰" },
]
export const SearchCustomBlockRangeOptions: DefaultOptionType["options"] = [
  { value: 1, label: "전체" },
  { value: 2, label: "이름" },
  { value: 3, label: "사용자" },
  { value: 4, label: "커스텀블록 ID" },
]
export const SearchPartRangeOptions: DefaultOptionType["options"] = [
  { value: 1, label: "전체" },
  { value: 2, label: "카테고리" },
  { value: 3, label: "종류" },
  { value: 4, label: "부품명" },
  { value: 5, label: "부품 ID" },
]
export const SearchCompanyRangeOptions: DefaultOptionType["options"] = [
  { value: 1, label: "전체" },
  { value: 2, label: "발주처명" },
  { value: 3, label: "번호" },
  { value: 4, label: "홈페이지" },
]
export const SearchOrderRangeOptions: DefaultOptionType["options"] = [
  { value: 1, label: "전체" },
  { value: 2, label: "주문번호" },
  { value: 3, label: "프로젝트 이름" },
  { value: 4, label: "사용자" },
  { value: 5, label: "주문일" },
]

export const SearchShippingRangeOptions: DefaultOptionType["options"] = [
  { value: 1, label: "전체" },
  { value: 2, label: "주문번호" },
  { value: 3, label: "프로젝트 이름" },
  { value: 4, label: "사용자" },
  { value: 5, label: "주문일" },
]

export const SearchContactRangeOptions: DefaultOptionType["options"] = [
  { value: 1, label: "전체" },
  { value: 2, label: "분류" },
  { value: 3, label: "제목" },
  { value: 4, label: "작성자" },
]
