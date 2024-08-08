import { createAction } from "typesafe-actions"
import { Modal } from "./types"
export const SET_MODAL = "store/reducers/config/SET_MODAL"
export const SET_CHECK = "store/reducers/config/SET_CHECK"
export const SET_LOADING = "store/reducers/config/SET_LOADING"
export const SET_PAUSE = "store/reducers/config/SET_PAUSE"

export const setModal = createAction(SET_MODAL)<Modal>()
export const setCheck = createAction(SET_CHECK)<Modal>()
export const setLoading = createAction(SET_LOADING)<boolean>()
export const setPause = createAction(SET_PAUSE)<boolean>()
