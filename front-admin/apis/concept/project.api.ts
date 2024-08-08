import { AxiosController, IWrapperData } from "../api.controller"
import { apiUtil } from "../api.util"
import { ProjectDto, SimpleProjectDto } from "../dto/project.dto"
import { createFormData } from "@/utils"

export class ProjectApi {
  constructor(private controller: AxiosController) {}

  async removeProjects(projectIDs: number[]) {
    // const response = await this.controller.delete<
    //   IWrapperData<{
    //     message: string
    //     projectIDs: number[]
    //   }>
    // >({
    //   url: `/api/v1/admin/project/remove`,
    //   options: {
    //     data: { projectIDs },
    //   },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      message: "success",
      projectIDs: [0],
    }
  }

  async getProject(projectID: string) {
    // const response = await this.controller.get<IWrapperData<ProjectDto>>({
    //   url: `/api/v1/admin/projects?projectID=${projectID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return {
      active_user: "active_user",
      created_at: "created_at",
      owner: "owner",
      pcb_board_file: ".../pcb_board_file.json",
      projectID: 0,
      project_blocks: [
        {
          cost: 0,
          is_custom: true,
          part_name: "string",
          type: "string",
          version: "string",
          part_id: 0,
        },
      ],
      project_file: "project_file.json",
      schematics_file: ".../schematics_file.json",
      teamID: 0,
      title: "title",
      updated_at: "updated_at",
      userID: 1,
      workspace: "workspace",
    } as ProjectDto
  }

  async cloneProject(projectID: number, userID: number, teamID: number) {
    // const response = await this.controller.post<
    //   IWrapperData<{
    //     message: string
    //     projectID: number
    //   }>
    // >({
    //   url: `/api/v1/admin/projects/clone?userID=${userID}&teamID=${teamID}`,
    //   body: { projectID },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      message: "success",
      projectID: 0,
    }
  }

  async editProject(
    projectID: number,
    projectEdit: {
      name: string
      project_file: File
      schematics_file: File
      pcb_board_file: File
    },
  ) {
    // const response = await this.controller.put<
    //   IWrapperData<{
    //     message: string
    //     projectID: number
    //   }>
    // >({
    //   url: `/api/v1/admin/projects/edit?projectID=${projectID}`,
    //   body: createFormData(projectEdit),
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      message: "success",
      projectID: 0,
    }
  }

  async getProjectLog(projectID: number) {
    // const response = await this.controller.get<IWrapperData<string[]>>({
    //   url: `/api/v1/admin/projects/log?projectID=${projectID}`,
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data

    return [
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
      "20231214T00Z00 code:1003 not found-not ",
    ]
  }

  async moveProjectToWorkspace(projectID: number, userID: number, teamID: number) {
    // const response = await this.controller.put<IWrapperData<{ message: string; projectID: number }>>({
    //   url: `/api/v1/admin/projects/move?userID=${userID}&teamID=${teamID}`,
    //   body: { projectID },
    // })

    // if (apiUtil.isErrorResponse(response)) {
    //   return response
    // }

    // return response.data
    return {
      message: "success",
      projectID: 0,
    }
  }

  async searchProjects(keyword: string, conditions: { is_match: boolean; range: number }) {
    //   const response = await this.controller.get<IWrapperData<SimpleProjectDto[]>>({
    //     url: `/api/v1/admin/projects/search?keyword=${keyword}`,
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
        active_user: "active_user",
        owner: "owner",
        projectID: 0,
        teamID: 0,
        title: "title",
        updated_at: "updated_at",
        userID: 0,
        workspace: "workspace",
        uuid: "AnGrqkrb9Qb4NqMLDMLqdw",
      } as SimpleProjectDto,
      {
        active_user: "active_user",
        owner: "owner",
        projectID: 1,
        teamID: 0,
        title: "title",
        updated_at: "updated_at",
        userID: 0,
        workspace: "workspace",
        uuid: "AnGrqkrb9Qb4NqMLDMLqdw",
      } as SimpleProjectDto,
      {
        active_user: "active_user",
        owner: "owner",
        projectID: 2,
        teamID: 0,
        title: "title",
        updated_at: "updated_at",
        userID: 0,
        workspace: "workspace",
        uuid: "AnGrqkrb9Qb4NqMLDMLqdw",
      } as SimpleProjectDto,
    ] as SimpleProjectDto[]
  }
}
