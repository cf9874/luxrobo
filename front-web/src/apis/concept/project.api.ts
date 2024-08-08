/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { plainToInstance } from "class-transformer"
import { AxiosController, IWrapperData } from "apis/api.controller"
import { apiUtil } from "apis/api.util"
import { ProjectClonedDto, ProjectDto, ProjectHandleDto, ProjectLastModifiedDto, ProjectProgress } from "apis/dto"
import { dummyData } from "dummy"

export class ProjectApi {
  constructor(private controller: AxiosController) {}
  //   GET
  // /api/v1/projects
  // 특정 Project 조회
  async getDetail(projectId: number) {
    const response = await this.controller.get<IWrapperData<ProjectDto>>({
      url: `api/v1/projects?projectID=${projectId}`,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(ProjectDto, response.data).toJson<ProjectDto>()
  }

  // POST
  // /api/v1/projects/clone
  // Project 복제 기능
  async clone(cloneDto: { projectId: number; clone_title: string }) {
    const response = await this.controller.post<IWrapperData<ProjectClonedDto>>({
      url: `api/v1/projects/clone?projectID=${cloneDto.projectId}`,
      body: {
        clone_title: cloneDto.clone_title,
      },
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return plainToInstance(ProjectClonedDto, response.data).toJson<ProjectClonedDto>()
  }

  // GET
  // /api/v1/projects/list
  // 특정 team,user Project list 조회
  async getList(teamId?: number) {
    const response = await this.controller.get<IWrapperData<ProjectDto[]>>({
      url: `api/v1/projects/list${teamId !== undefined ? `?teamID=` + teamId : ""}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data.map(project => plainToInstance(ProjectDto, project).toJson<ProjectDto>())
  }

  // POST
  // /api/v1/projects/new
  // 신규 Project 생성
  async create(createDto: { teamId?: number; title: string }) {
    const response = await this.controller.post<IWrapperData<ProjectHandleDto>>({
      url: `api/v1/projects/new${createDto.teamId !== undefined ? `?teamID=` + createDto.teamId : ""}`,
      body: { title: createDto.title },
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }

  // POST
  // /api/v1/projects/progress
  // Project Progress Check
  async progress(projectId: number) {
    const response = await this.controller.get<IWrapperData<ProjectProgress>>({
      url: `api/v1/projects/progress?projectID=${projectId}`,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return plainToInstance(ProjectProgress, response.data).toJson<ProjectProgress>()
  }

  // DELETE
  // /api/v1/projects/remove
  // Project 삭제
  async delete(deleteDto: { projectId: number; delete_title: string }) {
    const response = await this.controller.delete<IWrapperData<ProjectHandleDto>>({
      url: `api/v1/projects/remove?projectID=${deleteDto.projectId}`,
      options: {
        data: { delete_title: deleteDto.delete_title },
      },
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return response
  }

  // POST
  // /api/v1/projects/share
  // Project 공유 기능
  async share(shareDto: { projectId: number; accountID: string }) {
    const response = await this.controller.post<IWrapperData<ProjectHandleDto>>({
      url: `api/v1/projects/share?projectID=${shareDto.projectId}`,
      body: {
        accountID: shareDto.accountID,
      },
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return response
  }

  // PUT
  // /api/v1/projects/update
  // Project title 또는 description update
  async update(updateDto: { projectId: number; new_title: string }) {
    const response = await this.controller.put<IWrapperData<ProjectHandleDto>>({
      url: `api/v1/projects/update?projectID=${updateDto.projectId}`,
      body: { new_title: updateDto.new_title },
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return response
  }
  async lastModified(projectId: number) {
    const response = await this.controller.get<IWrapperData<ProjectLastModifiedDto>>({
      url: `api/v1/projects/lastmodified?projectID=${projectId}`,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return plainToInstance(ProjectLastModifiedDto, response.data).toJson<ProjectLastModifiedDto>()
  }
}
