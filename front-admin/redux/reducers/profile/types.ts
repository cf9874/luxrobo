import { ActionType } from "typesafe-actions"
import * as actions from "./actions"

export type ProfileAction = ActionType<typeof actions>

export type Profile = {
  accountID: string
  adminID: number
  auth_ID: number
  auth_admin: boolean
  auth_company: boolean
  auth_contact: boolean
  auth_customblock: boolean
  auth_name: string
  auth_order: boolean
  auth_part: boolean
  auth_project: boolean
  auth_team: boolean
  auth_user: boolean
  user_name: string
}
