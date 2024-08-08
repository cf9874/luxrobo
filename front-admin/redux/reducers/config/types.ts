import { CSSProperties } from "react"
import { ActionType } from "typesafe-actions"
import * as actions from "./actions"

export type ConfigAction = ActionType<typeof actions>

// export interface DropDownEvent extends React.MouseEvent<HTMLElement> {
//   target: {
//     getBoundingClientRect: () => { right: number; top: number; height: number; x: number; width: number; left: number }
//   }
// }

export type ConfigState = {
  modal: Modal
  dropdown: Dropdown
  selectbox: Selectbox
  isLoading: boolean
}

export type Modal = {
  open: boolean
  children: string
  parentStyle: CSSProperties
}
export type Dropdown = {
  open: boolean
  event: React.MouseEvent<HTMLElement> | null
  style: CSSProperties
  children: ""
  position: "L" | "R"
}
export type Selectbox = {
  open: { [key: string | number]: boolean }
  value: { [key: string | number]: string | number }
  openSrc: string
  closeSrc: string
}

export type IsLoading = boolean
