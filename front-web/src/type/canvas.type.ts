import { Dispatch, SetStateAction } from "react"

export interface ICanvasProps {
  onUndo: () => void
  onRedo: () => void
  ModalA: React.ReactNode // test네임 이후 작업시 네임교체
  json: string // 이후 럭스로보에서 json규격정해지면 타입교체
  setJson: Dispatch<SetStateAction<string>>
}
