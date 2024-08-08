import { DummyData } from "@/dummy"
import { AxiosController } from "../api.controller"
import { DefaultDataDtoRes } from "../dto"

export class JsonAPi {
  constructor(private controller: AxiosController) {}

  // async getUser () => {
  //   //return await this.controller.get<UserDto>({ url: "http://localhost:5000" + "todos/1" })
  // },

  // async getSearch (selectedDataOption: string, selectedWordOption: string, isSearch: string) => {
  //   return await this.controller.get({
  //     url: "http://localhost:5000" + `search?selectedDataOption=${selectedDataOption}&selectedWordOption=${selectedWordOption}&isSearch=${isSearch}`,
  //     options: {},
  //   })
  // },

  // 관리자관리 -> 권한 관리
  async getAdminList() {
    // return await this.controller.get({ url: "http://localhost:5000" + `/admin` })

    const data = await this.controller.get<any>({ url: "http://localhost:5000" + `/admin` })

    const modifiedData = await Promise.all(
      data.map(async item => ({
        key: item.id,
        adminName: item.adminName,
        user: item.user,
        team: item.team,
        project: item.project,
        custom: item.custom,
        tool: item.tool,
        order: item.order,
        purchase: item.purchase,
        question: item.question,
      })),
    )

    return modifiedData as any
  }

  async deleteAdminList(id: number) {
    return (await this.controller.delete({ url: "http://localhost:5000" + `/admin/${id}` })) as any
  }

  async postAdminList(info) {
    return (await this.controller.post({ url: "http://localhost:5000" + `/admin`, body: info })) as any
  }

  async patchAdminList(id, info) {
    return (await this.controller.patch({ url: "http://localhost:5000" + `/admin/${id}`, body: info })) as any
  }

  // 관리자관리 -> 계정관리
  async getAccountList() {
    const data = await this.controller.get<any>({ url: "http://localhost:5000" + `/user` })

    const modifiedData = await Promise.all(
      data.map(async item => ({
        key: item.id,
        userName: item.name,
        ID: item.ID,
      })),
    )

    const accountAdmin = await this.controller.get<any>({ url: "http://localhost:5000" + `/admin` })
    const modifiedAdminData = await Promise.all(
      accountAdmin.map(async item => ({
        key: item.id,
        adminName: item.adminName,
      })),
    )
    // console.log(modifiedAdminData)
    const mergedData = []

    modifiedData.forEach(obj => {
      const objKey = obj.key

      const adminObj = modifiedAdminData.find(item => item.key === objKey)
      // console.log("key", adminObj)

      if (adminObj) {
        mergedData.push({ ...obj, ...adminObj })
      }
    })

    // const combinedData = [modifiedData, modifiedAdminData]
    // console.log(combinedData, "come")
    return mergedData as any
  }

  async postAccountList(modalData) {
    return (await this.controller.post({ url: "http://localhost:5000" + `/account`, body: modalData })) as any
  }

  async deleteAccountList(id: number) {
    return (await this.controller.delete({ url: "http://localhost:5000" + `/account/${id}` })) as any
  }

  //----------------------------------------------------------------------------------------
  async deleteDetail(end: string, id: number) {
    return (await this.controller.delete({ url: "http://localhost:5000" + `/${end}/${id}` })) as any
  }
  //----------------------------------------------------------------------------------------
  // user - index.tsx 파일
  async getUserList() {
    return (await this.controller.get({ url: "http://localhost:5000" + "/user" })) as any
  }

  async deleteUserInfo(userId: React.Key) {
    return (await this.controller.delete({ url: "http://localhost:5000" + `/user/${userId}` })) as any
  }

  // user - [id].tsx 파일
  async getUserDetailInfo(id?: React.Key) {
    return (await this.controller.get({ url: "http://localhost:5000" + `/user?userId=${id}` })) as any
  }

  async getUserDetailById(id?: React.Key) {
    return (await this.controller.get({ url: "http://localhost:5000" + `/user?id=${id}` })) as any
  }

  async getUserDetailsByIds(ids?: React.Key[]) {
    const userInfos = await Promise.all(
      ids.map(id => {
        return this.getUserDetailById(id)
      }),
    )

    return userInfos as any
  }

  async getUserInfoById(id?: React.Key) {
    const data = await this.controller.get({ url: "http://localhost:5000" + `/user?id=${id}` })
    return data[0] as any
  }

  async getUserInfosByIds(ids?: React.Key[]) {
    const userInfos = await Promise.all(
      ids.map(id => {
        return this.getUserInfoById(id)
      }),
    )

    return userInfos as any
  }

