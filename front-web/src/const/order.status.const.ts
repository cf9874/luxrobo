export enum ORDER_STATUS {
  PREPATE_PART = "부품 준비",
  MAKE_CIRCUIT = "회로 제작",
  INSPECT_PRODUCT = "작동 검수",
  DELIVER_PRODUCT = "제품 배송",
}

export enum DETAIL_ORDERSTATUS {
  ORDER_PART = 1,
  DELIEVER_PART,
  ARRIVE_PART,
  //
  ORDER_CIRCUIT,
  MAKE_CIRCUIT,
  SMT,
  ARRIVE_CIRCUIT,
  //
  INSPECT_PRODUCT,
  COMPLETE_INSPECTING,
  //
  PREPARE_DELIVERY,
  DELIVERING,
  COMPLETE_DELEVERY,
}

export enum DETAIL_ORDERSTATUS_TITLE {
  ORDER_PART = "부품 주문",
  DELIEVER_PART = "부품 배송 중",
  ARRIVE_PART = "부품 도착",
  //
  ORDER_CIRCUIT = "회로 주문",
  MAKE_CIRCUIT = "회로 제작",
  SMT = "SMT 진행",
  ARRIVE_CIRCUIT = "회로 도착",
  //
  INSPECT_PRODUCT = "동작 검사",
  COMPLETE_INSPECTING = "검사 완료",
  //
  PREPARE_DELIVERY = "배송 준비",
  DELIVERING = "배송 중",
  COMPLETE_DELEVERY = "배송 완료",
}
