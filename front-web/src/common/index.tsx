import React from "react"
import Modal from "./Modal"
import Loading from "./Loading"
import Pausing from "./Pause"
import Check from "./Check"

interface ICommonProps {
  children: React.ReactNode
}

export const Common = (props: ICommonProps) => {
  return (
    <>
      {props.children}
      <Modal />
      <Loading />
      <Pausing />
      <Check />
    </>
  )
}
