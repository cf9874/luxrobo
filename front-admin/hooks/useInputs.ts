import { useCallback, useRef, useState } from "react"

interface IParams<T> {
  value?: string
  errorMsg?: string
  maxLength?: number
  validCheck?: T
}

export const useInputs = <T extends (...args: any) => any>({
  value = "",
  errorMsg = "",
  maxLength = 99999,
  validCheck = ((_value?: string) => {
    return _value
  }) as T,
}: IParams<T>) => {
  const [data, setData] = useState({
    value,
    isValid: true,
    errorMsg,
    maxLength,
  })

  const counter = useRef(0).current

  const onClear = () => {
    setData(data => ({ ...data, value, errorMsg, isValid: true }))
  }

  const onChange = useCallback((params: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const text = typeof params === "string" ? params : params.target.value

    if (counter <= maxLength) {
      setData(data => ({ ...data, value: text, maxLength: text.length + 2 * (maxLength - counter) }))
      return text
    }
    return
  }, [])

  const validHandler = (_value?: string) => {
    let isValid: boolean
    try {
      const value = validCheck(_value !== undefined ? _value : data.value)
      //const value = _value !== undefined ? _value : data.value

      isValid = true

      setData({
        value,
        isValid,
        errorMsg: "",
        maxLength,
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

  const onValidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validHandler(typeof e === "string" ? e : e.target.value)
    onChange(e)
  }

  return {
    ...data,
    onChange,
    onValidChange,
    onValidCheck: validHandler,
    onClear,
  } as const
}
