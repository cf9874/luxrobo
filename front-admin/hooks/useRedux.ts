import { useAppDispatch } from "hooks"
import { useCallback } from "react"
import { PayloadActionCreator } from "typesafe-actions"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useRedux = <T extends (...args: any) => any, P extends Parameters<T>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func: T extends PayloadActionCreator<string, any> ? T : (...args: P) => any,
) => {
  const dispatch = useAppDispatch()

  const wrapper = useCallback(
    (...args: P) => {
      dispatch(func(...args))
    },
    [dispatch, func],
  )

  return wrapper
}
