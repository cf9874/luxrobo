import { TeamDto } from "apis/dto"
import { Dispatch, SetStateAction } from "react"

export interface IPersonalProfileTab {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userData?: any // 임시로 any
}
export interface IPersonalTeamsTab {
  teamList: TeamDto[]
  setTeamList: Dispatch<SetStateAction<TeamDto[]>>
}
