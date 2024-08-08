/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAction } from "typesafe-actions"

export const SET_MODAL = "store/reducers/config/SET_MODAL"
export const SET_LOADING = "store/reducers/config/SET_LOADING"
export const SET_DROPDOWN = "store/reducers/config/SET_DROPDOWN"
export const SET_SELECTBOX = "store/reducers/config/SET_SELECTBOX"
export const SELECT_VALUE = "store/reducers/config/SELECT_VALUE"

export const setModal = createAction(SET_MODAL)<any>()
export const setLoading = createAction(SET_LOADING)<boolean>()
export const setDropdown = createAction(SET_DROPDOWN)<any>()
export const setSelectbox = createAction(SET_SELECTBOX)<any>()
export const selectValue = createAction(SELECT_VALUE)<any>()
