import { useMemo, useState } from "react"
import { DropDownOption, IDropDownSelectProps } from "type"
import { BasicDropdown } from "."

export const ColorSelectDropdown = (props: IDropDownSelectProps) => {
  const [selectItem, setSelectItem] = useState<DropDownOption | undefined>(props.options && props.options[0])

  const value = useMemo(() => {
    if (props.disabled) {
      return {
        value: "disabled",
        label: (
          <div
            className="color-box"
            style={{
              backgroundColor: "#dcdcdc",
              height: 20,
              marginTop: 5,
            }}
          />
        ),
      }
    } else {
      return selectItem
    }
  }, [props.disabled, selectItem])

  return <BasicDropdown {...props} value={value} onChange={(_, i) => setSelectItem(i)} />
}
