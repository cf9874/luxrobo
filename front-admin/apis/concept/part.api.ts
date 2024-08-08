import { AxiosController, IWrapperData } from "../api.controller"
import { apiUtil } from "../api.util"
import { PartDto, SimplePartDto } from "../dto/part.dto"
import { createFormData } from "@/utils"

export class PartApi {
  constructor(private controller: AxiosController) {}

  // getSearch = async (searchDto: { keyword: string; ismatch: number; range: number }) => {
  //   console.log("PartApi: getSearch", searchDto)
  //   return DummyData.part.part
  // }

  // getPartInfo = async (partID: number) => {
  //   return DummyData.part.part_info
  // }

  // removeParts = async (deleteDto: { partIDs: number[] }) => {
  //   console.log("PartApi: removeOrders", deleteDto)
  // }

  async getPartInfo(partID: number) {
    // const response = await this.controller.get<IWrapperData<PartDto>>({
    //   url: `/api/v1/admin/parts?partID=${partID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      category: "category",
      created_at: "created_at",
      datasheet_url: "datasheet_url",
      description: "description1",
      footprint: "footprint",
      manufacturer: "manufacturer",
      mouser_url: "mouser_url",
      options: {
        additionalProp1: "additionalProp1",
        additionalProp2: "additionalProp2",
        additionalProp3: "additionalProp3",
      },
      part_id: 0,
      part_image: "https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg",
      part_name: "part_name",
      pcb_board_file: ".../pcb_board_file.json",
      price: 0,
      quantity_prices: '{"1":"$4.80","10":"$3.08","100":"$2.95"}',
      schematic: "schematic",
      schematics_file: ".../schematics_file.json",
      stock: 0,
      type: "type",
      updated_at: "updated_at",
      version: "version",
    } as PartDto
  }

  async editPartInfo(
    partID: number,
    partEditRequest: {
      name: string
      part_image?: File
      rawData: string
      schematics_file?: File
      pcb_board_file?: File
      schema_bom: string
      naiming_param: string
    },
  ) {
    // const response = await this.controller.put<
    //   IWrapperData<
    //     {
    //       message: string
    //       partID: number
    //     }[]
    //   >
    // >({
    //   url: `/api/v1/admin/parts/edit?partID=${partID}`,
    //   body: createFormData(partEditRequest),
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
      message: "success",
      partID: 0,
    }
  }

  async createNewPart(partNewRequest: {
    name: string
    part_image: File
    rawData: string
    schematics_file: File
    pcb_board_file: File
    schema_bom: string
    naiming_param: string
  }) {
    // const response = await this.controller.post<
    //   IWrapperData<{
    //     message: string
    //     partID: number
    //   }>
    // >({
    //   url: `/api/v1/admin/parts/new`,
    //   body: createFormData(partNewRequest),
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
      message: "success",
      partID: 0,
    }
  }

  async removeParts(partIDs: number[]) {
    // const response = await this.controller.delete<
    //   IWrapperData<{
    //     message: string
    //     partIDs: number[]
    //   }>
    // >({
    //   url: `/api/v1/admin/parts/remove`,
    //   options: {
    //     data: { partIDs },
    //   },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      message: "success",
      partIDs: [0],
    }
  }

  async searchParts(keyword: string, conditions: { is_match: boolean; range: number }) {
    //   const response = await this.controller.get<IWrapperData<SimplePartDto[]>>({
    //     url: `/api/v1/admin/parts/search?keyword=${keyword}`,
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
        category: "category",
        is_schematic: true,
        part_id: 0,
        part_name: "part_name",
        price: 0,
        stock: 0,
        type: "type",
        uuid: "uuid",
      } as SimplePartDto,
      {
        category: "category",
        is_schematic: true,
        part_id: 1,
        part_name: "part_name",
        price: 0,
        stock: 0,
        type: "type",
        uuid: "uuid",
      } as SimplePartDto,
      {
        category: "category",
        is_schematic: true,
        part_id: 2,
        part_name: "part_name",
        price: 0,
        stock: 0,
        type: "type",
        uuid: "uuid",
      } as SimplePartDto,
    ] as SimplePartDto[]
  }
}
