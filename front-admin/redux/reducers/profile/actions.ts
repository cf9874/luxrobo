import { createAction } from "typesafe-actions"
import { Profile } from "./types"
export const UPDATE_PROFILE = "store/reducers/profile/update"
export const INIT_PROFILE = "store/reducers/profile/init"

export const updateProfile = createAction(UPDATE_PROFILE)<Partial<Profile>>()
export const initProfile = createAction(INIT_PROFILE)<Profile>()
