import { useState } from "react"

interface IParams<T> {
  value?: any
  errorMsg?: string
  //   maxLength?: number
  validCheck?: T
}

export const useChanges = <T extends (...args: any) => any>({
  value = null,
  errorMsg = "",
  //   maxLength = 99999,
  validCheck = (() => {}) as T,
}: IParams<T>) => {
  const [data, setData] = useState({
    value,
    isValid: true,
    errorMsg,
    //maxLength,
  })

  const onClear = () => {
    setData(data => ({ ...data, value, errorMsg, isValid: true }))
  }

  const onChange = (change: any) => {
    setData(data => ({ ...data, value: change }))
  }

  const validHandler = (_value?: any) => {
    let isValid: boolean
    try {
      const value = validCheck(_value !== undefined ? _value : data.value)

      isValid = true

      setData({
        value,
        isValid,
        errorMsg: "",
      })
    } catch (error: any) {
      isValid = false

      setData(data => ({
        ...data,
        isValid,
        errorMsg: error.message as string,
      }))
    }

    return isValid
  }

  return {
    ...data,
    onChange,
    onValidCheck: validHandler,
    onClear,
  } as const
}
