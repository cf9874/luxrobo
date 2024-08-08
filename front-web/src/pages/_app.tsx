import "../globals.css"
import "common/modal.scss"
import { persistor, default as store } from "../redux/store"
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { Common } from "common"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Common>
          <Component {...pageProps} />
        </Common>
      </PersistGate>
    </Provider>
  )
}

export default MyApp
