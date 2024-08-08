/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
// import { plainToInstance } from "class-transformer"
// import { apiUtil } from "./api.util"
import { AxiosController, IWrapperData } from "apis/api.controller"
import { apiUtil } from "apis/api.util"
import { BillCancelDto, BillEndDto, BillingDto } from "apis/dto"
import { plainToInstance } from "class-transformer"
import { dummyData } from "dummy"

export class PaymentApi {
  constructor(private controller: AxiosController) {}

  async begin(beginDto: { projectId: number; sheetSeq: number }) {
    const res = await this.controller.post<IWrapperData<BillingDto>>({
      url: `/api/v1/order/projects/${beginDto.projectId}/payment/begin`,
      body: { sheet_seq: beginDto.sheetSeq },
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return plainToInstance(BillingDto, res.data).toJson<BillingDto>()
  }

  async cancel(cancelDto: { projectId: number; beginSeq: number }) {
    const res = await this.controller.post<IWrapperData<BillCancelDto>>({
      url: `/api/v1/order/projects/${cancelDto.projectId}/payment/cancel`,
      body: { seq_no: cancelDto.beginSeq },
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return plainToInstance(BillCancelDto, res.data).toJson<BillCancelDto>()
  }

  async end(endDto: { projectId: number; paymentKey: string; sayAmount: number; beginSeq: number }) {
    const res = await this.controller.post<IWrapperData<BillEndDto>>({
      url: `/api/v1/order/projects/${endDto.projectId}/payment/end`,
      body: { seq_no: endDto.beginSeq, payment_key: endDto.paymentKey, say_amount: endDto.sayAmount },
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return plainToInstance(BillEndDto, res.data).toJson<BillEndDto>()
  }
}
