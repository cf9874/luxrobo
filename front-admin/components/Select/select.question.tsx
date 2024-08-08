import { ISelectProps } from "./select.type"
import { BasicSelect } from "./select.basic"
import { questionCategoryOptions } from "@/const"

export const QuestionCategorySelection = (props: ISelectProps) => {
  return <BasicSelect options={questionCategoryOptions} {...props}></BasicSelect>
}

export default QuestionCategorySelection
