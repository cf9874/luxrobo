import { ISelectProps } from "./select.type"
import { BasicSelect } from "./select.basic"
import { ToolKindValues, toolCategoryOptions, toolKindValuesOptions } from "@/const"

export const ToolFeatureCategorySelection = (props: ISelectProps) => {
  return <BasicSelect options={toolCategoryOptions} {...props}></BasicSelect>
}

//-------------------------------------------------------------------------
export const ToolFeatureKindSelection = (props: ISelectProps) => {
  return (
    <BasicSelect
      options={(() => {
        if (!props.option) return []
        if (Object.keys(ToolKindValues).includes(props.option.toString())) {
          return toolKindValuesOptions[props.option]
        }
        return []
      })()}
      {...props}
    ></BasicSelect>
  )
}
