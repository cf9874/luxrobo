import { createStaticClass } from "@/utils"
import { AxiosController } from "./api.controller"
import { GetServerSidePropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import {
  AccountApi,
  AdminApi,
  CompanyApi,
  ContactApi,
  CustomblockApi,
  OrderApi,
  PartApi,
  ProjectApi,
  ShippingApi,
  TeamApi,
  UserApi,
} from "./concept"
import { JsonAPi } from "./concept/json.api"

export class ApiManager extends createStaticClass<ApiManager>() {
  private controller = new AxiosController()

  private context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null

  private adminApiInstance: AdminApi | null = null
  private accountApiInstance: AccountApi | null = null
  private userApiInstance: UserApi | null = null
  private teamApiInstance: TeamApi | null = null
  private projectApiInstance: ProjectApi | null = null
  private customblockApiInstance: CustomblockApi | null = null
  private partApiInstance: PartApi | null = null
  private companyApiInstance: CompanyApi | null = null
  private orderApiInstance: OrderApi | null = null
  private shippingApiInstance: ShippingApi | null = null
  private contactApiInstance: ContactApi | null = null
  private jsonApiInstance: JsonAPi | null = null

  // updateContext(ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null) {
  //   this.context = ctx

  //   this.controller.updateAxios(ctx)

  //   return this
  // }

  private resetApiInstances() {
    this.adminApiInstance = null
    this.accountApiInstance = null
    this.userApiInstance = null
    this.teamApiInstance = null
    this.projectApiInstance = null
    this.customblockApiInstance = null
    this.partApiInstance = null
    this.companyApiInstance = null
    this.orderApiInstance = null
    this.shippingApiInstance = null
    this.contactApiInstance = null
  }

  getContext() {
    return this.context
  }

  resetContext() {
    this.context = null

    return this.controller
  }

  getController() {
    return this.controller
  }

  //권한(관리자) - /admins/auth
  get authApi() {
    if (!this.adminApiInstance) {
      this.adminApiInstance = new AdminApi(this.controller)
    }
    return this.adminApiInstance
  }

  //계정(관리자) - /admins
  get adminsApi() {
    if (!this.accountApiInstance) {
      this.accountApiInstance = new AccountApi(this.controller)
    }
    return this.accountApiInstance
  }

  //사용자 - user
  get userApi() {
    if (!this.userApiInstance) {
      this.userApiInstance = new UserApi(this.controller)
    }

    return this.userApiInstance
  }

  //팀 - team
  get teamApi() {
    if (!this.teamApiInstance) {
      this.teamApiInstance = new TeamApi(this.controller)
    }

    return this.teamApiInstance
  }

  //프로젝트 - projet
  get projectApi() {
    if (!this.projectApiInstance) {
      this.projectApiInstance = new ProjectApi(this.controller)
    }

    return this.projectApiInstance
  }

  //커스텀블록 - customblock
  get customblockApi() {
    if (!this.customblockApiInstance) {
      this.customblockApiInstance = new CustomblockApi(this.controller)
    }

    return this.customblockApiInstance
  }

  //부품 - part
  get partApi() {
    if (!this.partApiInstance) {
      this.partApiInstance = new PartApi(this.controller)
    }

    return this.partApiInstance
  }

  //발주처 - company
  get companyApi() {
    if (!this.companyApiInstance) {
      this.companyApiInstance = new CompanyApi(this.controller)
    }

    return this.companyApiInstance
  }

  // 주문 - order
  get orderApi() {
    if (!this.orderApiInstance) {
      this.orderApiInstance = new OrderApi(this.controller)
    }

    return this.orderApiInstance
  }
  get jsonApi() {
    if (!this.jsonApiInstance) {
      this.jsonApiInstance = new JsonAPi(this.controller)
    }

    return this.jsonApiInstance
  }

  // 배송 - shipping
  get shippingApi() {
    if (!this.shippingApiInstance) {
      this.shippingApiInstance = new ShippingApi(this.controller)
    }

    return this.shippingApiInstance
  }

  // 문의 - contact
  get contactApi() {
    if (!this.contactApiInstance) {
      this.contactApiInstance = new ContactApi(this.controller)
    }

    return this.contactApiInstance
  }
}

export const apiManager = ApiManager.instance
