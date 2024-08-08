import React from "react"
import { shallowEqual } from "react-redux"
import { setModal } from "redux/reducers/config"
import { useAppSelector, useRedux } from "hooks"

const Modal = () => {
  const { modal } = useAppSelector(state => state.configReducer, shallowEqual)
  const modalDispatch = useRedux(setModal)

  return (
    <div
      className={`modal ${modal.open && "open"}`}
      onClick={() => {
        modalDispatch({ open: false })
      }}
    >
      {modal.open ? <div onClick={e => e.stopPropagation()}>{modal.children}</div> : null}
    </div>
  )
}
export default Modal
