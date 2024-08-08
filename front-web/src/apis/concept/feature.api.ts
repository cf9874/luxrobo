/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { plainToInstance } from "class-transformer"
import { apiUtil } from "apis/api.util"
import { AxiosController, IWrapperData } from "apis/api.controller"
import { dummyData } from "dummy"
import {
  CustomblockHandleDto,
  FeatureBlockOptionDto,
  FeatureDto,
  FeatureHandleDto,
  FeatureInitDto,
  FeatureRecommendDto,
} from "apis/dto"

export class FeatureApi {
  constructor(private controller: AxiosController) {}
  // POST
  // api/v1/feature/custom/setting
  // Get feature custom block setting

  // async settingCustomblcok(settingDto: {
  //   customblockId: number
  //   block: {
  //     color: string
  //     description: string
  //     name: string
  //     part_id: string
  //     specification: {
  //       additionalProp1: string
  //       additionalProp2: string
  //       additionalProp3: string
  //     }
  //     type: string
  //   }
  // }) {
  //   // const response = await this.controller.post<CustomblockHandleDto>({
  //   //   url: `/api/v1/feature/custom/setting?customblockID=${settingDto.customblockId}`,
  //   //   body: settingDto.block,
  //   // })

  //   // if (apiUtil.isErrorResponse(response)) {
  //   //   return response
  //   // }

  //   return dummyData.feature_custom_setting.message === "success"
  // }
  // POST
  // api/v1/feature/init
  // Feature 초기화면 구성
  async init(ids: { ids: number[] }) {
    const response = await this.controller.post<IWrapperData<FeatureInitDto[]>>({
      url: "/api/v1/feature/init",
      body: ids,
    })

    if (apiUtil.isErrorResponse(response)) {
      return []
    }

    return response.data.map(feature => plainToInstance(FeatureInitDto, feature).toJson<FeatureInitDto>())
  }

  // GET
  // api/v1/feature/load
  // Feature 장바구니 구성
  async load(projectId: number) {
    const response = await this.controller.get<IWrapperData<FeatureDto[]>>({
      url: `api/v1/feature/load?projectID=${projectId}`,
    })

    if (apiUtil.isErrorResponse(response)) {
      return []
    }

    return response.data.map(feature => plainToInstance(FeatureDto, feature).toJson<FeatureDto>())
  }

  // POST
  // api/v1/feature/next
  // feature next
  async next(nextDto: {
    projectId: number
    blocks: {
      block_id: string
      custom: boolean
      part_id: string
      selected_option: {
        [key: string]: string | undefined
      }
      type: string
    }[]
  }) {
    const response = await this.controller.post<IWrapperData<FeatureHandleDto>>({
      url: `api/v1/feature/next?projectID=${nextDto.projectId}`,
      body: nextDto.blocks,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }

  // POST
  // api/v1/feature/recommend
  // block 추천 부품 및 재고 조회
  async recommend(recommendDto: {
    selected_option: {
      [key: string]: string | undefined
    }
    type: string
  }) {
    const response = await this.controller.post<IWrapperData<FeatureRecommendDto>>({
      url: `api/v1/feature/recommend`,
      body: recommendDto,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(FeatureRecommendDto, response.data).toJson<FeatureRecommendDto>()
  }

  // PUT
  // api/v1/feature/save
  // feature 단계 저장
  async save(saveDto: {
    projectId: number
    blocks: {
      block_id: string
      custom: boolean
      part_id: string
      selected_option: {
        [key: string]: string | undefined
      }
      type: string
    }[]
  }) {
    const response = await this.controller.put<IWrapperData<FeatureHandleDto>>({
      url: `api/v1/feature/save?projectID=${saveDto.projectId}`,
      body: saveDto.blocks,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return response
  }

  // POST
  // api/v1/feature/setting
  // block 세부 옵션 조회
  async setting(settingDto: {
    selected_option: {
      [key: string]: string | undefined
    }
    type: string
  }) {
    const response = await this.controller.post<IWrapperData<FeatureBlockOptionDto>>({
      url: `/api/v1/feature/setting`,
      body: settingDto,
    })

    if (apiUtil.isErrorResponse(response)) {
      return response
    }

    return plainToInstance(FeatureBlockOptionDto, response.data).toJson<FeatureBlockOptionDto>()
  }
}
