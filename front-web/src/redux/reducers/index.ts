import { combineReducers } from "@reduxjs/toolkit"
import configReducer from "./config"
import cartReducer from "./cart"
import profileReducer from "./profile"
const rootReducer = combineReducers({
  configReducer,
  cartReducer,
  profileReducer,
})
export default rootReducer

export type RootState = ReturnType<typeof rootReducer>