  async getUserNameById(id?: React.Key) {
    const data = await this.controller.get({ url: "http://localhost:5000" + `/user?id=${id}` })
    return data[0].name as any
  }

  async getUserNamesByIds(ids?: React.Key[]) {
    const names = await Promise.all(
      ids.map(id => {
        return this.getUserNameById(id)
      }),
    )

    return names as any
  }
  //----------------------------------------------------------------------------------------

  async getCustomDetail(id?: React.Key) {
    return (await this.controller.get({ url: "http://localhost:5000" + `/custom?userId=${id}` })) as any
  }

  async getUserActive(id: number) {
    return (await this.controller.get({ url: "http://localhost:5000" + `/user?userId=${id}` })) as any
  }

  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  // team - index.tsx 파일
  async getTeamList() {
    return (await this.controller.get({ url: "http://localhost:5000" + `/team` })) as any
  }

  async deleteTeamInfo(id: React.Key) {
    return (await this.controller.delete({ url: "http://localhost:5000" + `/team/${id}` })) as any
  }

  // team - [id].tsx 파일
  async getTeamDetailInfo(id?: React.Key) {
    return (await this.controller.get({ url: "http://localhost:5000" + `/team?id=${id}` })) as any
  }

  async getTeamDetailById(id?: React.Key) {
    return (await this.controller.get({ url: "http://localhost:5000" + `/team?id=${id}` })) as any
  }

  async getTeamInfoById(id?: React.Key) {
    const data = await this.controller.get({ url: "http://localhost:5000" + `/team?id=${id}` })
    return data[0] as any
  }

  async getTeamInfosByIds(ids?: React.Key[]) {
    const teamInfos = await Promise.all(
      ids.map(id => {
        return this.getTeamInfoById(id)
      }),
    )
    return teamInfos
  }

  //---------------------------------------------------------------------------
  async getProjectList() {
    return (await this.controller.get({ url: "http://localhost:5000" + "/project" })) as any
  }

  async getProjectDetail(id?: React.Key) {
    return (await this.controller.get({ url: "http://localhost:5000" + `/project?userId=${id}` })) as any
  }

  async getProjectDetailById(id?: React.Key) {
    return (await this.controller.get({ url: "http://localhost:5000" + `/project?id=${id}` })) as any
  }

  async getProjectInfoById(id?: React.Key) {
    const data = await this.controller.get({ url: "http://localhost:5000" + `/project?id=${id}` })
    return data[0]
  }

  async getProjectInfosByIds(ids?: React.Key[]) {
    const projectInfos = await Promise.all(
      ids.map(id => {
        return this.getProjectInfoById(id)
      }),
    )

    return projectInfos as any
  }

  async deleteProjectInfo(id?: React.Key) {
    return (await this.controller.delete({ url: "http://localhost:5000" + `/project/${id}` })) as any
  }

  async getProjectNameById(id?: React.Key) {
    const data = await this.controller.get({ url: "http://localhost:5000" + `/project?id=${id}` })

    return data[0].name as any
  }

  async getProjectNamesByIds(ids?: React.Key[]) {
    const names = await Promise.all(
      ids.map(id => {
        return this.getProjectNameById(id)
      }),
    )

    return names as any
  }

  async setProjectInfoById(id?: React.Key, body?: object) {
    console.log(id, body)
    return (await this.controller.patch({ url: "http://localhost:5000" + `/project/${id}`, body: { ...body } })) as any
  }

  //---------------------------------------------------------------------------
  async getCustom() {
    return (await this.controller.get<DefaultDataDtoRes[]>({ url: "http://localhost:5000" + "/custom" })) as any
  }

  async getCustomDetailById(id?: React.Key) {
    return (await this.controller.get<DefaultDataDtoRes[]>({
      url: "http://localhost:5000" + `/custom?id=${id}`,
    })) as any
  }

  async getCustomInfoById(id?: React.Key) {
    const data = await this.controller.get<DefaultDataDtoRes[]>({ url: "http://localhost:5000" + `/custom?id=${id}` })
    return data[0] as any
  }

  async getCutomInfosByIds(ids?: React.Key[]) {
    const customInfos = await Promise.all(
      ids.map(id => {
        return this.getCustomInfoById(id)
      }),
    )

    return customInfos as any
  }

  async deleteCustomById(id?: React.Key) {
    return (await this.controller.delete({ url: "http://localhost:5000" + `/custom/${id}` })) as any
  }

