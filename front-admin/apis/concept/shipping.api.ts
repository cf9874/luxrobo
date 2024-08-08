import { DummyData } from "@/dummy"
import { AxiosController } from "../api.controller"

export class ShippingApi {
  constructor(private controller: AxiosController) {}

  getSearch = async (searchDto: { keyword: string; ismatch: number; range: number }) => {
    console.log("ShippingApi: getSearch", searchDto)
    return DummyData.order.shipping
  }

  getOrderInfo = async (shippingID: number) => {
    return DummyData.order.shipping[0]
  }

  removeShippings = async (deleteDto: { shippingIDs: number[] }) => {
    console.log("ShippingApi: removeShippings", deleteDto)
  }
}
