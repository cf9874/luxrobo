import { BaseDto } from "@/apis/dto"
import { defaultDescriptionInfo } from "@/components/Description"
//------------------------------------------------------------------------------------------------------
export const ShippingDesc = {
  descA: {
    title: "주문정보",
    column: 2,
    keys: [["order_number", "created_at", "user_seq", "project_seq"], ["seq_no"]],
  } as defaultDescriptionInfo,
  descB: {
    title: "Files",
    column: 2,
    keys: ["bom_file", "BOMFile", "gerber_file", "GerberFile"],
  } as defaultDescriptionInfo,
  descC_part: {
    column: 2,
    keys: ["partStep", "partProgress", "part_company"],
  } as defaultDescriptionInfo,
  descC_circuit: {
    column: 2,
    keys: ["circuitStep", "circuitProgress"],
  } as defaultDescriptionInfo,
  descC_motion: {
    column: 2,
    keys: ["motionStep", "motionProgress"],
  } as defaultDescriptionInfo,
  descC_shipping: {
    column: 2,
    keys: ["shippingStep", "shippingProgress", "shipping_company"],
  } as defaultDescriptionInfo,
}

//------------------------------------------------------------------------------------------------------
export const ShippingDescDetail = {
  // A
  order_number: { label: "주문 번호", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  created_at: { label: "주문 일자", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  user_seq: { label: "사용자" },
  project_seq: { label: "프로젝트" },
  seq_no: { spane: 2, labelStyle: { display: "none" }, contentStyle: { width: "100%", padding: "5px 10px" } },
  // B
  bom_file: { label: "BOM", labelStyle: { width: "25%" }, contentStyle: { width: "50%" } },
  BOMFile: { labelStyle: { display: "none" }, contentStyle: { width: "25%", textAlign: "center" } },
  gerber_file: { label: "GerBer" },
  GerberFile: { labelStyle: { display: "none" }, contentStyle: { width: "25%", textAlign: "center" } },
  // C
  partStep: { label: "부품 주문", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  circuitStep: { label: "회로 제작", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  motionStep: { label: "동작 검사", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  shippingStep: { label: "제품 배송", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },

  partProgress: { label: "진행 단계", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  circuitProgress: { label: "진행 단계", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  motionProgress: { label: "진행 단계", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  shippingProgress: { label: "진행 단계", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },

  part_company: { label: "택배사 / 송장번호", span: 2 },
  shipping_company: { label: "택배사 / 송장번호", span: 2 },
}

//------------------------------------------------------------------------------------------------------
// Data Type
export class ShippingConditionInfoType extends BaseDto {
  partStep: number
  partProgress: number
  circuitStep: number
  circuitProgress: number
  motionStep: number
  motionProgress: number
  shippingStep: number
  shippingProgress: number
  part_company: string
  part_number: string
  shipping_company: string
  shipping_number: string
}
