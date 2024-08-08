/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { plainToInstance } from "class-transformer"
import { AxiosController, IWrapperData } from "apis/api.controller"
import { dummyData } from "dummy"
// import { OrderCompanyDto, OrderDetailDto, OrderDto, OrderShippingDto } from "apis/dto"
import { OrderCompanyDto, OrderHistoryDto, OrderSheetCreateDto, OrderSheetDto, OrderShippingDto } from "apis/dto"
import { apiUtil } from "apis/api.util"

// export class OrderApi {
//   constructor(private controller: AxiosController) {}
//   // Order 조회
//   async getOne() {
//     // const res = await this.controller.put<IWrapperData<OrderDto>>({ url: `api/v1/order/orderers` })
//     // if (apiUtil.isErrorResponse(res)) {
//     //   return res
//     // }

//     return plainToInstance(OrderDto, dummyData.orders).toJson<OrderDto>()
//   }

//   // Order 상세 조회
//   async getList(id: number) {
//     // const res = await this.controller.put<OrderDetailDto[]>({ url: `api/v1/orders/${id}` })
//     // if (apiUtil.isErrorResponse(res)) {
//     //   return res
//     // }

//     return plainToInstance(OrderDetailDto, dummyData.order_detail).toJson<OrderDetailDto>()
//   }

//   // Shipping 상세 조회
//   async getShipping(id: number) {
//     // const res = await this.controller.put<OrderShippingDto>({ url: `api/v1/orders/${id}/shipping` })
//     // if (apiUtil.isErrorResponse(res)) {
//     //   return res
//     // }
//     return plainToInstance(OrderShippingDto, dummyData.order_detail_shipping).toJson<OrderShippingDto>()
//   }
// }

export class OrderApi {
  constructor(private controller: AxiosController) {}

  async createSheet(sheetDto: { projectId: number; orderSheetData: Omit<OrderSheetCreateDto, "toJson"> }) {
    const res = await this.controller.post<IWrapperData<{ seq_no: number }>>({
      url: `/api/v1/order/projects/${sheetDto.projectId}/sheet`,
      body: sheetDto.orderSheetData,
    })

    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return res.data
  }
  async removeSheet(sheetDto: { projectId: number; orderSeq: number }) {
    const res = await this.controller.delete<IWrapperData<{ seq_no: number }>>({
      url: `/api/v1/order/projects/${sheetDto.projectId}/sheet`,
      options: {
        data: { seq_no: sheetDto.orderSeq },
      },
    })

    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return res.data
  }
  async getSheetList(projectId: number) {
    const res = await this.controller.get<IWrapperData<OrderSheetDto[]>>({
      url: `/api/v1/order/projects/${projectId}/sheet/all`,
    })

    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return res.data
  }

  async getCompanyList() {
    const res = await this.controller.get<IWrapperData<{ compaines: OrderCompanyDto[] }>>({
      url: `/api/v1/order/company/all`,
    })

    console.log(11111111, res)

    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    // const res = {
    //   data: {
    //     companies: [
    //       {
    //         seq_no: 1,
    //         company_id: 1,
    //         company_data:
    //           '{     "name": "한샘 디지텍",     "number": "+82 032-581-5375",     "image": "http://ec2-13-125-200-107.ap-northeast-2.compute.amazonaws.com:8000/companies/Hansaemdigi.png",     "webpage": "https://www.hsdgt.com/main/main.html",     "e-mail": "hs@hsdst.com",     "price": {         "two_layer": {             "10":"( \\"X\\" + 20 ) x ( \\"Y\\" + 20 ) x 0.22 x (\\"number\\"-4)  + 85,000 ",             "50": "(( \\"X\\" + 20 ) x ( \\"Y\\" + 20 ) x 0.22 x (\\"number\\"-4)  + 85,000) * 0.9 ",             "100": "(( \\"X\\" + 20 ) x ( \\"Y\\" + 20 ) x 0.22 x (\\"number\\"-4)  + 85,000 ) * 0.8",             "over_500": "(( \\"X\\" + 20 ) x ( \\"Y\\" + 20 ) x 0.22 x (\\"number\\"-4)  + 85,000 ) * 0.7"         },         "four_layer": {             "10":"( \\"X\\" + 20 ) x ( \\"Y\\" + 20 ) x 0.22 x (\\"number\\"-4)  + 85,000 ",             "50": "(( \\"X\\" + 20 ) x ( \\"Y\\" + 20 ) x 0.22 x (\\"number\\"-4)  + 85,000) * 0.9 ",             "100": "(( \\"X\\" + 20 ) x ( \\"Y\\" + 20 ) x 0.22 x (\\"number\\"-4)  + 85,000 ) * 0.8",             "over_500": "(( \\"X\\" + 20 ) x ( \\"Y\\" + 20 ) x 0.22 x (\\"number\\"-4)  + 85,000 ) * 0.7"         }     },     "date": {         "two_layer": {             "10":"1~3",             "50": "1~3",             "100": "5~7",             "over_100": "10~12"         },         "four_layer": {             "10":"1~3",             "50": "1~3",             "100": "5~7",             "over_100": "10~12"         }     } }',
    //       },
    //     ],
    //   },
    // }

    return res.data.compaines.map(company => plainToInstance(OrderCompanyDto, company).toJson<OrderCompanyDto>())
  }

  async getHistoryList(teamID?: number) {
    const res = await this.controller.get<IWrapperData<OrderHistoryDto[]>>({
      url: `/api/v1/ordermanagement/list${teamID ? `?teamID=${teamID}` : ""}`,
    })

    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return res.data.map(data => plainToInstance(OrderHistoryDto, data).toJson<OrderHistoryDto>())
  }

  async getHistoryDetail(orderID: number) {
    const res = await this.controller.get<IWrapperData<OrderHistoryDto>>({
      url: `/api/v1/ordermanagement/detail?orderID=${orderID}`,
    })

    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return plainToInstance(OrderHistoryDto, res.data).toJson<OrderHistoryDto>()
  }
  async getShipping(orderID: number) {
    const res = await this.controller.get<IWrapperData<OrderShippingDto>>({
      url: `/api/v1/ordermanagement/shipping?orderID=${orderID}`,
    })

    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return plainToInstance(OrderShippingDto, res.data).toJson<OrderShippingDto>()
  }
}
