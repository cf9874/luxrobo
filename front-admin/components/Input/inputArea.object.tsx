import { IInputAreaProps } from "./input.type"
import { BasicInputArea } from "./inputArea.basic"

export const ObjectInputArea = (props: IInputAreaProps) => {
  // value가 object
  switch (props.option) {
    default:
      return (
        <>
          <BasicInputArea {...{ ...props, value: JSON.stringify(props.value) }}></BasicInputArea>
        </>
      )
  }
}
