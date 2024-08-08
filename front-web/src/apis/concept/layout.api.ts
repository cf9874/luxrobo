/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { plainToInstance } from "class-transformer"
import { apiUtil } from "apis/api.util"
import { AxiosController, IWrapperData } from "apis/api.controller"
import { LayoutBlockInfo, LayoutBoardDto, LayoutHandleDto, LayoutParams } from "apis/dto"
import { dummyData } from "dummy"

export class LayoutApi {
  constructor(private controller: AxiosController) {}
  // POST
  // /api/v1/layout/autoplace
  // layout autoplace 결과 조회
  async autoplace(autoplaceDto: { projectId: number; board: LayoutBoardDto }) {
    const response = await this.controller.post<IWrapperData<LayoutBoardDto>>({
      url: `/api/v1/layout/autoplace?projectID=${autoplaceDto.projectId}`,
      body: autoplaceDto.board,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(LayoutBoardDto, response.data).toJson<LayoutBoardDto>()
  }

  // GET
  // /api/v1/layout/blockinfo
  // layout 단계 진입 시 blockinfo 정보 조회
  async getBlockInfo(blockInfoDto: { projectId: number; blockId: number }) {
    const response = await this.controller.get<IWrapperData<LayoutBlockInfo>>({
      url: `/api/v1/layout/blockinfo?projectID=${blockInfoDto.projectId}&blockID=${blockInfoDto.blockId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(LayoutBlockInfo, response.data).toJson<LayoutBlockInfo>()
  }

  // GET
  // /api/v1/layout/board
  // layout 단계 진입 시 board 정보 조회
  async getBoard(projectId: number) {
    const response = await this.controller.get<IWrapperData<LayoutBoardDto>>({
      url: `api/v1/layout/board?projectID=${projectId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(LayoutBoardDto, response.data).toJson<LayoutBoardDto>()
  }

  // POST
  // /api/v1/layout/next
  // layout Next
  async next(nextDto: { projectId: number; board: LayoutBoardDto }) {
    const response = await this.controller.post<IWrapperData<LayoutBoardDto>>({
      url: `api/v1/layout/next?projectID=${nextDto.projectId}`,
      body: nextDto.board,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }

  // GET
  // /api/v1/layout/params
  // layout parameter 정보 조회
  async getParams(projectId: number) {
    const response = await this.controller.get<IWrapperData<LayoutParams>>({
      url: `api/v1/layout/params?projectID=${projectId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(LayoutParams, response.data).toJson<LayoutParams>()
  }
  // PUT
  // /api/v1/layout/params
  // layout parameter 정보 변경
  async editParams(editDto: { projectId: number; params: LayoutParams | null }) {
    const response = await this.controller.put<IWrapperData<LayoutHandleDto>>({
      url: `/api/v1/layout/params?projectID=${editDto.projectId}`,
      body: editDto.params,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }
  // PUT
  // /api/v1/layout/save
  // layout Save
  async save(saveDto: { projectId: number; board: LayoutBoardDto }) {
    const response = await this.controller.put<IWrapperData<LayoutHandleDto>>({
      url: `/api/v1/layout/save?projectID=${saveDto.projectId}`,
      body: saveDto.board,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }
}
