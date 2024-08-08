/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { AddressDto, AddressHandleDto } from "apis/dto/common.dto"
import { AxiosController, IWrapperData } from "../api.controller"
// import { plainToInstance } from "class-transformer"
import { apiUtil } from "../api.util"
import { BillingHandleDto, BillingInfo, ProfileDto, SignInDto, TeamDto, UserDto, UserHandleDto } from "apis/dto"
import { plainToInstance } from "class-transformer"
import { dummyData } from "dummy"

export class UserApi {
  constructor(private controller: AxiosController) {}

  async signIn(body: { accountid: string; password: string }) {
    const response = await this.controller.post<IWrapperData<SignInDto>>({ url: "api/v1/auth/sign-in", body })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data
  }

  // async signUp(body: {
  //   accountid: string
  //   countrycode: string
  //   email: string
  //   name: string
  //   optin: boolean
  //   password: string
  //   phonenumber: string
  // }) {
  async signUp(body: FormData) {
    const response = await this.controller.post<IWrapperData<{ message: string }>>({
      url: "api/v1/auth/sign-up",
      body,
      options: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }

  signOut() {
    apiUtil.removeUserData(null)
  }

  async sendMail(user: { accountid: string; email: string }) {
    const response = await this.controller.post<IWrapperData<{ message: string }>>({
      url: `api/v1/auth/send/sign-up-email`,
      body: user,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return response
  }
  async getMyInfo() {
    const response = await this.controller.get<IWrapperData<UserDto>>({
      url: `api/v1/users/profile`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return plainToInstance(UserDto, dummyData.users_profile).toJson<UserDto>()
  }

  async getUserInfo(accountId: number) {
    const response = await this.controller.get<IWrapperData<UserDto>>({
      url: `api/v1/users/info?accountID=${accountId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return plainToInstance(UserDto, response).toJson<UserDto>()
  }
  async getProfileInfo() {
    const response = await this.controller.get<IWrapperData<ProfileDto>>({
      url: `/api/v1/users/profile`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return plainToInstance(ProfileDto, response.data).toJson<ProfileDto>()
  }
  // async editProfileInfo(editDto: Omit<ProfileDto, "accountID" | "username">) {
  async editProfileInfo(editDto: FormData) {
    const response = await this.controller.put<IWrapperData<UserHandleDto>>({
      url: "api/v1/users/profile/edit",
      body: editDto,
      options: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    })
    console.log(response)

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data
  }
  async editPassword(editDto: { change_password: string; original_password: string }) {
    const response = await this.controller.put<IWrapperData<UserHandleDto[]>>({
      url: `/api/v1/users/profile/changepw`,
      body: editDto,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data
  }
  async deleteAccount(password: string) {
    apiUtil.removeUserData(null)

    const response = await this.controller.delete<IWrapperData<{ message: string }>>({
      url: "/api/v1/auth/secede",
      options: {
        data: {
          password,
        },
      },
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data
  }
  async getAddress() {
    const response = await this.controller.get<IWrapperData<AddressDto[]>>({ url: "api/v1/users/address" })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data.map(address => plainToInstance(AddressDto, address).toJson<AddressDto>())
  }

  async editAddress(editDto: FormData) {
    const response = await this.controller.put<IWrapperData<AddressHandleDto>>({
      url: "api/v1/users/address/edit",
      body: editDto,
      options: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }
  async createAddress(createDto: FormData) {
    const response = await this.controller.post<IWrapperData<AddressHandleDto>>({
      url: "api/v1/users/address/new",
      body: createDto,
      options: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
    // return dummyData.teams_address_new.message === "success"
  }
  async removeAddress(addressId: number) {
    const response = await this.controller.delete<IWrapperData<AddressHandleDto>>({
      url: `api/v1/users/address/remove?addressID=${addressId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    // return response.data.message === "success"
    return response.data
  }
  async editBillingInfo(billingId: number) {
    const response = await this.controller.put<IWrapperData<BillingInfo>>({
      url: `api/v1/users/billing/edit?billingID=${billingId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    // return response.data.message === "success"
    return dummyData.teams_address_remove.message === "success"
  }
  async createBillingInfo(card_token: string) {
    const response = await this.controller.post<IWrapperData<BillingHandleDto>>({
      url: `api/v1/users/billing/new`,
      body: { card_token: card_token },
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(BillingHandleDto, dummyData.users_billing_new).toJson<BillingHandleDto>()
  }
  async removeBillingInfo(billingId: number) {
    const response = await this.controller.delete<IWrapperData<BillingHandleDto>>({
      url: `api/v1/users/billing/remove?billingID=${billingId}`,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(BillingHandleDto, dummyData.users_billing_remove).toJson<BillingHandleDto>()
  }

  async getTeamList() {
    const response = await this.controller.get<IWrapperData<TeamDto[]>>({
      url: `api/v1/users/teams`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    console.error(response)

    return response.data.map(team => plainToInstance(TeamDto, team).toJson<TeamDto>())
    // return dummyData.users_teams.map(team => plainToInstance(TeamDto, team).toJson<TeamDto>())
  }
}
