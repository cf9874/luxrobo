/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { plainToInstance } from "class-transformer"
// import { apiUtil } from "./api.util"
import { AxiosController, IWrapperData } from "apis/api.controller"
import { apiUtil } from "apis/api.util"
import { NoticeDto } from "apis/dto"
import { dummyData } from "dummy"

export class NoticeApi {
  constructor(private controller: AxiosController) {}

  // Notice 정보 단일 조회
  async getOne(noticeId: number) {
    const res = await this.controller.get<IWrapperData<NoticeDto>>({ url: `api/v1/notices?noticeID=${noticeId}` })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return plainToInstance(NoticeDto, dummyData.notices).toJson<NoticeDto>()
  }

  // Notice List 조회
  async getList() {
    const res = await this.controller.get<IWrapperData<NoticeDto[]>>({ url: `api/v1/notices/list` })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return res.data.map(notice => plainToInstance(NoticeDto, notice).toJson<NoticeDto>())
  }

  // Notice 조회 수 증가
  async onView(noticeId: number) {
    // const res = await this.controller.post<IWrapperData<NoticeDto[]>>({
    //   url: `api/v1/notices/view?noticeID=${noticeId}`,
    // })
    // if (apiUtil.isErrorResponse(res)) {
    //   return res
    // }
    return dummyData.notices_view.message === "success"
  }
}
