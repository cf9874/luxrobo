import { IWrapperData } from "apis/api.controller"
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { plainToInstance } from "class-transformer"
import { apiUtil } from "apis/api.util"
import { AxiosController } from "apis/api.controller"
import { FaqDto, FaqHandleDto } from "apis/dto"
import { dummyData } from "dummy"

export class FaqApi {
  constructor(private controller: AxiosController) {}
  // GET
  // /api/v1/faqs
  // FAQ 정보 조회
  async getOne(faqId: number) {
    const res = await this.controller.get<IWrapperData<FaqDto>>({
      url: `api/v1/faqs?faqID=${faqId}`,
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }
    return plainToInstance(FaqDto, res.data).toJson<FaqDto>()
  }

  // GET
  // /api/v1/faqs/list
  // FAQ List 조회
  async getList() {
    const res = await this.controller.get<IWrapperData<FaqDto[]>>({
      url: `api/v1/faqs/list`,
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }
    return res.data.map(faq => plainToInstance(FaqDto, faq).toJson<FaqDto>())
  }

  // POST
  // /api/v1/faqs/view
  // FAQ 조회 수 증가
  async onView(faqId: number) {
    const res = await this.controller.post<IWrapperData<FaqHandleDto>>({
      url: `api/v1/faqs/view?faqID=${faqId}`,
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return res.data.message === "success"
  }
}
