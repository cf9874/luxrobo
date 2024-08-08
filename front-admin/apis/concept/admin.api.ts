import { DummyData } from "@/dummy"
import { AxiosController, IWrapperData } from "../api.controller"
import { apiUtil } from "../api.util"
import { AccountDetailDto, AccountDto, AuthDto, searchAccountDto } from "../dto/admins.dto"
import { createFormData } from "@/utils"

export class AdminApi {
  constructor(private controller: AxiosController) {}

  async getAuthList() {
    const response = await this.controller.get<IWrapperData<AuthDto[]>>({
      url: `/api/v1/admin/admins/auth/list`,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return response.data

    // return [
    //   {
    //     auth_ID: 0,
    //     auth_admin: true,
    //     auth_company: true,
    //     auth_contact: true,
    //     auth_customblock: true,
    //     auth_name: "master",
    //     auth_order: true,
    //     auth_part: true,
    //     auth_project: true,
    //     auth_team: true,
    //     auth_user: true,
    //   } as AuthDto,
    //   {
    //     auth_ID: 1,
    //     auth_admin: false,
    //     auth_company: true,
    //     auth_contact: true,
    //     auth_customblock: true,
    //     auth_name: "manager",
    //     auth_order: true,
    //     auth_part: true,
    //     auth_project: true,
    //     auth_team: true,
    //     auth_user: true,
    //   } as AuthDto,
    //   {
    //     auth_ID: 2,
    //     auth_admin: false,
    //     auth_company: true,
    //     auth_contact: true,
    //     auth_customblock: true,
    //     auth_name: "manager2",
    //     auth_order: false,
    //     auth_part: false,
    //     auth_project: false,
    //     auth_team: false,
    //     auth_user: true,
    //   } as AuthDto,
    // ] as AuthDto[]
  }

  async createAuth(dto: {
    auth_company: boolean
    auth_contact: boolean
    auth_customblock: boolean
    auth_name: string
    auth_order: boolean
    auth_part: boolean
    auth_project: boolean
    auth_team: boolean
    auth_user: boolean
  }) {
    const response = await this.controller.post<
      IWrapperData<{
        authID: number
        message: string
      }>
    >({
      url: `/api/v1/admin/admins/auth/new`,
      body: dto,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return response.data

    // return {
    //   authID: 0,
    //   message: "success",
    // }
  }

  // async deleteAuth(id: number) {
  async deleteAuth(authIDs: number[]) {
    const response = await this.controller.delete<
      IWrapperData<{
        authIDs: number[]
        message: string
      }>
    >({
      url: `/api/v1/admin/admins/auth/remove`,
      options: {
        data: { authIDs },
      },
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return response.data

    // return {
    //   authID: 0,
    //   message: "success",
    // }
  }

  async setAuthRange(dto: {
    auth_company: boolean
    auth_contact: boolean
    auth_customblock: boolean
    auth_name: string
    auth_order: boolean
    auth_part: boolean
    auth_project: boolean
    auth_team: boolean
    auth_user: boolean
  }) {
    const response = await this.controller.put<
      IWrapperData<{
        authID: number
        message: string
      }>
    >({
      url: `/api/v1/admin/admins/auth/set`,
      body: dto,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return response.data

    // return {
    //   authID: 0,
    //   message: "success",
    // }
  }

  async setAuth(dto: { adminID: number; auth_name: string }) {
    // const response = await this.controller.put<
    //   IWrapperData<{
    //     authID: number
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/admins/authchange?adminID=${dto.adminID}&auth_name=${dto.auth_name}`,
    // })
    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }
    // return response.data

    console.log(dto.adminID, dto.auth_name)
    return {
      adminID: 0,
      message: "success",
    }
  }

  async getAccountList() {
    // const response = await this.controller.get<IWrapperData<AccountDto[]>>({
    //   url: `/api/v1/admin/admins/list`,
    // })
    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }
    // return response.data

    return [
      {
        adminID: 0,
        accountID: "master",
        user_name: "master",
        authID: 0,
        auth_name: "master",
      } as AccountDto,
      {
        adminID: 1,
        accountID: "accountID",
        user_name: "user_name",
        authID: 1,
        auth_name: "manager",
      } as AccountDto,
    ] as AccountDto[]
  }

  async createAccount(dto: { accountID: string; password: string; user_name: string }) {
    // const response = await this.controller.post<
    //   IWrapperData<{
    //     adminID: number
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/admins/new`,
    //   body: dto,
    // })
    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }
    // return response.data

    return {
      adminID: 0,
      message: "success",
    }
  }

  async getDetailAccount(id?: number) {
    // const response = await this.controller.get<IWrapperData<AccountDetailDto>>({
    //   url: `/api/v1/admin/admins/profile${id ? `?adminID=${id}` : ""}`,
    // })
    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }
    // return response.data

    return {
      accountID: "string",
      adminID: 0,
      auth_ID: 0,
      auth_admin: true,
      auth_company: true,
      auth_contact: true,
      auth_customblock: true,
      auth_name: "string",
      auth_order: true,
      auth_part: true,
      auth_project: true,
      auth_team: true,
      auth_user: true,
      user_name: "string",
    } as AccountDetailDto
  }

  async deleteAccount(adminIDs: number[]) {
    // const response = await this.controller.get<
    //   IWrapperData<{
    //     adminID: number
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/admins/remove`,
    //   options: {
    //     data: { adminIDs },
    //   },
    // })
    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }
    // return response.data

    return {
      adminID: 0,
      message: "success",
    }
  }

  async createFAQ(dto: { title: string; writer: string; content: string; upload_image: File }) {
    const response = await this.controller.post<
      IWrapperData<{
        faqID: number
        message: string
      }>
    >({
      url: `/api/v1/admin/faqs/new`,
      body: createFormData(dto),
      options: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data
  }

  async createNotice(dto: { title: string; writer: string; content: string; upload_image: File }) {
    const response = await this.controller.post<
      IWrapperData<{
        message: string
        noticeID: number
      }>
    >({
      url: `/api/v1/admin/notices/new`,
      body: createFormData(dto),
      options: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data
  }

  async searchWorkspaces(keyword: string, conditions: { is_match: boolean; range: number }) {
    // const response = await this.controller.get<IWrapperData<searchAccountDto[]>>({
    //   url: `/api/v1/admin/workspace/search?keyword=${keyword}`,
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
        accountID: "accountID",
        email: "email",
        name: "name",
        phone_number: "phone_number",
        teamID: 0,
        userID: 1,
      } as searchAccountDto,
      {
        accountID: "accountID",
        email: "email",
        name: "name",
        phone_number: "phone_number",
        teamID: 0,
        userID: 2,
      } as searchAccountDto,
      {
        accountID: "accountID",
        email: "email",
        name: "name",
        phone_number: "phone_number",
        teamID: 0,
        userID: 3,
      } as searchAccountDto,
      {
        accountID: "accountID",
        email: "email",
        name: "name",
        phone_number: "phone_number",
        teamID: 1,
        userID: 0,
      } as searchAccountDto,
      {
        accountID: "accountID",
        email: "email",
        name: "name",
        phone_number: "phone_number",
        teamID: 2,
        userID: 0,
      } as searchAccountDto,
      {
        accountID: "accountID",
        email: "email",
        name: "name",
        phone_number: "phone_number",
        teamID: 3,
        userID: 0,
      } as searchAccountDto,
    ] as searchAccountDto[]
  }
}
