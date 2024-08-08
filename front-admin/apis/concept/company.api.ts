import { AxiosController, IWrapperData } from "../api.controller"
import { apiUtil } from "../api.util"
import { CompanyDto, SearchCompanyDto } from "../dto"
import { createFormData } from "@/utils"

export class CompanyApi {
  constructor(private controller: AxiosController) {}

  async getDetail(companyID: number) {
    // const response = await this.controller.get<IWrapperData<CompanyDto>>({
    //   url: `/api/v1/admin/company?companyID=${companyID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return {
      companyID: 0,
      date: {
        ["four_layer"]: {},
      },
      "e-mail": "e-mail",
      image: "https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg",
      name: "name",
      number: "number",
      price: {
        ["four_layer"]: {},
      },
      webpage: "webpage",
    } as CompanyDto
  }

  async createCompany(dto: { company_image: File; raw_data: string }) {
    // const response = await this.controller.post<
    //   IWrapperData<{
    //     companyID: number
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/company/new`,
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
      companyID: 0,
      message: "success",
    }
  }

  async editCompany(
    companyID: number,
    dto: {
      name: string
      number: string
      company_image: File
      webpage: string
      ["e-mail"]: string
      price: string
      date: string
    },
  ) {
    // const response = await this.controller.put<
    //   IWrapperData<{
    //     companyID: number
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/company/edit?companyID=${companyID}`,
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
      companyID: 0,
      message: "success",
    }
  }

  async removeCompany(companyIDs: number[]) {
    // const response = await this.controller.get<
    //   IWrapperData<{
    //     companyIDs: number[]
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/company/remove`,
    //   options: {
    //     data: { companyIDs },
    //   },
    // })
    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }
    // return response.data

    return {
      companyIDs: [0],
      message: "success",
    }
  }
  async searchCompanies(keyword: string, conditions: { is_match: boolean; range: number }) {
    // const response = await this.controller.get<IWrapperData<SearchCompanyDto[]>>({
    //   url: `/api/v1/admin/company/search?keyword=${keyword}`,
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
        companyID: 0,
        "e-mail": "email",
        name: "name",
        number: "number",
        webpage: "webpage",
      },
      {
        companyID: 1,
        email: "email",
        name: "name",
        number: "number",
        webpage: "webpage",
      },
    ] as SearchCompanyDto[]
  }
}
