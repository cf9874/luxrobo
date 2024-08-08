import { useCallback, useEffect, useState } from "react"

const listen = (onCopy?: () => void, onPaste?: () => void, onKeyUp?: (key: string) => void): boolean => {
  const [ctrl, setCtrl] = useState(false)
  const [shift, setShift] = useState(false)

  // handle what happens on key press
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Control") {
        setCtrl(true)
      } else if (event.key === "Shift") {
        setShift(true)
      } else if (ctrl) {
        const t = event.key.toLowerCase()

        if (t === "c") {
          onCopy!()
        } else if (t === "v") {
          onPaste!()
        }
      }
    },
    [ctrl, onCopy, onPaste],
  )

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Control") {
        setCtrl(false)
      } else if (event.key === "Shift") {
        setShift(false)
      } else {
        if (onKeyUp) {
          onKeyUp(event.key)
        }
      }
    },
    [onKeyUp],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  return shift
}

export const KeyboardUtil = {
  listen,
}
