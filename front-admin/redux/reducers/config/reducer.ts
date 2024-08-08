import { ConfigAction, ConfigState } from "./types"
import { createReducer } from "typesafe-actions"
import { SET_MODAL, SET_LOADING, SET_DROPDOWN, SET_SELECTBOX, SELECT_VALUE } from "./actions"
import produce from "immer"

// 초기 상태 선언
const initialState: ConfigState = {
  modal: {
    open: false,
    children: "",
    parentStyle: {},
  },
  dropdown: {
    open: false,
    event: null,
    style: {},
    children: "",
    position: "L",
  },
  selectbox: {
    open: {},
    value: {},
    openSrc: "",
    closeSrc: "",
  },
  isLoading: false,
}

// 리듀서 작성
const reducer = createReducer<ConfigState, ConfigAction>(initialState, {
  [SET_MODAL]: (state, { payload }) => {
    return produce(state, draft => {
      Object.assign(draft.modal, payload)
    })
  },
  [SET_LOADING]: (state, { payload }) => {
    return produce(state, draft => {
      draft.isLoading = payload
    })
  },
  [SET_DROPDOWN]: (state, { payload }) => {
    return produce(state, draft => {
      Object.assign(draft.dropdown, payload)
    })
  },
  [SET_SELECTBOX]: (state, { payload }) => {
    return produce(state, draft => {
      Object.assign(draft.selectbox, payload)
    })
  },
  [SELECT_VALUE]: (state, { payload }) => {
    return produce(state, draft => {
      draft.selectbox.open = {}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      draft.selectbox.value = {
        ...state.selectbox.value,
        ...payload,
      }
    })
  },
})

export default reducer
