import { AxiosController } from "./api.controller"

import { createStaticClass } from "utils"
import { GetServerSidePropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import { UserApi } from "./concept/user.api"
// import { JsonApi } from "./concept/json.api"
import { AlarmApi } from "./concept/alarm.api"
import { PaymentApi } from "./concept/payment.api"
import { BlockApi } from "./concept/block.api"
import { ContactApi } from "./concept/contact.api"
import { FaqApi } from "./concept/faq.api"
import { FeatureApi } from "./concept/feature.api"
import { LayoutApi } from "./concept/layout.api"
import { LogicApi } from "./concept/logic.api"
import { NoticeApi } from "./concept/notice.api"
import { PartApi } from "./concept/part.api"
import { OrderApi } from "./concept/order.api"
import { ProjectApi } from "./concept/project.api"
import { ResultApi } from "./concept/result.api"
import { SearchApi } from "./concept/search.api"
import { TeamApi } from "./concept/team.api"
// import { teamApiCallerTemp } from "./team.api.caller.temp"

// import nextCookies from "next-cookies"
// import Cookies from "js-cookie"
// import type { GetServerSidePropsContext } from "next"

class ApiManager extends createStaticClass<ApiManager>() {
  private controller = new AxiosController()

  private context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null

  private userApiInstance: UserApi | null = null
  private alarmApiInstance: AlarmApi | null = null
  private paymentApiInstance: PaymentApi | null = null
  private blockApiInstance: BlockApi | null = null
  private contactApiInstance: ContactApi | null = null
  private faqApiInstance: FaqApi | null = null
  private featureApiInstance: FeatureApi | null = null
  private layoutApiInstance: LayoutApi | null = null
  private logicApiInstance: LogicApi | null = null
  private noticeApiInstance: NoticeApi | null = null
  private orderApiInstance: OrderApi | null = null
  private partApiInstance: PartApi | null = null
  private projectApiInstance: ProjectApi | null = null
  private resultApiInstance: ResultApi | null = null
  private searchApiInstance: SearchApi | null = null
  private teamApiInstance: TeamApi | null = null

  updateContext(ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null) {
    this.context = ctx

    this.controller.updateAxios(ctx)

    this.resetApiInstances()

    return this
  }

  private resetApiInstances() {
    this.userApiInstance = null
    this.alarmApiInstance = null
    this.paymentApiInstance = null
    this.blockApiInstance = null
    this.contactApiInstance = null
    this.faqApiInstance = null
    this.featureApiInstance = null
    this.layoutApiInstance = null
    this.logicApiInstance = null
    this.noticeApiInstance = null
    this.orderApiInstance = null
    this.partApiInstance = null
    this.projectApiInstance = null
    this.resultApiInstance = null
    this.searchApiInstance = null
    this.teamApiInstance = null
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

  get userApi() {
    if (!this.userApiInstance) {
      this.userApiInstance = new UserApi(this.controller)
    }
    return this.userApiInstance
  }

  get alarmApi() {
    if (!this.alarmApiInstance) {
      this.alarmApiInstance = new AlarmApi(this.controller)
    }
    return this.alarmApiInstance
  }

  get paymentApi() {
    if (!this.paymentApiInstance) {
      this.paymentApiInstance = new PaymentApi(this.controller)
    }
    return this.paymentApiInstance
  }

  get blockApi() {
    if (!this.blockApiInstance) {
      this.blockApiInstance = new BlockApi(this.controller)
    }
    return this.blockApiInstance
  }

  get contactApi() {
    if (!this.contactApiInstance) {
      this.contactApiInstance = new ContactApi(this.controller)
    }
    return this.contactApiInstance
  }

  get faqApi() {
    if (!this.faqApiInstance) {
      this.faqApiInstance = new FaqApi(this.controller)
    }
    return this.faqApiInstance
  }

  get featureApi() {
    if (!this.featureApiInstance) {
      this.featureApiInstance = new FeatureApi(this.controller)
    }
    return this.featureApiInstance
  }

  get layoutApi() {
    if (!this.layoutApiInstance) {
      this.layoutApiInstance = new LayoutApi(this.controller)
    }
    return this.layoutApiInstance
  }

  get logicApi() {
    if (!this.logicApiInstance) {
      this.logicApiInstance = new LogicApi(this.controller)
    }
    return this.logicApiInstance
  }

  get noticeApi() {
    if (!this.noticeApiInstance) {
      this.noticeApiInstance = new NoticeApi(this.controller)
    }
    return this.noticeApiInstance
  }

  get orderApi() {
    if (!this.orderApiInstance) {
      this.orderApiInstance = new OrderApi(this.controller)
    }
    return this.orderApiInstance
  }

  get partApi() {
    if (!this.partApiInstance) {
      this.partApiInstance = new PartApi(this.controller)
    }
    return this.partApiInstance
  }

  get projectApi() {
    if (!this.projectApiInstance) {
      this.projectApiInstance = new ProjectApi(this.controller)
    }
    return this.projectApiInstance
  }

  get resultApi() {
    if (!this.resultApiInstance) {
      this.resultApiInstance = new ResultApi(this.controller)
    }
    return this.resultApiInstance
  }

  get searchApi() {
    if (!this.searchApiInstance) {
      this.searchApiInstance = new SearchApi(this.controller)
    }
    return this.searchApiInstance
  }

  get teamApi() {
    if (!this.teamApiInstance) {
      this.teamApiInstance = new TeamApi(this.controller)
    }
    return this.teamApiInstance
  }
}

export const apiManager = ApiManager.instance
