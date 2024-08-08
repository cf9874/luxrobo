/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
// import { IWrapperData, this.controller } from "./api.connector"
// import { plainToInstance } from "class-transformer"
// import { apiUtil } from "./api.util"

import { teamAuth } from "@const/team.const"
import { AxiosController, IWrapperData } from "apis/api.controller"
import { apiUtil } from "apis/api.util"
import { TeamHandleDto, TeamInviteDto, TeamMemberDto, TeamProfileDto } from "apis/dto"
import { BasicResponseDto } from "apis/dto/base.dto"
import { AddressDto, AddressHandleDto } from "apis/dto/common.dto"
import { plainToInstance } from "class-transformer"
import { dummyData } from "dummy"

// import { TeamAddressDto } from "./dto/team.dto.temp"
export class TeamApi {
  constructor(private controller: AxiosController) {}

  async getTeamAddress(teamId: number) {
    const response = await this.controller.get<IWrapperData<AddressDto[]>>({
      url: `api/v1/teams/address?teamID=${teamId}`,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data.map(address => plainToInstance(AddressDto, address)?.toJson<AddressDto>())
  }
  async editTeamAddress(addressDto: { teamId: number; address: FormData }) {
    const response = await this.controller.put<IWrapperData<AddressHandleDto>>({
      url: `api/v1/teams/address/edit?teamID=${addressDto.teamId}`,
      body: addressDto.address,
      options: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    })

    console.error(response)

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }
  async createTeamAddress(addressDto: { teamId: number; address: FormData }) {
    const response = await this.controller.post<IWrapperData<AddressHandleDto>>({
      url: `api/v1/teams/address/new?teamID=${addressDto.teamId}`,
      body: addressDto.address,
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
  async removeTeamAddress(removeDto: { teamID: number; addressID: number }) {
    const response = await this.controller.delete<IWrapperData<{ message: string }>>({
      url: `api/v1/teams/address/remove?teamID=${removeDto.teamID}&addressID=${removeDto.addressID}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data
  }
  async editTeamProfile(editProfileDto: { teamID: number; profile: FormData }) {
    const response = await this.controller.put<IWrapperData<TeamHandleDto>>({
      url: `api/v1/teams/profile/edit?teamID=${editProfileDto.teamID}`,
      body: editProfileDto.profile,
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
  async removeTeam(teamRemoveDto: { teamID: number; title: string }) {
    const response = await this.controller.delete<IWrapperData<{ message: string }>>({
      url: `api/v1/teams/remove?teamID=${teamRemoveDto.teamID}`,
      options: {
        data: { title: teamRemoveDto.title },
      },
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data
  }
  async removeTeamMember(deleteDto: { teamId: number; members: { deleteID: number[] } }) {
    const response = await this.controller.delete<IWrapperData<BasicResponseDto>>({
      url: `/api/v1/teams/members/remove?teamID=${deleteDto.teamId}`,
      options: {
        data: deleteDto.members,
      },
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return response
  }
  async leave(teamID: number) {
    const response = await this.controller.delete<IWrapperData<BasicResponseDto>>({
      url: `/api/v1/users/teams/leave?teamID=${teamID}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return response.data
  }
  async getMemberList(teamId: number) {
    const response = await this.controller.get<IWrapperData<TeamMemberDto[]>>({
      url: `/api/v1/teams/members?teamID=${teamId}`,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return response.data.map(member => plainToInstance(TeamMemberDto, member).toJson<TeamMemberDto>())
  }
  async editMemberAuth(authDto: {
    teamId: number
    auth: {
      role: teamAuth
      userId: number
    }
  }) {
    const response = await this.controller.put<IWrapperData<BasicResponseDto>>({
      url: `api/v1/teams/members/auth?teamID=${authDto.teamId}`,
      body: authDto.auth,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(AddressDto, response.data).toJson<AddressDto>()
  }
  async inviteMember(inviteDto: { teamId: number; members: string[] }) {
    const response = await this.controller.post<IWrapperData<BasicResponseDto>>({
      url: `api/v1/teams/members/invite?teamID=${inviteDto.teamId}`,
      body: { accountIDs: inviteDto.members },
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }
  async inviteMemberEmail(inviteDto: { teamId: number; members: string[] }) {
    const response = await this.controller.post<IWrapperData<TeamInviteDto>>({
      url: `api/v1/teams/send/inviting-email?teamID=${inviteDto.teamId}`,
      body: { accountIDs: inviteDto.members },
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }
  async createTeam(teamDto: FormData) {
    const response = await this.controller.post<IWrapperData<TeamHandleDto>>({
      url: `api/v1/teams/new`,
      body: teamDto,
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
  async getTeamProfile(teamId: number) {
    const response = await this.controller.get<IWrapperData<TeamProfileDto>>({
      url: `api/v1/teams/profile?teamID=${teamId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return plainToInstance(TeamProfileDto, response.data).toJson<TeamProfileDto>()
  }
}
