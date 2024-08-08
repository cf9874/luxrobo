import { AxiosController, IWrapperData } from "../api.controller"
import { apiUtil } from "../api.util"
import { CustomblockDto, SimpleCustomblockDto } from "../dto/customblock.dto"
import { createFormData, formDataToObject } from "@/utils"

export class CustomblockApi {
  constructor(private controller: AxiosController) {}

  async removeCustomblocks(customblockIDs: number[]) {
    // const response = await this.controller.delete<
    //   IWrapperData<{
    //     customblockIDs: number[]
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/customblocks/remove`,
    //   options: { data: { customblockIDs } },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      customblokIDs: [0],
      message: "success",
    }
  }

  async getCustomblock(customblockID: string) {
    // const response = await this.controller.get<IWrapperData<CustomblockDto>>({
    //   url: `/api/v1/admin/customblocks?customblockID=${customblockID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return {
      color: "color",
      created_at: "created_at",
      customblockID: 0,
      description: "description",
      name: "name",
      naming_param: [
        {
          io_type: "io_type",
          max_vol: 0,
          min_vol: 0,
          pin_name: "pin_name",
          pin_type: "pin_type",
        },
      ],
      owner: "owner",
      partID: "partID",
      pcb_board_file: ".../pcb_board_file.json",
      schema_bom: [
        {
          footprint: "footprint",
          part_name: "part_name",
          part_prefix: "part_prefix",
        },
        {
          footprint: "footprint",
          part_name: "part_name",
          part_prefix: "part_prefix",
        },
        {
          footprint: "footprint1",
          part_name: "part_name1",
          part_prefix: "part_prefix1",
        },
        {
          footprint: "footprint2",
          part_name: "part_name1",
          part_prefix: "part_prefix2",
        },
      ],
      schematics_file: ".../schematics_file.json",
      specification: {
        additionalProp1: "additionalProp1",
        additionalProp2: "additionalProp2",
        additionalProp3: "additionalProp3",
      },
      teamID: 1,
      type: "type",
      updated_at: "updated_at",
      userID: 0,
      workspace: "workspace",
    } as CustomblockDto
  }

  async cloneCustomBlock(customblockID: number, userID: number, teamID: number) {
    // const response = await this.controller.post<
    //   IWrapperData<{
    //     customblockID: number
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/customblocks/clone?userID=${userID}&teamID=${teamID}`,
    //   body: { customblockID },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      customblockID: 0,
      message: "success",
    }
  }

  async editCustomBlock(
    customblockID: number,
    dto: {
      name: string
      description: string
      rawData: string
      schematics_file: File
      pcb_board_file: File
      schema_bom: string
      naiming_param: string
    },
  ) {
    console.log(formDataToObject(createFormData(dto)))
    // const response = await this.controller.put<
    //   IWrapperData<{
    //     customblokIDs: number[]
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/customblocks/edit?customblockID=${customblockID}`,
    //   body: createFormData(dto),
    //   options: {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      customblokIDs: [0],
      message: "success",
    }
  }

  async moveCustomBlock(customblockID: number, userID: number, teamID: number) {
    // const response = await this.controller.put<
    //   IWrapperData<{
    //     customblockID: number
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/customblocks/move?userID=${userID}&teamID=${teamID}`,
    //   body: { customblockID },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      customblockID: 0,
      message: "success",
    }
  }

  async createCustomBlock(dto: {
    name: string
    description: string
    rawData: string
    schematics_file: File
    pcb_board_file: File
    schema_bom: string
    naiming_param: string
  }) {
    // const response = await this.controller.post<
    //   IWrapperData<{
    //     customblockID: number
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/customblocks/new`,
    //   body: createFormData(dto),
    //   options: {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      customblockID: 0,
      message: "success",
    }
  }

  async searchCustomBlocks(keyword: string, conditions: { is_match: boolean; range: number }) {
    //   const response = await this.controller.get<IWrapperData<SimpleCustomblockDto[]>>({
    //     url: `/api/v1/admin/customblocks/search?keyword=${keyword}`,
    //     options: {
    //       params: conditions,
    //     },
    //   })

    //   if (apiUtil.isErrorResponse(response)) {
    //     return response
    //   }

    //   return response.data
    return [
      {
        customblockID: 0,
        name: "name",
        owner: "owner",
        partID: 0,
        updated_at: "updated_at",
        workspace: "workspace",
        uuid: "AnGrqkrb9Qb4NqMLDMLqdw",
      } as SimpleCustomblockDto,
      {
        customblockID: 1,
        name: "name",
        owner: "owner",
        partID: 0,
        updated_at: "updated_at",
        workspace: "workspace",
        uuid: "AnGrqkrb9Qb4NqMLDMLqdw",
      } as SimpleCustomblockDto,
      {
        customblockID: 2,
        name: "name",
        owner: "owner",
        partID: 0,
        updated_at: "updated_at",
        workspace: "workspace",
        uuid: "AnGrqkrb9Qb4NqMLDMLqdw",
      } as SimpleCustomblockDto,
    ] as SimpleCustomblockDto[]
  }
}
