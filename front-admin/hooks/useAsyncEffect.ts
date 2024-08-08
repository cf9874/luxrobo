import { useEffect, DependencyList } from "react"

export const useAsyncEffect = (asyncEffect: () => Promise<void>, deps?: DependencyList) => {
  useEffect(() => {
    const asyncEffectWrapper = async () => {
      await asyncEffect()
    }
    void asyncEffectWrapper()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
