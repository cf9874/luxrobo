import { combineReducers } from "@reduxjs/toolkit"
import configReducer from "./config"
import profileReducer from "./profile"
const rootReducer = combineReducers({
  configReducer,
  profileReducer,
})
export default rootReducer

export type RootState = ReturnType<typeof rootReducer>