  async setCustomInfoById(id?: React.Key, body?: object) {
    console.log(id, body)
    return (await this.controller.patch({ url: "http://localhost:5000" + `/custom/${id}`, body: { ...body } })) as any
  }

  //---------------------------------------------------------------------------
  async getTool() {
    return (await this.controller.get<DefaultDataDtoRes[]>({ url: "http://localhost:5000" + "/tool" })) as any
  }

  async getToolDetailById(id?: React.Key) {
    return (await this.controller.get<DefaultDataDtoRes>({ url: "http://localhost:5000" + `/tool?id=${id}` })) as any
  }

  async getToolDetailsByIds(ids?: React.Key[]) {
    const toolDetails = await Promise.all(
      ids.map(id => {
        return this.getToolDetailById(id)
      }),
    )

    return toolDetails as any
  }

  async getToolInfoById(id?: React.Key) {
    const data = await this.controller.get<DefaultDataDtoRes>({ url: "http://localhost:5000" + `tool?id=${id}` })
    return data[0] as any
  }

  async getToolInfosByIds(ids?: React.Key[]) {
    const toolInfos = await Promise.all(
      ids.map(id => {
        return this.getToolInfoById(id)
      }),
    )

    return toolInfos as any
  }

  async deleteToolById(id?: React.Key) {
    return (await this.controller.delete({ url: "http://localhost:5000" + `/tool/${id}` })) as any
  }

  async setToolInfoById(id?: React.Key, body?: object) {
    console.log(id, body)
    return (await this.controller.patch({ url: "http://localhost:5000" + `/tool/${id}`, body: { ...body } })) as any
  }

  //---------------------------------------------------------------------------
  async getOrder() {
    return (await this.controller.get<DefaultDataDtoRes[]>({ url: "http://localhost:5000" + "/order" })) as any
  }

  async getOrderDetailById(id?: React.Key) {
    return (await this.controller.get<DefaultDataDtoRes>({ url: "http://localhost:5000" + `/order?id=${id}` })) as any
  }

  async deleteOrderById(id?: React.Key) {
    return (await this.controller.delete({ url: "http://localhost:5000" + `/order/${id}` })) as any
  }

  async getOrderInfoById(id?: React.Key) {
    const data = await this.controller.get<DefaultDataDtoRes>({ url: "http://localhost:5000" + `/order?id=${id}` })
    return data[0] as any
  }
  async getOrderInfosByIds(ids?: React.Key[]) {
    const orderInfos = await Promise.all(
      ids.map(id => {
        return this.getOrderInfoById(id)
      }),
    )

    return orderInfos as any
  }

  async setOrderInfoById(id?: React.Key, body?: object) {
    console.log(id, body)
    return (await this.controller.patch({ url: "http://localhost:5000" + `/order/${id}`, body: { ...body } })) as any
  }

  async addOrderInfo(body?: object) {
    console.log(body)
    return (await this.controller.post({ url: "http://localhost:5000" + "/order", body: { ...body } })) as any
  }

  //---------------------------------------------------------------------------
  async getPurchase() {
    return (await this.controller.get<DefaultDataDtoRes>({ url: "http://localhost:5000" + "/purchase" })) as any
  }

  async getPurchaseDetailById(id?: React.Key) {
    return (await this.controller.get<DefaultDataDtoRes>({
      url: "http://localhost:5000" + `/purchase?id=${id}`,
    })) as any
  }

  async deletePurchaseById(id?: React.Key) {
    return (await this.controller.delete({ url: "http://localhost:5000" + `/purchase/${id}` })) as any
  }

  async setPurchaseInfoById(id?: React.Key, body?: object) {
    console.log(id, body)
    return (await this.controller.patch({ url: "http://localhost:5000" + `/purchase/${id}`, body: { ...body } })) as any
  }

  //---------------------------------------------------------------------------
  async getShip() {
    return (await this.controller.get<DefaultDataDtoRes>({ url: "http://localhost:5000" + "/ship" })) as any
  }

  async getShipDetailById(id?: React.Key) {
    return (await this.controller.get<DefaultDataDtoRes>({ url: "http://localhost:5000" + `/ship?id=${id}` })) as any
  }

  async deleteShipById(id?: React.Key) {
    return (await this.controller.delete({ url: "http://localhost:5000" + `/ship/${id}` })) as any
  }

  async setShipInfoById(id?: React.Key, body?: object) {
    console.log(id, body)
    return (await this.controller.patch({ url: "http://localhost:5000" + `/ship/${id}`, body: { ...body } })) as any
  }

