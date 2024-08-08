import { BaseDto } from "@/apis/dto"
import { defaultDescriptionInfo } from "@/components/Description/description.type"

//------------------------------------------------------------------------------------------------------
export const OrderDesc = {
  descA: {
    title: "주문 정보",
    column: 2,
    keys: [["order_number", "created_at", "user_seq", "project_seq"], ["seq_no"]],
  } as defaultDescriptionInfo,
  descB: {
    title: "주문 상세 정보",
    column: 2,
    keys: ["company_id", "amount", "is_smt", "is_motion"],
  } as defaultDescriptionInfo,
  descC: {
    title: "",
    column: 2,
    keys: [
      "board_type",
      "thickness",
      "solder_mask",
      "silkscreen",
      "surface_finish",
      "via_process",
      "finished_copper",
      "min_holl_size",
      "min_track_spacing",
    ],
  } as defaultDescriptionInfo,
  descD: {
    title: "가격",
    column: 2,
    keys: ["part_fee", "order_fee", "delivery_fee", "estimated_fee", "total_fee"],
  } as defaultDescriptionInfo,
  descE: {
    title: "배송지 정보",
    column: 2,
    keys: ["address_name", "addressID", "receiver", "phone_number", "address", "postal_code", "detailAddress"],
  } as defaultDescriptionInfo,
  descF: {
    title: "결제 수단 정보",
    column: 2,
    keys: ["payment_key", "receipt"],
  } as defaultDescriptionInfo,
}
//------------------------------------------------------------------------------------------------------
export const OrderDescDetail = {
  // A
  order_number: { label: "주문 번호", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  created_at: { label: "주문 일자", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  user_seq: { label: "사용자 ID" },
  project_seq: { label: "프로젝트" },
  seq_no: { span: 2, labelStyle: { display: "none" }, contentStyle: { width: "100%", padding: "5px 10px" } },
  // B
  company_id: { label: "발주처", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  amount: { label: "주문 수량", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  is_smt: { label: "SMT 여부" },
  is_motion: { label: "동작 검사 진행 여부" },
  // C
  board_type: { label: "Board Type", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  thickness: { label: "Thickness", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  solder_mask: { label: "Solder Mask" },
  silkscreen: { label: "Silkscreen" },
  surface_finish: { label: "SurfaceFinish" },
  via_process: { label: "Via Process" },
  finished_copper: { label: "Finished copper" },
  min_holl_size: { label: "Min Holl Size" },
  min_track_spacing: { label: "Min Track Spacing", span: 1 },
  // D
  part_fee: { label: "부품 전체 금액", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  order_fee: { label: "발주 금액", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  delivery_fee: { label: "배송 금액" },
  estimated_fee: { label: "예상 수수료" },
  total_fee: { label: "최종 금액" },
  // E
  address_name: { label: "배송지 명", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  addressID: { label: "배송지 삭제", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  receiver: { label: "수령인" },
  phone_number: { label: "전화번호" },
  address: { label: "배송지 주소", span: 2 },
  postal_code: { label: "우편 번호", span: 2 },
  detailAddress: { label: "상세 주소", span: 2 },
  // F
  payment_key: { label: "승인 번호", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  receipt: {
    label: "영수증 발행",
    labelStyle: { width: "25%" },
    contentStyle: { width: "25%", textAlign: "center" },
  },
}
//------------------------------------------------------------------------------------------------------
export class OrderAddressInfo extends BaseDto {
  addressID: number
  address: string
  detailAddress: string
  address_name: string
  is_default: boolean
  phone_number: string
  postal_code: string
  receiver: string
}
