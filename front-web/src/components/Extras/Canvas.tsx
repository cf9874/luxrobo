import { ICanvasProps } from "type"

const Canvas = (props: ICanvasProps) => {
  console.log(props.json) // json데이터는 props의 onUndo , onRedo를 할때마다 자동으로 업데이트됨

  return <></>
}

export default Canvas
