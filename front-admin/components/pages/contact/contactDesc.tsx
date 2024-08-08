import { defaultDescriptionInfo } from "@/components/Description"
//------------------------------------------------------------------------------------------------------
export const ContactDesc = {
  descA: {
    // title: string, ReactNode, undefined 가능
    title: "문의 정보",
    column: 2,
    keys: ["title", "tag", "writer", "content", "reply"],
  } as defaultDescriptionInfo,
}
//------------------------------------------------------------------------------------------------------
// span: default = 1, label: default = -(ReactNode)
export const ContactDescDetail = {
  title: { label: "문의 제목", span: 2 },
  tag: { label: "분류", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  writer: { label: "작성자", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  content: { label: "문의 내용", span: 2 },
  reply: { label: "문의 답변", span: 2 },
}
//------------------------------------------------------------------------------------------------------
