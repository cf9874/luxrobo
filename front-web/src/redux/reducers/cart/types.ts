import { ActionType } from "typesafe-actions"
import * as actions from "./actions"

export type CartAction = ActionType<typeof actions>

export type StoreBlock = {
  type: string
  category: string
  icon: string
  tags: string[]
  count: number
}
