/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { plainToInstance } from "class-transformer"
import { apiUtil } from "apis/api.util"
import { AxiosController, IWrapperData } from "apis/api.controller"
import {
  LogicBlockInfoDto,
  LogicBlockSchemaDto,
  LogicBlockVoltageDto,
  LogicCopyDto,
  LogicCreatePowerNetDto,
  LogicCustomDto,
  LogicCustomHandleDto,
  LogicCustomInitDto,
  LogicHandleDto,
  LogicLinkDto,
  LogicPowerNetDto,
} from "apis/dto"
import { dummyData } from "dummy"
import { CATEGORY_COLOR } from "@const/block.const"

export class LogicApi {
  constructor(private controller: AxiosController) {}
  //   POST
  // /api/v1/logic/block
  // Copy Logic Block
  async copy(blockDto: { projectID: number; blockID: string }) {
    const response = await this.controller.post<IWrapperData<LogicCopyDto>>({
      url: `api/v1/logic/block?projectID=${blockDto.projectID}&blockID=${blockDto.blockID}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return plainToInstance(LogicCopyDto, response.data).toJson<LogicCopyDto>()
  }

  // DELETE
  // /api/v1/logic/block
  // Remove Logic Block
  async delete(blockDto: { projectID: number; blockId: string }) {
    const response = await this.controller.delete<IWrapperData<LogicHandleDto>>({
      url: `api/v1/logic/block?projectID=${blockDto.projectID}&blockID=${blockDto.blockId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }

  // GET
  // /api/v1/logic/blockinfo
  // Block detail information
  async getBlockInfo(blockInfoDto: { projectId: number; blockId: string }) {
    const response = await this.controller.get<IWrapperData<LogicBlockInfoDto>>({
      url: `api/v1/logic/blockinfo?projectID=${blockInfoDto.projectId}&blockID=${blockInfoDto.blockId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(LogicBlockInfoDto, response.data).toJson<LogicBlockInfoDto>()
  }

  // GET
  // /api/v1/logic/blocksch
  // Get Block Schema and Param
  async getBlockSchema(blockSchDto: { projectId: number; blockId: string }) {
    const response = await this.controller.get<IWrapperData<LogicBlockSchemaDto>>({
      url: `api/v1/logic/blocksch?projectID=${blockSchDto.projectId}&blockID=${blockSchDto.blockId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return plainToInstance(LogicBlockSchemaDto, response.data).toJson<LogicBlockSchemaDto>()
  }

  // PUT
  // /api/v1/logic/blocksch
  // Upload Block Schema
  async editBlockSchema(blockSchDto: { projectId: number; blockId: string; schema: { schema: string } }) {
    const response = await this.controller.put<IWrapperData<LogicBlockSchemaDto>>({
      url: `api/v1/logic/blocksch?projectID=${blockSchDto.projectId}&blockID=${blockSchDto.blockId}`,
      body: blockSchDto.schema,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(LogicBlockSchemaDto, response.data).toJson<LogicBlockSchemaDto>()
  }

  // GET
  // /api/v1/logic/blockvoltage
  // Change Block Voltage
  async getBlockVolt(voltDto: { projectID: number; blockId: string; newvolt: number }) {
    const response = await this.controller.get<IWrapperData<LogicBlockVoltageDto>>({
      url: `api/v1/logic/blockvoltage?projectID=${voltDto.projectID}&blockID=${voltDto.blockId}&newvolt=${voltDto.newvolt}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(LogicBlockVoltageDto, response.data).toJson<LogicBlockVoltageDto>()
  }

  // PUT
  // /api/v1/logic/blockvoltage
  // Apply Changed Part
  async applyBlockVolt(applyVoltDto: {
    projectId: number
    blockId: string
    netName: string
    volt: LogicBlockVoltageDto
  }) {
    const response = await this.controller.put<IWrapperData<LogicBlockVoltageDto>>({
      url: `api/v1/logic/blockvoltage?projectID=${applyVoltDto.projectId}&blockID=${applyVoltDto.blockId}&netName=${applyVoltDto.netName}`,
      body: applyVoltDto.volt,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }

  // GET
  // /api/v1/logic/custom/block
  // Open Custom Block
  async getCustomBlock(blockDto: { projectid: number; partId: string }) {
    const response = await this.controller.post<IWrapperData<LogicCustomHandleDto>>({
      url: `api/v1/logic/custom/save?projectID=${blockDto.projectid}&blockID=${blockDto.partId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(LogicCustomDto, response.data).toJson<LogicCustomDto>()
  }

  // POST
  // /api/v1/logic/custom/block
  // Set Custom Block
  async setCustomBlock(saveDto: {
    projectid: number
    blockID?: string
    block: {
      color: CATEGORY_COLOR | string
      description: string
      name: string
      specification: { [key: string]: string }
      type: string
    }
  }) {
    const response = await this.controller.post<IWrapperData<LogicCustomHandleDto>>({
      url: `api/v1/logic/custom/block?projectID=${saveDto.projectid}${
        saveDto.blockID !== undefined ? `&blockID=${saveDto.blockID}` : ``
      }`,
      body: saveDto.block,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }
    return plainToInstance(LogicCustomHandleDto, response.data).toJson<LogicCustomHandleDto>()
  }

  // POST
  // /api/v1/logic/custom/save
  // Save Custom Block
  async saveCustomBlock(saveDto: { projectid: number; blockId: string; block: LogicCustomDto[] }) {
    const response = await this.controller.post<IWrapperData<LogicHandleDto>>({
      url: `api/v1/logic/custom/save?projectID=${saveDto.projectid}&blockID=${saveDto.blockId}`,
      body: saveDto.block,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }

  // POST
  // /api/v1/logic/init
  // logic 단계 진입 시 회로 정보 조회
  async init(projectId: number) {
    const response = await this.controller.post<IWrapperData<LogicCustomInitDto[]>>({
      url: `api/v1/logic/init?projectID=${projectId}`,
    })
    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data.map(logic => plainToInstance(LogicCustomInitDto, logic).toJson<LogicCustomInitDto>())
  }

  // GET
  // /api/v1/logic/links
  // 블록 연결 정보 조회
  async getLinks(projectId: number) {
    const response = await this.controller.get<IWrapperData<LogicLinkDto[]>>({
      url: `api/v1/logic/links?projectID=${projectId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data.map(link => plainToInstance(LogicLinkDto, link).toJson<LogicLinkDto>())
  }

  // PUT
  // /api/v1/logic/links
  // logic 단계 진입 시 회로 정보 조회
  async editLinks(editLinkDto: LogicLinkDto[]) {
    const response = await this.controller.put<IWrapperData<LogicHandleDto>>({
      url: `/api/v1/logic/links`,
      body: editLinkDto,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }

  // PUT
  // /api/v1/logic/naimingparam
  // Apply Naiming Param
  async editNamingParam(namingDto: {
    projectId: number
    blockId: string
    param: {
      io_type: string
      max_vol: number
      min_vol: number
      pin_name: string
      pin_type: string
    }[]
  }) {
    const response = await this.controller.put<IWrapperData<LogicBlockSchemaDto>>({
      url: `api/v1/logic/namingparam?projectID=${namingDto.projectId}&blockID=${namingDto.blockId}`,
      body: namingDto.param,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(LogicBlockSchemaDto, response.data).toJson<LogicBlockSchemaDto>()
  }

  // GET
  // /api/v1/logic/next
  // Logic Next
  async next(projectId: number) {
    const response = await this.controller.get<IWrapperData<LogicHandleDto>>({
      url: `/api/v1/logic/next?projectID=${projectId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }

  // GET
  // /api/v1/logic/powernets
  // Get Power nets

  async getPowerNets(projectId: number) {
    const response = await this.controller.get<IWrapperData<LogicPowerNetDto[]>>({
      url: `api/v1/logic/powernets?projectID=${projectId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response.data.map(power => plainToInstance(LogicPowerNetDto, power).toJson<LogicPowerNetDto>())
  }

  // POST
  // /api/v1/logic/powernets
  // Get New Power nets
  async createPowerNets(createDto: { projectID: number; refvolt: number }) {
    const response = await this.controller.post<IWrapperData<LogicCreatePowerNetDto>>({
      url: `/api/v1/logic/powernets?projectID=${createDto.projectID}&refvolt=${createDto.refvolt}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(LogicCreatePowerNetDto, response.data).toJson<LogicCreatePowerNetDto>()
  }

  // PUT
  // /api/v1/logic/regulator
  // Change Regulator
  async editRegulator(deitDto: { projectId: number; blockId: string; topology: string }) {
    const response = await this.controller.put<IWrapperData<LogicCustomHandleDto>>({
      url: `/api/v1/logic/regulator?projectID=${deitDto.projectId}&blockID=${deitDto.blockId}&topology=${deitDto.topology}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(LogicCustomHandleDto, response.data).toJson<LogicCustomHandleDto>()
  }
}
