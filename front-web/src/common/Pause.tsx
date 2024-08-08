import { useAppSelector } from "hooks"
import React from "react"
import { shallowEqual } from "react-redux"

const Pausing = () => {
  const { isPause } = useAppSelector(state => state.configReducer, shallowEqual)

  return (
    <div className={`pause ${isPause && `open`}`}>
      <div onClick={e => e.stopPropagation()}></div>
    </div>
  )
}

export default Pausing
