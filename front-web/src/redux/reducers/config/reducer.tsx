import { ConfigAction, ConfigState } from "./types"
import { createReducer } from "typesafe-actions"
import { SET_MODAL, SET_LOADING, SET_PAUSE, SET_CHECK } from "./actions"
import produce from "immer"
// 초기 상태 선언
const initialState: ConfigState = {
  modal: {
    open: false,
    children: <></>,
  },
  check: {
    open: false,
    children: <></>,
  },
  isLoading: false,
  isPause: false,
}

// 리듀서 작성
const reducer = createReducer<ConfigState, ConfigAction>(initialState, {
  [SET_MODAL]: (state, { payload }) => {
    return produce(state, draft => {
      Object.assign(draft.modal, payload)
    })
  },
  [SET_CHECK]: (state, { payload }) => {
    return produce(state, draft => {
      Object.assign(draft.check, payload)
    })
  },
  [SET_LOADING]: (state, { payload }) => {
    return produce(state, draft => {
      draft.isLoading = payload
    })
  },
  [SET_PAUSE]: (state, { payload }) => {
    return produce(state, draft => {
      draft.isPause = payload
    })
  },
})
export default reducer
