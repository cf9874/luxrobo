/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
// import { plainToInstance } from "class-transformer"
// import { apiUtil } from "./api.util"
import { CATEGORY_COLOR } from "@const/block.const"
import { AxiosController, IWrapperData } from "apis/api.controller"
import { apiUtil } from "apis/api.util"
import { CustomblockDto, CustomblockHandleDto, CustomblockSchDto } from "apis/dto"
import { plainToInstance } from "class-transformer"
import { dummyData } from "dummy"

export class BlockApi {
  constructor(private controller: AxiosController) {}

  async custom(id: number) {
    const response = await this.controller.get<IWrapperData<CustomblockDto>>({
      url: `api/v1/customs?customblockID=${id}`,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(CustomblockDto, response.data).toJson<CustomblockDto>()
  }

  async getBlocksch(customblockID: number) {
    const response = await this.controller.get<IWrapperData<CustomblockSchDto>>({
      url: `api/v1/customs/blocksch?customblockID=${customblockID}`,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(CustomblockSchDto, response.data).toJson<CustomblockSchDto>()
  }
  async editBlocksch({ customblockID, schema }: { customblockID: number; schema: string }) {
    const response = await this.controller.get<IWrapperData<CustomblockSchDto>>({
      url: `api/v1/customs/blocksch/update?customblockID=${customblockID}`,
      body: { schema },
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(CustomblockSchDto, response.data).toJson<CustomblockSchDto>()
  }
  async clone(cloneDto: { customblockID: number; clone_name: string; clone_description: string }) {
    // const response = await this.controller.post<IWrapperData<CustomblockHandleDto>>({
    //   url: `api/v1/customs/clone?customblockID=${cloneDto.customblockID}`,
    //   body: {
    //     clone_name: cloneDto.clone_name,
    //     clone_description: cloneDto.clone_description,
    //   },
    // })
    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    return dummyData.customs_clone.message === "success"
  }
  async edit(editDto: {
    customblockID: number
    blocks: {
      part_id: string
      type: string
      color: string
      description: string
      name: string
      specification: {
        [key: string]: string
      }
    }
  }) {
    const response = await this.controller.put<IWrapperData<CustomblockHandleDto>>({
      url: `api/v1/customs/edit?customblockID=${editDto.customblockID}`,
      body: editDto.blocks,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(CustomblockHandleDto, response.data).toJson<CustomblockHandleDto>()
  }

  async getList(id?: number) {
    const response = await this.controller.get<IWrapperData<CustomblockDto[]>>({
      url: `api/v1/customs/list${id === undefined ? "" : `?teamID=${id}`}`,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data.map(block => plainToInstance(CustomblockDto, block).toJson<CustomblockDto>())
  }
  async create(createDto: {
    teamId?: number
    blocks: {
      color: CATEGORY_COLOR | string
      description: string
      name: string
      specification: {
        [key: string]: string
      }
      type: string
    }
  }) {
    const response = await this.controller.post<IWrapperData<CustomblockHandleDto>>({
      url: `api/v1/customs/new${createDto.teamId ? "?teamID=" + createDto.teamId : ``}`,
      body: createDto.blocks,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(CustomblockHandleDto, response.data).toJson<CustomblockHandleDto>()
  }

  async remove(removeDto: {
    customblockID: number
    blocks: {
      delete_name: string
    }
  }) {
    const response = await this.controller.delete<IWrapperData<CustomblockHandleDto>>({
      url: `api/v1/customs/remove?customblockID=${removeDto.customblockID}`,
      options: {
        data: removeDto.blocks,
      },
    })
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }

    return plainToInstance(CustomblockHandleDto, response.data).toJson<CustomblockHandleDto>()
  }
  async share(shareDto: {
    customblockID: number
    blocks: {
      accountID: string
    }
  }) {
    // const response = await this.controller.post<IWrapperData<CustomblockHandleDto>>({
    //   url: `api/v1/customs/share?customblockID=${shareDto.customblockID}`,
    //   body: shareDto.blocks,
    // })
    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    return dummyData.customs_share.message === "success"
  }
}
