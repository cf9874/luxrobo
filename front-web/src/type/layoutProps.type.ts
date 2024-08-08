import { TeamDto } from "apis/dto"

export interface ILayoutWorkspaceProps {
  teamList?: TeamDto[]
  children: React.ReactNode
}
export interface ILayoutSupportProps {
  children: React.ReactNode
}
export interface ILayotMainProps {
  children: React.ReactNode
}
