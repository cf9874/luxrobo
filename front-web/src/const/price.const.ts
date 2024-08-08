export const exchangeRate = 1301.3

export const fee = Math.round(5000 / exchangeRate)

export const deliveryPeriodValue = "2~3" // 배송기간

export const estimatedCommissionValue = 5000 // 예상 수수료

export const orderAmountValue = 200000 // 발주 금액

export const deliveryAmountValue = 15000 // 배송 금액

export enum PRICECASE {
  EQUAL = 1,
  CHEAP,
  EXPENSIVE,
  NO_PART,
}
