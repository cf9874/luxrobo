export const StepConditionValues = {
  1: "진행 전",
  2: "진행 중",
  3: "진행 완료",
}

export const PartProgressValues = {
  1: "부품 주문",
  2: "부품 배송 중",
  3: "부품 도착",
}
export const CircuitProgressValues = {
  1: "회로 주문",
  2: "회로 제작",
  3: "SMT 진행",
  4: "회로 도착",
}
export const MovingProgressValues = {
  1: "검사 진행",
  2: "검사 완료",
}
export const ShippingProgressValues = {
  1: "배송 준비",
  2: "배송 중",
  3: "배송 완료",
}

//
export const shippingCondition = {
  0: "결제 진행 중...",
  1: "결제 완료",
  2: "부품 주문 / 부품 주문",
  3: "부품 주문 / 부품 배송",
  4: "부품 주문 / 부품 도착",
  5: "회로 제작 / 회로 주문",
  6: "회로 제작 / 회로 제작",
  7: "회로 제작 / 회로 SMT",
  8: "회로 제작 / 회로 도착",
  9: "동작 검사 / 검사 진행",
  10: "동작 검사 / 검사 완료",
  11: "제품 배송 / 배송 준비",
  12: "제품 배송 / 배송 중",
  13: "제품 배송 / 배송 완료",
}

export const shippingConditionInfoValues = {
  0: {
    partStep: 1,
    partProgress: 1,
    circuitStep: 1,
    circuitProgress: 1,
    motionStep: 1,
    motionProgress: 1,
    shippingStep: 1,
    shippingProgress: 1,
  },
  1: {
    partStep: 1,
    partProgress: 1,
    circuitStep: 1,
    circuitProgress: 1,
    motionStep: 1,
    motionProgress: 1,
    shippingStep: 1,
    shippingProgress: 1,
  },
  // 2: "부품 주문 / 부품 주문",
  2: {
    partStep: 2,
    partProgress: 1,
    circuitStep: 1,
    circuitProgress: 1,
    motionStep: 1,
    motionProgress: 1,
    shippingStep: 1,
    shippingProgress: 1,
  },
  // 3: "부품 주문 / 부품 배송",
  3: {
    partStep: 2,
    partProgress: 2,
    circuitStep: 1,
    circuitProgress: 1,
    motionStep: 1,
    motionProgress: 1,
    shippingStep: 1,
    shippingProgress: 1,
  },
  // 4: "부품 주문 / 부품 도착",
  4: {
    partStep: 3,
    partProgress: 3,
    circuitStep: 1,
    circuitProgress: 1,
    motionStep: 1,
    motionProgress: 1,
    shippingStep: 1,
    shippingProgress: 1,
  },
  // 5: "회로 제작 / 회로 주문",
  5: {
    partStep: 3,
    partProgress: 3,
    circuitStep: 2,
    circuitProgress: 1,
    motionStep: 1,
    motionProgress: 1,
    shippingStep: 1,
    shippingProgress: 1,
  },
  // 6: "회로 제작 / 회로 제작",
  6: {
    partStep: 3,
    partProgress: 3,
    circuitStep: 2,
    circuitProgress: 2,
    motionStep: 1,
    motionProgress: 1,
    shippingStep: 1,
    shippingProgress: 1,
  },
  // 7: "회로 제작 / 회로 SMT",
  7: {
    partStep: 3,
    partProgress: 3,
    circuitStep: 2,
    circuitProgress: 3,
    motionStep: 1,
    motionProgress: 1,
    shippingStep: 1,
    shippingProgress: 1,
  },
  // 8: "회로 제작 / 회로 도착",
  8: {
    partStep: 3,
    partProgress: 3,
    circuitStep: 3,
    circuitProgress: 4,
    motionStep: 1,
    motionProgress: 1,
    shippingStep: 1,
    shippingProgress: 1,
  },
  // 9: "동작 검사 / 검사 진행",
  9: {
    partStep: 3,
    partProgress: 3,
    circuitStep: 3,
    circuitProgress: 4,
    motionStep: 2,
    motionProgress: 1,
    shippingStep: 1,
    shippingProgress: 1,
  },
  // 10: "동작 검사 / 검사 완료",
  10: {
    partStep: 3,
    partProgress: 3,
    circuitStep: 3,
    circuitProgress: 4,
    motionStep: 3,
    motionProgress: 2,
    shippingStep: 1,
    shippingProgress: 1,
  },
  // 11: "제품 배송 / 배송 준비",
  11: {
    partStep: 3,
    partProgress: 3,
    circuitStep: 3,
    circuitProgress: 4,
    motionStep: 3,
    motionProgress: 2,
    shippingStep: 2,
    shippingProgress: 1,
  },
  // 12: "제품 배송 / 배송 중",
  12: {
    partStep: 3,
    partProgress: 3,
    circuitStep: 3,
    circuitProgress: 4,
    motionStep: 3,
    motionProgress: 2,
    shippingStep: 2,
    shippingProgress: 2,
  },
  // 13: "제품 배송 / 배송 완료",
  13: {
    partStep: 3,
    partProgress: 3,
    circuitStep: 3,
    circuitProgress: 4,
    motionStep: 3,
    motionProgress: 2,
    shippingStep: 2,
    shippingProgress: 3,
  },
}
