import { createAction } from "typesafe-actions"
import { StoreBlock } from "./types"
export const PUSH_BLOCK = "store/reducers/config/PUSH_BLOCK"
export const REMOVE_BLOCK = "store/reducers/config/POP_BLOCK"
export const RESET_CART = "store/reducers/config/RESET_CART"
// export const FIND_BLOCK = "store/reducers/config/FIND_BLOCK"
export const UPDATE_BLOCK = "store/reducers/config/UPDATE_BLOCK"

export const pushStoreBlock = createAction(PUSH_BLOCK)<StoreBlock>()
export const removeStoreBlock = createAction(REMOVE_BLOCK)<StoreBlock>()
export const updateStoreBlock = createAction(UPDATE_BLOCK)<{ index: number; updatedBlock: StoreBlock }>()
export const resetCartList = createAction(RESET_CART)()
// export const findStoreBlock = createAction(FIND_BLOCK)()
