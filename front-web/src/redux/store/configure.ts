import { configureStore, Store } from "@reduxjs/toolkit"
import { createLogger } from "redux-logger"
import rootReducer from "../reducers"
import { persistReducer, persistStore } from "redux-persist"
import createWebStorage from "redux-persist/lib/storage/createWebStorage"
import { WebStorage } from "redux-persist/lib/types"
import thunk from "redux-thunk"

export const createPersistStorage = (): WebStorage => {
  const isServer = typeof window === "undefined"

  if (isServer) {
    return {
      getItem() {
        return Promise.resolve(null)
      },
      setItem() {
        return Promise.resolve()
      },
      removeItem() {
        return Promise.resolve()
      },
    }
  }

  return createWebStorage("local")
}

export let store: Store
const persistConfig = {
  key: "root",
  storage: createPersistStorage(),
  blacklist: ["configReducer"],
  // whitelist:[]
}
const createStore = () => {
  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const logger = createLogger()

  store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      })
        .concat(logger)
        .concat(thunk),
    devTools: process.env.NODE_ENV !== "production",
    preloadedState: {},
    enhancers: defaultEnhancers => [...defaultEnhancers],
  })

  const persistor = persistStore(store)

  // if (process.env.NODE_ENV === "production")
  //   store = createStore(persistReducer(persistConfig, modules), applyMiddleware(thunk))
  // else store = createStore(persistReducer(persistConfig, modules), composeWithDevTools(applyMiddleware(thunk, logger)))

  return { store, persistor }
}

export default createStore

export type AppDispatch = typeof store.dispatch
