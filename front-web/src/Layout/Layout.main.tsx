import { useRouter } from "next/router"
import { Header } from "./Header.main"
import { StepNavigation } from "./StepNavigation"
import { Col } from "antd"
import styles from "./Layout.module.scss"
import { ILayotMainProps } from "type"
// import { useAsyncEffect, useToast } from "hooks"
// import { apiManager, apiUtil } from "apis"
// import { MODIFIED_STEP } from "@const/project.const"

export const LayoutMain = ({ children }: ILayotMainProps) => {
  const router = useRouter()
  // const path = router.pathname.replace("/", "")
  // const pathname = path.includes("/") ? path.replace("/[id]", "") : path
  // const stepErrorToast = useToast()

  // useAsyncEffect(async () => {
  //   const response = await apiManager.projectApi.lastModified(Number(router.query.id))
  //   if (apiUtil.isErrorResponse(response)) {
  //     return response
  //   }
  //   // await stepErrorToast.onMessage({
  //   //   type: "error",
  //   //   content: `${MODIFIED_STEP[response.last_modified_step]} 단계를 먼저 완료해주세요.`,
  //   // })
  // }, [pathname])
  return (
    <Col className={styles.layout_main_container}>
      {/* {stepErrorToast.contextHolder} */}
      <Header />
      <StepNavigation />
      <div
        style={{
          paddingTop: "60px",
          width: "100%",
        }}
      >
        {children}
      </div>
    </Col>
  )
}
