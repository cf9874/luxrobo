import { BaseDto } from "@/apis/dto"
import { CustomblockDto, NamingParam, SchemaBom } from "@/apis/dto/customblock.dto"
import { defaultDescriptionInfo } from "@/components/Description/description.type"

//------------------------------------------------------------------------------------------------------
// 각 description 정보
//(title(생략 가능), column(생략가능, default = 3), keys, attribute(description))
export const CustomNewDesc = {
  descA: {
    title: "커스텀 블록 정보",
    column: 2,
    keys: ["name", "owner", "created_at", "updated_at", "workspace", "", "description"],
  } as defaultDescriptionInfo,
  descB: { title: "커스텀 블록 Specification", column: 1, keys: ["rawData"] } as defaultDescriptionInfo,
  descC: {
    column: 2,
    keys: ["schematics_file", "schematicsFileBtn", "pcb_board_file", "PCBBoardFileBtn"],
  } as defaultDescriptionInfo,
  descD: {
    title: "Schema BOM",
    keys: ["index", "part_name", "part_prefix", "footprint", "quantity"],
  },
  descE: {
    title: "IO Ports",
    keys: ["index", "pin_name", "io_type", "pin_type", ["VoltRange", "min_vol", "max_vol"]],
  },
}

export const CustomNewDescDetail = {
  // A
  name: { label: "이름", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  owner: { label: "작성자", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  created_at: { label: "생성일" },
  updated_at: { label: "최종 수정일" },
  workspace: { label: "소속 작업 공간" },
  description: { label: "설명" },
  // B
  rawData: { label: "Raw Data", labelStyle: { width: "25%" }, contentStyle: { width: "75%" } },
  // C
  schematics_file: { label: "Schematics File", labelStyle: { width: "25%" }, contentStyle: { width: "50%" } },
  schematicsFileBtn: { labelStyle: { display: "none" }, contentStyle: { width: "25%", textAlign: "center" } },
  pcb_board_file: { label: "PCB Board File" },
  PCBBoardFileBtn: { labelStyle: { display: "none" }, contentStyle: { width: "25%", textAlign: "center" } },
  // D
  index: { label: "No.", align: "center" },
  part_name: { label: "Name", align: "center" },
  footprint: { label: "Footprint", align: "center" },
  part_prefix: { label: "Prefix", align: "center" },
  quantity: { label: "Quantity", align: "center" },
  // E
  // index: { label: "No." },
  pin_name: { label: "Port Name", align: "center" },
  io_type: { label: "IO Type", align: "center" },
  pin_type: { label: "Pin Type", align: "center" },
  VoltRange: { label: "VoltRange" },
  min_vol: { label: "Min", align: "center" },
  max_vol: { label: "Max", align: "center" },
}
//------------------------------------------------------------------------------------------------------
export const customNewNullInfo = {
  color: "",
  created_at: "",
  customblockID: null,
  description: "",
  name: "",
  naming_param: [
    {
      io_type: "",
      max_vol: null,
      min_vol: null,
      pin_name: "",
      pin_type: "",
    },
  ],
  partID: "",
  pcb_board_file: "",
  schema_bom: [
    {
      footprint: "",

      part_name: "",

      part_prefix: "",
    },
  ],
  schematics_file: "",
  specification: {},
  teamID: null,
  type: "",
  updated_at: "",
  userID: null,
  owner: "",
  workspace: "",
} as CustomblockDto

//------------------------------------------------------------------------------------------------------
// Data Type
export class CustomblockRawData {
  color: string
  type: string
  specification: {
    [key: string]: string
  }
}

export class CustomNewDescBType extends BaseDto {
  rawData: string
}

export class CustomNewDescDType extends SchemaBom {
  index?: number
  quantity?: number
}

export class CustomNewDescEType extends NamingParam {
  index: number
}

//------------------------------------------------------------------------------------------------------

// import { DefaultDataDtoRes } from "@/apis/dto/pages.dto.res"
// import { defaultDescriptionInfo } from "@/components/Description/description.type"

// //------------------------------------------------------------------------------------------------------
// // 각 description 정보
// //(title(생략 가능), column(생략가능, default = 3), keys, attribute(description))
// export const CustomNewDesc = {
//   descA: {
//     title: "커스텀 블록 정보",
//     column: 2,
//     keys: ["name", "user", "create_dt", "update_dt", "workspace", "", "explain"],
//   } as defaultDescriptionInfo,
//   descB: { title: "커스텀 블록 Specification", column: 1, keys: ["blockSpec"] } as defaultDescriptionInfo,
//   descC: {
//     title: "커스텀 블록 Files",
//     column: 2,
//     keys: ["schematicsFile", "schematicsFileBtn", "PCBBoardFile", "PCBBoardFileBtn"],
//   } as defaultDescriptionInfo,
//   descD: {
//     title: "Schema BOM",
//   },
//   descE: {
//     title: "IO Ports",
//     keys: ["index", "PortName", "IOType", "PinType", ["VoltRange", "VoltRangeMin", "VoltRangeMax"]],
//   },
// }

// export const CustomNewDescDetail = {
//   // A
//   name: { label: "이름", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
//   user: { label: "작성자", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
//   create_dt: { label: "생성일" },
//   update_dt: { label: "최종 수정일" },
//   workspace: { label: "소속 작업 공간" },
//   explain: { label: "설명" },
//   // B
//   blockSpec: { label: "Raw Data", labelStyle: { width: "25%" }, contentStyle: { width: "75%" } },
//   // C
//   schematicsFile: { label: "Schematics File", labelStyle: { width: "25%" }, contentStyle: { width: "50%" } },
//   schematicsFileBtn: { labelStyle: { display: "none" }, contentStyle: { width: "25%", textAlign: "center" } },
//   PCBBoardFile: { label: "PCB Board File" },
//   PCBBoardFileBtn: { labelStyle: { display: "none" }, contentStyle: { width: "25%", textAlign: "center" } },
//   // E
//   index: { label: "No." },
//   PortName: { label: "Port Name" },
//   IOType: { label: "IO Type" },
//   PinType: { label: "Pin Type" },
//   VoltRange: { label: "VoltRange" },
//   VoltRangeMin: { label: "Min" },
//   VoltRangeMax: { label: "Max" },
// }
// //------------------------------------------------------------------------------------------------------
// export const CustomNewNullDataA = [
//   {
//     id: null,
//     user: null,
//     name: null,
//     create_dt: null,
//     update_dt: null,
//     workspace: null,
//     explain: null,
//   },
// ]

// export const CustomNewNullDataB = [
//   {
//     id: null,
//     blockSpec: {
//       "Icon Image": "",
//       Color: "",
//       Category: "",
//       Type: "",
//       Termination: "",
//       "Forward Current": "",
//       LEDColor: "",
//     },
//   },
// ]
// export const CustomNewNullDataC = [
//   {
//     id: null,
//     schematicsFile: {
//       link: null,
//       text: null,
//     },
//     schematicsFileBtn: null,
//     PCBBoardFile: {
//       link: null,
//       text: null,
//     },
//     PCBBoardFileBtn: null,
//   },
// ]
// export const CustomNewNullDataD = [
//   {
//     id: null,
//     BOMSchema: [
//       {
//         "No.": null,
//         Name: null,
//         Prefix: null,
//         Footprint: null,
//         Quantity: null,
//       },
//     ],
//   },
// ]
// export const CustomNewNullDataE = [
//   {
//     id: null,
//     IOPorts: [
//       {
//         key: null,
//         index: null,
//         PortName: null,
//         IOType: null,
//         PinType: {
//           IOType: null,
//           IOPin: null,
//         },
//         VoltRangeMax: "",
//         VoltRangeMin: "",
//       },
//     ],
//   },
// ]

// //------------------------------------------------------------------------------------------------------
// // Data Type
// export class CustomNewDescAType extends DefaultDataDtoRes {
//   id: React.Key
//   name?: string
//   user?: string
//   create_dt?: string
//   update_dt?: string
//   workspace?: object
//   explain?: string
// }

// export class CustomNewDescBType extends DefaultDataDtoRes {
//   id: React.Key
//   blockSpec?: object
// }

// export class CustomNewDescCType extends DefaultDataDtoRes {
//   id: React.Key
//   schematicsFile?: object
//   schematicsFileBtn?: string
//   PCBBoardFile?: object
//   PCBBoardFileBtn?: string
// }

// export class CustomNewDescDType extends DefaultDataDtoRes {
//   id: React.Key
//   BOMSchema?: {
//     "No."?: React.Key
//     Name?: string
//     Prefix?: string
//     Footprint?: string
//     Quantity?: string | number
//   }[]
// }

// export class CustomNewDescEType extends DefaultDataDtoRes {
//   id: React.Key
//   IOPorts: {
//     key: React.Key
//     index: React.Key
//     PortName?: string
//     IOType?: string
//     PinType?: {
//       IOType?: string
//       IOPin?: string
//     }
//     VoltRangeMax?: any
//     VoltRangeMin?: any
//   }[]
// }
