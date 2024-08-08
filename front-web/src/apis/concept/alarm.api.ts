/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { AxiosController, IWrapperData } from "apis/api.controller"
import { apiUtil } from "apis/api.util"
import { AlarmDto, AlarmHandleDto } from "apis/dto"
import { plainToInstance } from "class-transformer"
import { dummyData } from "dummy"

export class AlarmApi {
  constructor(private controller: AxiosController) {}

  //Home 화면 진입 시 해당 유저에게 제공될 알림 단일 조회
  async getOne(id: number) {
    const response = await this.controller.get<IWrapperData<AlarmDto>>({ url: `api/v1/alarms?AlarmID=${id}` })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(AlarmDto, dummyData.alarms).toJson<AlarmDto>()
  }

  //유저가 알람 확인 시 호출
  async onAlarm(id: number) {
    const response = await this.controller.put<IWrapperData<AlarmHandleDto>>({
      url: `api/v1/alarms/check?AlarmID=${id}`,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }
  //Home 화면 진입 시 해당 유저에게 제공될 알림 목록 조회
  async getList() {
    const response = await this.controller.get<IWrapperData<AlarmDto[]>>({ url: `api/v1/alarms/list` })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data.map(alarm => plainToInstance(AlarmDto, alarm).toJson<AlarmDto>())
  }
  //Home 화면 진입 시 해당 유저에게 제공될 알림 생성
  async create(createDto: { code: number; orderID: number; projectID: number }) {
    const response = await this.controller.post<IWrapperData<AlarmDto>>({ url: `api/v1/alarms/new`, body: createDto })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }
}
