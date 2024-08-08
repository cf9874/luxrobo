export enum MENU_TITLE {
  INPUT = "Input",
  OUTPUT = "Output",
  COMM = "Comm",
  BATTERY = "Battery",
  POWER = "Power",
  CUSTOM = "Custom",
  MCU = "MCU",
  ALL = "All",
}

export enum CATEGORY_COLOR {
  Input = "#1aa7ff",
  Output = "#ff785c",
  Comm = "#ffc620",
  Battery = "#5ff053",
  PowerIn = "#595bfb",
  PowerOut = "#f24463",
  Custom = "#000",
  MCU = "#1b3852",
  ALL = "#45d6df",
}
export enum CATEGORY_INDEX {
  ALL,
  INPUT,
  OUTPUT,
  COMM,
  BATTERY,
  POWERIN,
  POWEROUT,
  CUSTOM,
  MCU,
}

export const isMenuTitle = (title: string): title is MENU_TITLE => {
  return Object.values(MENU_TITLE).includes(title as MENU_TITLE)
}

// export const isMenuTitle = (title: MENU_TITLE) => {
//   return Object.values(MENU_TITLE).includes(title)
// }

// 그냥 이렇게 안하고
//`title is MENU_TITLE`로 title을 캐스팅해서 title이 MENU_TITLE 타입인지 확인할 수 있음
// 타입안정성, 코드안정성이 더 높음
