import { Profile, ProfileAction } from "./types"
import { createReducer } from "typesafe-actions"
import { INIT_PROFILE, UPDATE_PROFILE } from "./actions"
import produce from "immer"

const initialState: { profile: Profile } = {
  profile: null,
}

const reducer = createReducer<{ profile: Profile }, ProfileAction>(initialState, {
  [UPDATE_PROFILE]: (state, { payload }) => {
    return produce(state, draft => {
      if (draft.profile === null) {
        draft.profile = {
          accountID: null,
          adminID: null,
          auth_ID: null,
          auth_admin: null,
          auth_company: null,
          auth_contact: null,
          auth_customblock: null,
          auth_name: null,
          auth_order: null,
          auth_part: null,
          auth_project: null,
          auth_team: null,
          auth_user: null,
          user_name: null,
        }
      }

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
