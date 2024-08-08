import { BaseDto } from "@/apis/dto"
import { NamingParam, SchemaBom } from "@/apis/dto/customblock.dto"
import { defaultDescriptionInfo } from "@/components/Description/description.type"

//------------------------------------------------------------------------------------------------------
// 각 description 정보
//(title(생략 가능), column(생략가능, default = 3), keys, attribute(description))
export const CustomDesc = {
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

export const CustomDescDetail = {
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
// Data Type
export class CustomblockRawData {
  color: string
  type: string
  specification: {
    [key: string]: string
  }
}

export class CustomDescBType extends BaseDto {
  rawData: string
}

export class CustomDescDType extends SchemaBom {
  index?: number
  quantity?: number
}

export class CustomDescEType extends NamingParam {
  index: number
}

//------------------------------------------------------------------------------------------------------
