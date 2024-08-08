import { IDropDownSelectProps } from "type"

export class DropdownUIProcessor {
  // static getValueByStatus(props: IDropDownSelectProps, selectItem: DropDownOption | undefined) {
  //   if (this.checkDropdownStatus(props)) {
  //     return {
  //       value: "disabled",
  //       label: (
  //         <div
  //           className="color-box"
  //           style={{
  //             backgroundColor: "#dcdcdc",
  //             height: 20,
  //             marginTop: 5,
  //           }}
  //         />
  //       ),
  //     }
  //   } else {
  //     return selectItem
  //   }
  // }

  // static checkDropdownStatus(props: IDropDownSelectProps) {
  //   return props.type === "color" && props.disabled
  // }

  static getDefaultSelectItem(props: IDropDownSelectProps) {
    return props.options && props.options[0]
  }
}

//uiprocessor의 목적
// style계산 ,
//각 컴포넌트의 독립적인 value계산 ,
// ui컴포넌트의 event함수(onClick등)
