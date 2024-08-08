import { CartAction, StoreBlock } from "./types"
import { createReducer } from "typesafe-actions"
import { REMOVE_BLOCK, PUSH_BLOCK, RESET_CART, UPDATE_BLOCK } from "./actions"
import produce from "immer"
const initialState: StoreBlock[] = []

const reducer = createReducer<StoreBlock[], CartAction>(initialState, {
  [REMOVE_BLOCK]: (state, { payload }) => {
    return produce(state, draft => {
      const index = draft.findIndex(block => block.type === payload.type)
      if (index !== -1) {
        draft.splice(index, 1)
      }
    })
  },
  [PUSH_BLOCK]: (state, { payload }) => {
    return produce(state, draft => {
      draft.push(payload)
    })
  },
  [RESET_CART]: state => {
    return produce(state, () => {
      return []
    })
  },
  // [FIND_BLOCK]: state => {
  //   return produce(state, () => {
  //     return []
  //     // block이 없으면 null
  //   })
  // },
  [UPDATE_BLOCK]: (state, { payload }) => {
    return produce(state, draft => {
      const { index, updatedBlock } = payload
      if (index !== -1 && index < draft.length) {
        draft[index] = updatedBlock
      }
    })
  },
})

export default reducer
