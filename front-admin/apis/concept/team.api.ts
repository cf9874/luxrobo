import { AxiosController, IWrapperData } from "../api.controller"
import { apiUtil } from "../api.util"
import { createFormData } from "@/utils"
import {
  CustomBlockInfoDto,
  TeamProjectInfoDto,
  TeamAddressEditDto,
  TeamMemberInfoDto,
  TeamProfileInfoDto,
  TeamAddressDto,
} from "../dto/team.dto"

export class TeamApi {
  constructor(private controller: AxiosController) {}

  async editTeamAddress(
    addressID: number,
    teamID: number,
    addressEdit: {
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
    //   url: `/api/v1/admin/teams/address/edit?addressID=${addressID}&teamID=${teamID}`,
    //   body: createFormData(addressEdit),
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

  async createTeamAddress(
    teamID: number,
    addressInfo: {
      address_name: string
      receiver: string
      phone_number: string
      address_json_string: string
      // postal_code: number
      postal_code: string
      is_default: boolean
    },
  ) {
    // const response = await this.controller.post<IWrapperData<TeamAddressEditDto>>({
    //   url: `/api/v1/admin/teams/address/new?teamID=${teamID}`,
    //   body: createFormData(addressInfo),
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
      postal_code: "0",
      receiver: "string",
    } as TeamAddressEditDto
  }

  async removeTeamAddress(addressIDs: number[]) {
    // const response = await this.controller.delete<
    //   IWrapperData<{
    //     addressIDs: number[]
    //     message: string
    //   }>
    // >({
    //   url: `/api/v1/admin/teams/addresss/remove`,
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

  async getTeamCustomblocks(teamID: number) {
    // const response = await this.controller.get<IWrapperData<CustomBlockInfoDto[]>>({
    //   url: `/api/v1/admin/teams/customblock?teamID=${teamID}`,
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
      } as CustomBlockInfoDto,
    ] as CustomBlockInfoDto[]
  }

  async editTeamProfile(
    teamID: number,
    teamEdit: {
      profile_image: File
      nickname: string
      email: string
      countrycode: string
      phone: string
      email_opt_in: boolean
      phone_opt_in: boolean
    },
  ) {
    // const response = await this.controller.put<
    //   IWrapperData<{
    //     message: string
    //     teamID: number
    //   }>
    // >({
    //   url: `/api/v1/admin/teams/edit?teamID=${teamID}`,
    //   body: createFormData(teamEdit),
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
      teamID: 0,
    }
  }

  async getTeamMembers(teamID: number) {
    // const response = await this.controller.get<IWrapperData<TeamMemberInfoDto[]>>({
    //   url: `/api/v1/admin/teams/members?teamID=${teamID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return [
      {
        email: "email",
        role: 1,
        userID: 0,
        user_name: "user_name",
      } as TeamMemberInfoDto,
      {
        email: "email",
        role: 2,
        userID: 1,
        user_name: "user_name",
      } as TeamMemberInfoDto,
    ] as TeamMemberInfoDto[]
  }

  async changeTeamMemberRole(teamID: number, userID: number, newRole: number) {
    // const response = await this.controller.put<
    //   IWrapperData<{
    //     message: string
    //     userID: number
    //   }>
    // >({
    //   url: `/api/v1/admin/teams/members/auth?teamID=${teamID}&userID=${userID}&role=${newRole}`,
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

  async removeTeamMember(teamID: number, userID: number) {
    // const response = await this.controller.delete<
    //   IWrapperData<{
    //     message: string
    //     userID: number
    //   }>
    // >({
    //   url: `/api/v1/admin/teams/members/remove?teamID=${teamID}&userID=${userID}`,
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

  async getTeamProjects(teamID: number) {
    // const response = await this.controller.get<IWrapperData<TeamProjectInfoDto[]>>({
    //   url: `/api/v1/admin/teams/project?teamID=${teamID}`,
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
      } as TeamProjectInfoDto,
    ] as TeamProjectInfoDto[]
  }

  async removeTeams(teamIDs: number[]) {
    // const response = await this.controller.delete<
    //   IWrapperData<{
    //     message: string
    //     teamIDs: number[]
    //   }>
    // >({
    //   url: "/api/v1/admin/teams/remove",
    //   options: {
    //     data: { teamIDs },
    //   },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return {
      message: "success",
      teamIDs: [0],
    }
  }

  async searchTeams(keyword: string, conditions: { is_match: boolean; range: number }) {
    //   const response = await this.controller.get<IWrapperData<TeamProfileInfoDto[]>>({
    //     url: `/api/v1/admin/teams/search?keyword=${keyword}`,
    //     options: {
    //       params: conditions,
    //     },
    //   })

    //   if (apiUtil.isErrorResponse(response)) {
    //     return response
    //   }

    //   return response.data
    // }
    return [
      {
        countrycode: "countrycode",
        email: "email",
        email_opt_in: true,
        phone_number: "phone_number",
        phone_opt_in: true,
        teamID: 0,
        team_image: "",
        team_name: "team_name",
      } as TeamProfileInfoDto,
      {
        countrycode: "countrycode",
        email: "email",
        email_opt_in: true,
        phone_number: "phone_number",
        phone_opt_in: true,
        teamID: 1,
        team_image: "",
        team_name: "team_name",
      } as TeamProfileInfoDto,
    ] as TeamProfileInfoDto[]
  }

  //
  async createNewTeam(request: {
    profile_image: File
    team_name: string
    email: string
    countrycode: string
    phone_number: string
    email_opt_in: boolean
    phone_opt_in: boolean
  }) {
    // const response = await this.controller.post<IWrapperData<{ message: string; teamID: number }>>({
    //   url: "/api/v1/admin/teams/new",
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
      teamID: 0,
    }
  }

  async getDetail(teamID: number) {
    //   const response = await this.controller.get<IWrapperData<TeamProfileInfoDto>>({
    //     url: `/api/v1/admin/team?teamID=${teamID}`,
    //   })
    //   if (apiUtil.isErrorResponse(response)) {
    //     return response
    //   }
    //   return response.data
    // }

    return {
      countrycode: "countrycode",
      email: "email",
      email_opt_in: true,
      phone_number: "phone_number",
      phone_opt_in: true,
      teamID: 0,
      team_image:
        "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
      team_name: "team_name",
    } as TeamProfileInfoDto
  }

  async getTeamAddresses(teamID: number) {
    // const response = await this.controller.get<IWrapperData<TeamAddressDto[]>>({
    //   url: `/api/v1/admin/users/address?teamID=${teamID}`,
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
      } as TeamAddressDto,
    ] as TeamAddressDto[]
  }
}
