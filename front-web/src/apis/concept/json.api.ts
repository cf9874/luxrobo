/* eslint-disable @typescript-eslint/require-await */
import { IFeatureBlock } from "type"
import { AxiosController } from "../api.controller"
import { CompanyListDtoRes, FeatureBlockDto, OrderListDtoRes } from "../dto"
import { apiUtil } from "../api.util"
import { plainToInstance } from "class-transformer"
import { dummyData } from "dummy"

export class JsonApi {
  constructor(private controller: AxiosController) {}

  async getFeatureDataList() {
    const res = await this.controller.get<IFeatureBlock[]>({ url: "http://localhost:4000/featureData" })

    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return res?.filter(v => v.type !== "")?.map(v => plainToInstance(FeatureBlockDto, v).toJson<FeatureBlockDto>())
  }

  async getResultData() {
    return {
      model: dummyData.result_3dmodel.model_image,
      pcb: dummyData.result_pcb.board_image,
      bom: dummyData.result_bom.bom_image,
      schema: dummyData.result_schema.schematics_image,
    }
  }

  async getCompanyList() {
    return await this.controller.get<CompanyListDtoRes[]>({ url: "http://localhost:4000/companyList" })
  }

  async getOrderList() {
    return await this.controller.get<OrderListDtoRes[]>({ url: "http://localhost:4000/orderList" })
  }
}