  //---------------------------------------------------------------------------
  // async getQuestion () => {
  //   return await this.controller.get<DefaultDataDtoRes>({ url: "http://localhost:5000" + "/question" })
  // },

  // async getQuestionDetailById (id?: React.Key) => {
  //   // 결과 1개
  //   return await this.controller.get<DefaultDataDtoRes>({ url: "http://localhost:5000" + `/question?id=${id}` })
  // },

  // async deleteQuestionById (id?: React.Key) => {
  //   //console.log("deleteQuestionById: Id = ", id)
  //   return await this.controller.delete({ url: "http://localhost:5000" + `/question/${id}` })
  // },

  // async setQuestionInfoById (id?: React.Key, body?: object) => {
  //   console.log(id, body)
  //   return await this.controller.patch({ url: "http://localhost:5000" + `/question/${id}`, body: { ...body } })
  // },

  //---------------------------------------------------------------------------
  async getProjectModal() {
    return (await this.controller.get<DefaultDataDtoRes[]>({ url: "http://localhost:5000" + "/projectModal" })) as any
  }

  //---------------------------------------------------------------------------
  async getShipmentDetail(userId?: React.Key) {
    return (await this.controller.get({ url: "http://localhost:5000" + `/shipment?userId=${userId}` })) as any
  }
  //
  async getShipmentDetailById(id: React.Key) {
    const data = await this.controller.get<any>({ url: "http://localhost:5000" + `/shipment?id=${id}` })
    const modifiedData = await data.map(item => ({
      id: item.id,
      shipName: item.shipName,
      deleteShip: "배송지 삭제",
      name: item.name,
      phone: item.phone,
      address: item.address,
      portNum: item.portNum,
      detailAddress: item.detailAddress,
    }))

    return modifiedData as any
  }

  async getShipmentInfobyId(id: React.Key) {
    const data = await this.controller.get<DefaultDataDtoRes>({ url: "http://localhost:5000" + `/shipment?id=${id}` })
    return data[0] as any
  }

  async getShipmentInfosByIds(ids: React.Key[]) {
    const shipmentInfos = await Promise.all(
      ids.map(id => {
        return this.getShipmentInfobyId(id)
      }),
    )

    return shipmentInfos as any
  }

  async deleteShipmentInfo(id: number) {
    return (await this.controller.delete({ url: "http://localhost:5000" + `/shipment/${id}` })) as any
  }

  async setShipmentInfoById(id?: React.Key, body?: object) {
    console.log(id, body)
    return (await this.controller.patch({ url: "http://localhost:5000" + `/shipment/${id}`, body: { ...body } })) as any
  }
  //---------------------------------------------------------------------------
  async getPayDetail(userId?: React.Key) {
    return (await this.controller.get({ url: "http://localhost:5000" + `/payment?userId=${userId}` })) as any
  }

  async getPayDetailById(id: number) {
    const data = await this.controller.get<any>({ url: "http://localhost:5000" + `/payment?id=${id}` })
    const modifiedData = await data.map(item => ({
      id: item.id,
      No: item.id,
      cardName: item.cardName,
      cardNum: item.cardNum,
    }))

    return modifiedData as any
  }

  async getPayInfoById(id: React.Key) {
    const data = await this.controller.get({ url: "http://localhost:5000" + `/payment?id=${id}` })

    return data[0] as any
  }

  async getPayInfosByIds(ids: React.Key[]) {
    const payInfos = await Promise.all(
      ids.map(id => {
        return this.getPayInfoById(id)
      }),
    )

    return payInfos as any
  }
}

//----------------------------------------------------------------------------------------
/*
  async getTableInfo (route?: string) => {
    return await this.controller.get<PageInfoDtoRes>({ url: "http://localhost:5000" + `/${route}` })
  },

  async getDetailInfo (route?: string, key?: React.Key) => {
    const rawData = await this.controller.get<PageInfoDtoRes>({ url: "http://localhost:5000" + `/${route}` })
    const data = plainToClass(PageInfoDtoRes, rawData)
    const detailDatas = data.data
    //console.log(Object.keys(detailDatas))
    const idx = Object.keys(detailDatas).find(index => detailDatas[Number(index)].id == key)
    console.log(idx)

    return detailDatas[Number(idx)]
  },
  */
//----------------------------------------------------------------------------------------
/*
  '---ByID' : id로 검색(id - primaryKey => 반환값 무조건 하나) - 형태는 다른 GET과 마찬가지로 [] / length 무조건 0 / 1
  
  */
//----------------------------------------------------------------------------------------
