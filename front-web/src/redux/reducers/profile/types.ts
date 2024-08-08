import { ActionType } from "typesafe-actions"
import * as actions from "./actions"

export type ProfileAction = ActionType<typeof actions>

export type Profile = {
  accountID: string
  countrycode: string
  email: string
  email_opt_in: boolean
  nickname: string
  phone_number: string
  phone_opt_in: boolean
  profile_image: string
  userID: number
  username: string
}

export type TeamProfile = {
  name: string
  email: string
  img: string
}
