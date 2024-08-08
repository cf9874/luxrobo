/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { UserSearchDto } from "apis/dto"
import { plainToInstance } from "class-transformer"
import { AxiosController, IWrapperData } from "apis/api.controller"
import { apiUtil } from "apis/api.util"
import { dummyData } from "dummy"

export class SearchApi {
  constructor(private controller: AxiosController) {}
  //   GET
  // /api/v1/search/users
  // Search User by AccountID
  async search(keyword: string) {
    const res = await this.controller.get<IWrapperData<UserSearchDto[]>>({
      url: `api/v1/search/users?keyword=${keyword}`,
    })
    if (apiUtil.isErrorResponse(res)) {
      return []
    }
    return res.data.map(e => plainToInstance(UserSearchDto, e).toJson<UserSearchDto>())
  }
}
