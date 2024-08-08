import { SimpleProjectDto } from "@/apis/dto/project.dto"

//------------------------------------------------------------------------------------------------------
export const ProjectIndex = {
  keys: ["index", "uuid", "title", "owner", "workspace", "updated_at", "manage"],
}

export const ProjectIndexDetail = {
  index: { label: "No.", sorter: true },
  uuid: { label: "프로젝트 ID", sorter: true },
  title: { label: "프로젝트 이름", sorter: true },
  owner: { label: "작성자", sorter: true },
  workspace: { label: "작업 공간", sorter: true },
  updated_at: { label: "최근 수정 날짜", sorter: true },
  manage: { label: "관리", align: "center" },
}

//------------------------------------------------------------------------------------------------------
// Data Type
export class ProjectIndexType extends SimpleProjectDto {
  key: number
  index: number
  manage: React.Key
  // work_name: string
}
