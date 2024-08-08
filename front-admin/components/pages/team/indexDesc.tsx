import { TeamProfileInfoDto } from "@/apis/dto/team.dto"

//------------------------------------------------------------------------------------------------------
export const TeamIndex = {
  keys: ["index", "team_name", "member", "email", "phone_number", "manage"],
}

export const TeamIndexDetail = {
  index: { label: "No.", sorter: true },
  team_name: { label: "팀 이름", sorter: true },
  member: { label: "팀 인원", sorter: true },
  email: { label: "이메일", sorter: true },
  phone_number: { label: "핸드폰", sorter: true },
  manage: { label: "관리", align: "center" },
}

//------------------------------------------------------------------------------------------------------
export class TeamIndexType extends TeamProfileInfoDto {
  key: number
  index: number
  member: number
  manage: React.Key
}
