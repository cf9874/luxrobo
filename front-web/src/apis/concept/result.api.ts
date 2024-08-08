/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { plainToInstance } from "class-transformer"
import { apiUtil } from "apis/api.util"
import { AxiosController, IWrapperData } from "apis/api.controller"
import { ResultBOMDto, ResultModelDto, ResultPcbDto, ResultSchemDto } from "apis/dto"
import { dummyData } from "dummy"

export class ResultApi {
  constructor(private controller: AxiosController) {}

  //   GET
  // /api/v1/result/3dmodel
  // Result 3d model image 조회
  async get3dmodel(projectId: number) {
    const res = await this.controller.get<IWrapperData<ResultModelDto>>({
      url: `api/v1/result/3dmodel?projectID=${projectId}`,
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return plainToInstance(ResultModelDto, res.data).toJson<ResultModelDto>()
  }

  // GET
  // /api/v1/result/bom
  // Result BOM image 조회
  async getBOM(projectId: number) {
    const res = await this.controller.get<IWrapperData<ResultBOMDto>>({
      url: `api/v1/result/bom?projectID=${projectId}`,
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return plainToInstance(ResultBOMDto, res.data).toJson<ResultBOMDto>()
  }

  // GET
  // /api/v1/result/pcb
  // Result PCB board image 조회
  async getPcb(projectId: number) {
    const res = await this.controller.get<IWrapperData<ResultPcbDto>>({
      url: `api/v1/result/pcb?projectID=${projectId}`,
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return plainToInstance(ResultPcbDto, res.data).toJson<ResultPcbDto>()
  }

  // GET
  // /api/v1/result/schema
  // Result Schema image 조회
  async getSchema(projectId: number) {
    const res = await this.controller.get<IWrapperData<ResultSchemDto>>({
      url: `api/v1/result/schema?projectID=${projectId}`,
    })
    if (apiUtil.isErrorResponse(res)) {
      return res
    }

    return plainToInstance(ResultSchemDto, res.data).toJson<ResultSchemDto>()
  }
}
