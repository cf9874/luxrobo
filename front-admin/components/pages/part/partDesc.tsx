import { BaseDto } from "@/apis/dto"
import { defaultDescriptionInfo } from "@/components/Description/description.type"

//------------------------------------------------------------------------------------------------------
// 각 description 정보
export const PartDesc = {
  descA: {
    column: 2,
    keys: ["part_name", "stock", "description", "quantity_prices", "datasheet_url", "part_image"],
  } as defaultDescriptionInfo,
  descB: {
    title: "",
    column: 1,
    keys: ["category", "optionsRawData", "apiRawData"],
  } as defaultDescriptionInfo,
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

//------------------------------------------------------------------------------------------------------
export const PartDescDetail = {
  // A
  part_name: { label: "부품명", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  stock: { label: "부품 재고", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  description: { label: "부품 설명" },
  quantity_prices: { label: "수량 별 단가" },
  datasheet_url: { label: "데이터 시트 URL" },
  part_image: { label: "부품 썸네일 이미지" },
  // B
  category: { label: "Feature 분류", labelStyle: { width: "25%" }, contentStyle: { width: "75%" } },
  optionsRawData: { label: "부품 정보" },
  apiRawData: { label: "API Raw Data" },
  // C
  schematics_file: { label: "Schematics File", labelStyle: { width: "25%" }, contentStyle: { width: "50%" } },
  schematicsFileBtn: { labelStyle: { display: "none" }, contentStyle: { width: "25%", textAlign: "center" } },
  pcb_board_file: { label: "PCB Board File" },
  PCBBoardFileBtn: { labelStyle: { display: "none" }, contentStyle: { width: "25%", textAlign: "center" } },
}

export const PartDescTableDetail = {
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
export class PartDescBType extends BaseDto {
  category: string
  type: string
  optionsRawData: string
  apiRawData: string
}

export class PartDescDType extends BaseDto {
  index?: number
  quantity?: number
  //
  footprint: string
  part_name: string
  part_prefix: string
}

export class PartDescEType extends BaseDto {
  index: number
  //
  io_type: string
  max_vol: number
  min_vol: number
  pin_name: string
  pin_type: string
}
