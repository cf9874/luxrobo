import { AxiosController, IWrapperData } from "../api.controller"
import { apiUtil } from "../api.util"
import { CompanyJson, OrderDto, ShippingInfoDto, SimpleOrderInfoDto, SimpleShippingInfoDto } from "../dto/order.dto"
import { createFormData } from "@/utils"

export class OrderApi {
  constructor(private controller: AxiosController) {}

  async getOrderInfo(orderID: string) {
    // const response = await this.controller.get<IWrapperData<OrderDto>>({
    //   url: `/api/v1/admin/orders?orderID=${orderID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return {
      address_seq: 0,
      amount: 0,
      company_id: "1",
      is_motion: true,
      is_smt: true,
      receipt:
        "https://dashboard.tosspayments.com/receipt/sales-slip?transactionId=KAgfjGxIqVVXDxOiSW1wUnRWBS1dszn3DKcuhpm7mQlKP0iOdgPCKmwEdYglIHX&ref=PX",
      options: {
        board_type: "string",
        finished_copper: "string",
        min_holl_size: "string",
        min_track_spacing: "string",
        silkscreen: "string",
        solder_mask: "string",
        surface_finish: "string",
        thickness: "string",
        via_process: "string",
      },
      order_number: "order_number",
      order_step: 0,
      prices: {
        delivery_fee: 0,
        estimated_fee: 0,
        order_fee: 0,
        part_fee: 0,
        total_fee: 0,
      },
      project_name: "project_name",
      project_seq: 0,
      seq_no: 0,
      shipping_id: 0,
      team_seq: 0,
      user_name: "user_name",
      user_seq: 0,
      payment_key: 1234567891234,
      created_at: "created_at",
      // company_name: "company_name",
      address_info: {
        addressID: 0,
        address_json_string: "detailAddress(address)",
        address_name: "address_name",
        is_default: true,
        phone_number: "phone_number",
        postal_code: "postal_code",
        receiver: "receiver",
      },
      company_data: {
        name: "name",
        number: "number",
        image: "image",
        webpage: "webpage",
        "e-mail": "e-mail",
        price: {
          ["four_layer"]: {},
        },
        date: {
          ["four_layer"]: {},
        },
      } as CompanyJson,
    } as OrderDto
  }

  async editOrderInfo(
    orderID: string,
    orderInfo: {
      address_json_string: string
      address_name: string
      amount: number
      board_type: string
      finished_copper: string
      is_motion: boolean
      is_smt: boolean
      min_holl_size: string
      min_track_spacing: string
      phone_number: string
      // postal_code: number
      postal_code: string
      receiver: string
      silkscreen: string
      solder_mask: string
      surface_finish: string
      thickness: string
      via_process: string
    },
  ) {
    // const response = await this.controller.put<
    //   IWrapperData<{
    //     message: string
    //     orderID: number
    //   }>
    // >({
    //   url: `/api/v1/admin/orders/edit?orderID=${orderID}`,
    //   body: orderInfo,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return {
      message: "success",
      orderID: 0,
    }
  }

  async searchOrders(keyword: string, conditions: { is_match: boolean; range: number }) {
    // const response = await this.controller.get<IWrapperData<SimpleOrderInfoDto[]>>({
    //   url: `/api/v1/admin/orders/search?keyword=${keyword}`,
    //   options: {
    //     params: conditions,
    //   },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return [
      {
        created_at: "created_at",
        order_number: "order_number",
        project_name: "project_name",
        project_seq: 0,
        seq_no: 0,
        team_seq: 0,
        total_fee: 0,
        user_name: "user_name",
        user_seq: 0,
        payment_key: 1234567891234,
      } as SimpleOrderInfoDto,
      {
        created_at: "created_at",
        order_number: "order_number",
        project_name: "project_name",
        project_seq: 0,
        seq_no: 1,
        team_seq: 0,
        total_fee: 0,
        user_name: "user_name",
        user_seq: 0,
        payment_key: 1234567891234,
      } as SimpleOrderInfoDto,
    ] as SimpleOrderInfoDto[]
  }

  async getShippingInfo(orderID: string) {
    // const response = await this.controller.get<IWrapperData<ShippingInfoDto>>({
    //   url: `/api/v1/admin/orders/shipping?orderID=${orderID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return {
      bom_file: ".../bom_file.scv",
      gerber_file: ".../gerver_file.zip",
      order_number: "order_number",
      order_step: 0,
      project_name: "project_name",
      project_seq: 0,
      seq_no: 0,
      shipiing_company: "shipiing_company",
      shipping_id: 0,
      shipping_number: "shipping_number",
      team_seq: 0,
      user_name: "user_name",
      user_seq: 0,
      created_at: "created_at",
      part_company: "part_company",
      part_number: "part_number",
    } as ShippingInfoDto
  }

  async editShippingInfo(
    orderID: number,
    dto: {
      bom_file: File
      gerber_file: File
      order_step: number
      part_company: string
      part_number: string
      shipping_number: string
      shipping_company: string
    },
  ) {
    // const response = await this.controller.put<
    //   IWrapperData<{
    //     message: string
    //     shippingID: number
    //   }>
    // >({
    //   url: `/api/v1/admin/orders/shipping/edit?orderID=${orderID}`,
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
      message: "success",
      shippingID: 0,
    }
  }

  async searchShippingList(keyword: string, conditions: { is_match: boolean; range: number }) {
    // const response = await this.controller.get<IWrapperData<SimpleShippingInfoDto[]>>({
    //   url: `/api/v1/admin/orders/shipping/search?keyword=${keyword}`,
    //   options: {
    //     params: conditions,
    //   },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return [
      {
        created_at: "created_at",
        order_number: "order_number",
        order_step: 1,
        project_name: "project_name",
        project_seq: 0,
        seq_no: 0,
        team_seq: 0,
        user_name: "user_name",
        user_seq: 0,
      } as SimpleShippingInfoDto,
      {
        created_at: "created_at",
        order_number: "order_number",
        order_step: 2,
        project_name: "project_name",
        project_seq: 0,
        seq_no: 1,
        team_seq: 1,
        user_name: "user_name",
        user_seq: 0,
      } as SimpleShippingInfoDto,
      {
        created_at: "created_at",
        order_number: "order_number",
        order_step: 3,
        project_name: "project_name",
        project_seq: 0,
        seq_no: 2,
        team_seq: 0,
        user_name: "user_name",
        user_seq: 0,
      } as SimpleShippingInfoDto,
    ] as SimpleShippingInfoDto[]
  }
}
