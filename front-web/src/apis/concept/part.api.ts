/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { plainToInstance } from "class-transformer"
import { apiUtil } from "apis/api.util"
import { AxiosController, IWrapperData } from "apis/api.controller"
import { PartDto, PartBlockDto, PartLisSaveDto, PartMouserUrl, PartSearchDto, PartHandleDto } from "apis/dto"

export class PartApi {
  constructor(private controller: AxiosController) {}
  //   POST
  // /api/v1/part/apply
  // Part Apply
  async apply(applyDto: { projectId: number; block_id: string; part_id: string; type: string }) {
    const res = await this.controller.post<IWrapperData<PartDto>>({
      url: `api/v1/part/apply?projectID=${applyDto.projectId}`,
      body: {
        block_id: applyDto.block_id,
        part_id: applyDto.part_id,
        type: applyDto.type,
      },
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return plainToInstance(PartDto, res.data).toJson<PartDto>()
  }

  // DELETE
  // /api/v1/part/block
  // Part block 삭제
  async delete(deleteDto: { projectId: number; blockId: string }) {
    const res = await this.controller.delete<IWrapperData<PartDto>>({
      url: `api/v1/part/block?projectID=${deleteDto.projectId}&blockID=${deleteDto.blockId}`,
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return plainToInstance(PartDto, res.data).toJson<PartDto>()
  }

  // GET
  // /api/v1/part/init
  // Part 초기화면 구성
  async init(projectId: number) {
    const res = await this.controller.get<IWrapperData<PartBlockDto[]>>({
      url: `/api/v1/part/init?projectID=${projectId}`,
    })
    if (apiUtil.isErrorResponse(res) || res.data === null) {
      return []
    }

    return res.data.map(part => plainToInstance(PartBlockDto, part).toJson<PartBlockDto>())
  }

  // POST
  // /api/v1/part/mouserurl
  async getUrl(urlDto: { projectId: number; blockId: string }) {
    const res = await this.controller.post<IWrapperData<PartMouserUrl>>({
      url: `/api/v1/part/mouserurl?projectID=${urlDto.projectId}&blockID=${urlDto.blockId}`,
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }
    return plainToInstance(PartMouserUrl, res.data).toJson<PartMouserUrl>()
  }

  // POST
  // /api/v1/part/next
  async next(nextDto: {
    projectId: number
    blocks: {
      block_id: string
      part_id: string
      type: string
    }[]
  }) {
    const res = await this.controller.post<IWrapperData<PartHandleDto>>({
      url: `/api/v1/part/next?projectID=${nextDto.projectId}`,
      body: nextDto.blocks,
    })

    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return plainToInstance(PartHandleDto, res.data).toJson<PartHandleDto>()
  }

  // PUT
  // /api/v1/part/save
  async save(saveDto: {
    projectId: number
    blocks: {
      block_id: string
      part_id: string
      type: string
    }[]
  }) {
    const res = await this.controller.put<IWrapperData<PartLisSaveDto[]>>({
      url: `/api/v1/part/save?projectID=${saveDto.projectId}`,
      body: saveDto.blocks,
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return res
  }

  // GET
  // /api/v1/part/search
  // Search Part with Keyword
  async search(searchDto: { type: string; keyword: string }) {
    const res = await this.controller.get<IWrapperData<PartSearchDto[]>>({
      url: `/api/v1/part/search?type=${searchDto.type}&keyword=${searchDto.keyword}`,
    })

    if (apiUtil.isErrorResponse(res)) {
      return res
    }
    return res.data.map(part => plainToInstance(PartSearchDto, part).toJson<PartSearchDto>())
  }

  // POST
  // /api/v1/part/update
  // Get Recommended Parts List
  async update(updateDto: { projectId: number; blockId: string }) {
    const res = await this.controller.post<IWrapperData<PartSearchDto[]>>({
      url: `api/v1/part/update?projectID=${updateDto.projectId}&blockID=${updateDto.blockId}`,
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }
    return res.data.map(part => plainToInstance(PartSearchDto, part).toJson<PartSearchDto>())
  }
}
