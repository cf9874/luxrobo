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
  check: Modal
  isLoading: boolean
  isPause: boolean
}

export type Modal = {
  open: boolean
  children?: JSX.Element
}

export type IsLoading = boolean
