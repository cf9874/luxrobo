import { AxiosController, IWrapperData } from "../api.controller"
// import { UserGetDto, UserAddressDto, UserCreditDto, UserTeamDto, UserCustomblockDto, UserProjectDto } from "../dto"
import { apiUtil } from "../api.util"
import { createFormData } from "@/utils"
import { TeamMemberDto, UserAddressDto, UserCustomBlockDto, UserProjectInfoDto, UserSimpleInfoDto } from "../dto"

export class UserApi {
  constructor(private controller: AxiosController) {}

  async getUserAddresses(userID: number) {
    // const response = await this.controller.get<IWrapperData<UserAddressDto[]>>({
    //   url: `/api/v1/admin/users/address?userID=${userID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return [
      {
        addressID: 0,
        address_json_string: "detail_address(address)",
        address_name: "address_name",
        is_default: true,
        phone_number: "phone_number",
        postal_code: "postal_code",
        receiver: "receiver",
      } as UserAddressDto,
    ] as UserAddressDto[]
  }

  async editUserAddress(
    addressID: number,
    userID: number,
    params: {
      addressID: number
      address_name: string
      receiver: string
      phone_number: string
      address_json_string: string
      // postal_code: number
      postal_code: string
      is_default: boolean
    },
  ) {
    // const response = await this.controller.put<
    //   IWrapperData<{
    //     addressID: number
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/users/address/edit?addressID=${addressID}&userID=${userID}`,
    //   body: createFormData(params),
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
      addressID: 0,
      message: "success",
    }
  }

  async createNewUserAddress(
    userID: number,
    params: {
      address_name: string
      receiver: string
      phone_number: string
      address_json_string: string
      // postal_code: number
      postal_code: string
      is_default: boolean
    },
  ) {
    // const response = await this.controller.post<IWrapperData<UserAddressDto>>({
    // url: `/api/v1/admin/users/address/new?userID=${userID}`,
    //   body: createFormData(params),
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
      address_json_string: "string",
      address_name: "string",
      is_default: true,
      phone_number: "string",
      postal_code: 0,
      receiver: "string",
    }
  }

  async removeUserAddress(addressIDs: number[]) {
    // const response = await this.controller.delete<
    //   IWrapperData<{
    //     addressIDs: number[]
    //     message: string
    //   }>
    // >({
    //   url: "/api/v1/admin/users/addresss/remove",
    //   options: {
    //     data: { addressIDs },
    //   },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      addressIDs: [0],
      message: "success",
    }
  }

  async getUserCustomblocks(userID: number) {
    // const response = await this.controller.get<IWrapperData<UserCustomBlockDto[]>>({
    //   url: `/api/v1/admin/users/customblock?userID=${userID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return [
      {
        customblockID: 0,
        name: "name",
        owner: "owner",
        partID: 0,
        updated_at: "updated_at",
        workspace: "workspace",
      } as UserCustomBlockDto,
    ] as UserCustomBlockDto[]
  }

  async editUserProfile(
    userID: number,
    request: {
      profile_image: File
      nickname: string
      email: string
      countrycode: string
      phone_number: string
      email_opt_in: boolean
      phone_opt_in: boolean
    },
  ) {
    // const response = await this.controller.put<IWrapperData<{ message: string; userID: number }>>({
    //   url: `/api/v1/admin/users/edit?userID=${userID}`,
    //   body: createFormData(request),
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
      userID: 0,
    }
  }

  async createNewUser(request: {
    accountID: string
    profile_image: File
    username: string
    nickname: string
    email: string
    password: string
    countrycode: string
    phone_number: string
    email_opt_in: boolean
    phone_opt_in: boolean
  }) {
    // const response = await this.controller.post<IWrapperData<{ message: string; userID: number }>>({
    //   url: "/api/v1/admin/users/new",
    //   body: createFormData(request),
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
      userID: 0,
    }
  }

  async getUserProjects(userID: number) {
    // const response = await this.controller.get<IWrapperData<UserProjectInfoDto[]>>({
    //   url: `/api/v1/admin/users/project?userID=${userID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return [
      {
        active_user: "active_user",
        owner: "owner",
        projectID: 0,
        teamID: 0,
        title: "title",
        updated_at: "updated_at",
        userID: 0,
        workspace: "workspace",
      } as UserProjectInfoDto,
    ] as UserProjectInfoDto[]
  }

  async resetUserPassword(userID: number) {
    // const response = await this.controller.put<
    //   IWrapperData<{
    //     message: string
    //     userID: number
    //   }>
    // >({
    //   url: `/api/v1/admin/users/pwreset?userID=${userID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      message: "success",
      userID: 0,
    }
  }

  async removeUserAccounts(userIDs: number[]) {
    // const response = await this.controller.delete<
    //   IWrapperData<{
    //     message: string
    //     userIDs: number[]
    //   }>
    // >({
    //   url: "/api/v1/admin/users/remove",
    //   options: {
    //     data: { userIDs },
    //   },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    console.log(userIDs)
    return {
      message: "success",
      userIDs: [0],
    }
  }

  async searchUsers(keyword: string, conditions: { is_match: boolean; range: number }) {
    // const response = await this.controller.get<IWrapperData<UserSimpleInfoDto[]>>({
    //   url: `/api/v1/admin/users/search?keyword=${keyword}`,
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
        countrycode: "countrycode",
        created_at: "created_at",
        email: "email",
        email_opt_in: true,
        last_login_at: 0,
        nickname: "nickname",
        phone_number: "phone_number",
        phone_opt_in: true,
        profile_image:
          "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
        userID: 0,
        username: "username",
      } as UserSimpleInfoDto,
      {
        accountID: "accountID",
        countrycode: "countrycode",
        created_at: "created_at",
        email: "email",
        email_opt_in: true,
        last_login_at: 0,
        nickname: "nickname",
        phone_number: "phone_number",
        phone_opt_in: true,
        profile_image:
          "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
        userID: 1,
        username: "username",
      } as UserSimpleInfoDto,
      {
        accountID: "accountID",
        countrycode: "countrycode",
        created_at: "created_at",
        email: "email",
        email_opt_in: true,
        last_login_at: 0,
        nickname: "nickname",
        phone_number: "phone_number",
        phone_opt_in: true,
        profile_image:
          "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
        userID: 2,
        username: "username",
      } as UserSimpleInfoDto,
    ] as UserSimpleInfoDto[]
  }

  async getUserTeams(userID: number) {
    // const response = await this.controller.get<IWrapperData<TeamMemberDto[]>>({
    //   url: `/api/v1/admin/users/team?userID=${userID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return [
      {
        countrycode: "countrycode",
        email: "email",
        email_opt_in: true,
        phone_number: "phone_number",
        phone_opt_in: true,
        role: 1,
        teamID: 0,
        team_image: "",
        team_name: "team_name",
      } as TeamMemberDto,
    ] as TeamMemberDto[]
  }

  async leaveTeam(userID: number, teamID: number) {
    // const response = await this.controller.delete<
    //   IWrapperData<{
    //     message: string
    //     teamID: number
    //     userID: number
    //   }>
    // >({
    //   url: `/api/v1/admin/users/team/leave?userID=${userID}&teamID=${teamID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      message: "success",
      teamID: 0,
      userID: 0,
    }
  }

  async getDetail(userID: number) {
    // const response = await this.controller.get<IWrapperData<UserSimpleInfoDto>>({
    //   url: `/api/v1/admin/users?userID=${userID}`,
    // })
    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }
    // return response.data

    return {
      accountID: "accountID",
      countrycode: "countrycode",
      created_at: "created_at",
      email: "email",
      email_opt_in: true,
      last_login_at: 0,
      nickname: "nickname",
      phone_number: "phone_number",
      phone_opt_in: true,
      profile_image:
        "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
      userID: 0,
      username: "username",
    } as UserSimpleInfoDto
  }
}
