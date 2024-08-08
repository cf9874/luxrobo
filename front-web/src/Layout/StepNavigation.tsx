import styles from "./Layout.module.scss"
import { useRouter } from "next/router"
import Image from "next/image"
import { useState } from "react"
import { Space } from "antd"
import { DownOutlined } from "@ant-design/icons"
import { imgAsset } from "@assets/image"
import { stepNavigationMenuJson } from "json"
// import { apiManager, apiUtil } from "apis"
// import { MODIFIED_STEP } from "@const/project.const"
// import { useToast } from "hooks"

export const StepNavigation = () => {
  const router = useRouter()
  const path = router.pathname.replace("/", "")
  const pathname = path.includes("/") ? path.replace("/[id]", "") : path
  const [selectNav, setSelectNav] = useState(pathname)
  // const stepErrorToast = useToast()
  return (
    <div className={styles.nav_container}>
      <div className={styles.nav_box}>
        {stepNavigationMenuJson?.map((nav, i) => {
          const title = nav.title.toLocaleLowerCase()

          return (
            <span key={title}>
              {/* {stepErrorToast.contextHolder} */}
              <Space
                direction="vertical"
                align="center"
                className={styles.nav}
                onClick={() => {
                  // const response = await apiManager.projectApi.lastModified(Number(router.query.id))
                  // if (apiUtil.isErrorResponse(response)) {
                  //   return response
                  // }
                  // if (response.last_modified_step >= MODIFIED_STEP[title as keyof typeof MODIFIED_STEP]) {
                  setSelectNav(title)
                  if (title.toLocaleLowerCase() === "order" || title.toLocaleLowerCase() === "result") {
                    console.log(4141, router.query.id)
                    void router.push(`/${title}/id/?id=${Number(router.query.id)}`)
                  } else {
                    void router.push(`/${title}/${Number(router.query.id)}`)
                  }
                  // } else {
                  //   await stepErrorToast.onMessage({
                  //     type: "error",
                  //     content: `${MODIFIED_STEP[response.last_modified_step]} 단계를 먼저 완료해주세요.`,
                  //   })
                  // }
                }}
              >
                <div className={styles.nav_image}>
                  <Image
                    src={imgAsset[title === selectNav ? nav.imgFileName.active : nav.imgFileName.inactive]}
                    alt={title}
                    className={styles.nav_image}
                    width={24}
                    height={24}
                  />
                </div>
                <p
                  className={styles.nav_title}
                  style={{
                    color: title === selectNav ? "#45d6df" : "#4c4c4c",
                    textDecoration: title === selectNav ? "underline" : "none",
                  }}
                >
                  {title}
                </p>
              </Space>
              {i !== stepNavigationMenuJson.length - 1 ? (
                <div className={styles.next_icon}>
                  <DownOutlined className={styles.icon} />
                </div>
              ) : null}
            </span>
          )
        })}
      </div>
    </div>
  )
}
