import { BaseDto } from "./base.dto"

export class ShippingDto extends BaseDto {
  id: number
  orderNumber: string
  purchaseDate: string
  projectId: number
  userId: number
  purchaseId: number
}

export class shippingConditionDto extends BaseDto {
  tool: {
    proceeding: boolean
    step: string
    progress: string
    parcel: string
    parcelNum: string
  }
  circuit: {
    proceeding: boolean
    step: string
    progress: string
  }
  movement: {
    proceeding: boolean
    step: string
    progress: string
  }
  ship: {
    proceeding: boolean
    step: string
    progress: string
    parcel: string
    parcelNum: string
  }
}
