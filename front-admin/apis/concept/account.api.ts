import { DummyData } from "@/dummy"
import { AxiosController, IWrapperData } from "../api.controller"
import { apiUtil } from "../api.util"
import { createFormData } from "@/utils"

export class AccountApi {
  constructor(private controller: AxiosController) {}

  // getAdminsList = async () => {
  //   return DummyData.admin.account
  // }

  // postAdmins = async () => {}

  // putAdmins = async () => {}

  // deleteAdmins = async id => {}

  async createMaster(dto: { accountID: string }) {
    const response = await this.controller.post<IWrapperData<{ adminID: number; message: string }>>({
      url: "/api/v1/admin/accounts/master/new",
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

  async signIn(dto: { AccountID: string; password: string }) {
    const response = await this.controller.post<
      IWrapperData<{ access_token: string; last_login_at: number; refresh_token: string }>
    >({
      url: "/api/v1/admin/accounts/signin",
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
}
