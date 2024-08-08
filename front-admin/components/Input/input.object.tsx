import { BasicInput } from "./input.basic"
import { IInputProps } from "./input.type"

// object 내용 모두 입력 data
export const InputObject = (props: IInputProps) => {
  // value가 object
  switch (props.option) {
    default:
      return (
        <>
          <BasicInput {...{ ...props, value: JSON.stringify(props.value) }}></BasicInput>
        </>
      )
  }
}
