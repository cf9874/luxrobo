import React from "react"
import { shallowEqual } from "react-redux"
import { useAppSelector } from "hooks"

const Check = () => {
  const { check } = useAppSelector(state => state.configReducer, shallowEqual)

  return (
    <div className={`modal ${check.open && "open"}`}>
      {check.open ? <div onClick={e => e.stopPropagation()}>{check.children}</div> : null}
    </div>
  )
}
export default Check
