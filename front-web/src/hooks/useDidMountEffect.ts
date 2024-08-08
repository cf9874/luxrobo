import { DependencyList, useEffect, useRef } from "react"

export const useDidMountEffect = (func: () => void, deps: DependencyList) => {
  const isFirst = useRef(false)
  useEffect(() => {
    if (isFirst.current) func()
    else isFirst.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
