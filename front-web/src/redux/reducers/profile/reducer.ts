import { Profile, ProfileAction, TeamProfile } from "./types"
import { createReducer } from "typesafe-actions"
import { INIT_PROFILE, UPDATE_PROFILE } from "./actions"
import produce from "immer"
const initialState: { profile: Profile; teamProfileList: TeamProfile[] } = {
  profile: {
    accountID: "",
    countrycode: "",
    email: "",
    email_opt_in: false,
    nickname: "",
    phone_number: "",
    phone_opt_in: false,
    profile_image: "",
    userID: 0,
    username: "",
  },
  teamProfileList: [],
}

const reducer = createReducer<{ profile: Profile; teamProfileList: TeamProfile[] }, ProfileAction>(initialState, {
  [UPDATE_PROFILE]: (state, { payload }) => {
    return produce(state, draft => {
      Object.assign(draft.profile, payload)
    })
  },
  [INIT_PROFILE]: (state, { payload }) => {
    return produce(state, draft => {
      draft.profile = payload
    })
  },
})

export default reducer
