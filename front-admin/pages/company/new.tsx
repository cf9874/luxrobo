import { PageFrameFooter } from "@/components/layout"
import { COMPANYNEW, ERROR_MSG } from "@/const"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import styles from "./companyNew.module.scss"
import {
  CompanyNewDesc,
  CompanyNewDescBType,
  CompanyNewDescDetail,
  CompanyNewNullData,
} from "@/components/pages/company/newDesc"
import { useAsyncEffect } from "@/hooks"
import { BasicInputArea } from "@/components/Input"
import { FileButton } from "@/components/Button"
import { Divider, Image } from "antd"
import { apiManager, apiUtil } from "@/apis"
import { JSONFormChecker } from "@/utils"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import { CompanyDto } from "@/apis/dto"
import { ObjectDescription } from "@/components/Description"
import { API_ERROR_MSG } from "@/const/api.error.const"

//------------------------------------------------------------------------------------------------------
// [Main]
export const NewCompanyPage: NextPage = () => {
  const router = useRouter()
  //-------------------------------------------------------------------------
  // [Datas]
  const [companyDataA, setCompanyDataA] = useState<CompanyDto>(CompanyNewNullData)

  const [companyDataB, setCompanyDataB] = useState<CompanyNewDescBType>({
    rawData: (() => {
      const { companyID, image, ...companyRawData } = CompanyNewNullData
      return JSON.stringify(companyRawData, null, 4)
    })(),
  })

  const [thumbNail, setThumbNail] = useState<File>(null)
  const [thumbNailURL, setThumbNailURL] = useState<string>(null)
  //-------------------------------------------------------------------------
  // 초기화
  useAsyncEffect(async () => {}, [])

  //
  useAsyncEffect(async () => {
    if (!companyDataB) return
    if (!JSONFormChecker(companyDataB.rawData)) return

    // JSON 형태 변환 가능 시 -> DescA(CompanyDto) 초기화
    setCompanyDataA({
      companyID: companyDataA.companyID,
      image: companyDataA.image,
      ...JSON.parse(companyDataB.rawData),
    })
  }, [companyDataB])
  //-------------------------------------------------------------------------
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]

    if (file) {
      setThumbNail(file)
      setThumbNailURL(URL.createObjectURL(file))
    }
  }

  // [footer Handler]
  const saveHandler = async () => {
    console.log("Save: companyNew")
    if (!JSONFormChecker(companyDataB.rawData)) {
      alert(ERROR_MSG.WRONGINPUT)
      return
    }

    const companyNew = {
      raw_data: JSON.stringify(JSON.parse(companyDataB.rawData)),
      company_image: thumbNail,
    }
    console.log("companyNew", companyNew)

    const res = apiManager.companyApi.createCompany(companyNew)
    if (apiUtil.isErrorResponse(res)) {
      if (apiUtil.signChecker(res)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(res.message)
      return
    }

    router.push("/company")
  }

  const cancelHandler = () => {
    console.log("Cancel: companyNew")
    router.push("/company")
  }

  //-------------------------------------------------------------------------
  // [Content Render]
  const CompanyRender = ({ key, pm_value }) => {
    switch (key) {
      // desc A
      case "image":
        return (
          <div className={styles.descA_image_wrapper}>
            {thumbNail ? (
              <Image src={thumbNailURL} alt={"ThumbNail"} preview={false} className={styles.descA_image_image}></Image>
            ) : (
              <></>
            )}
            <FileButton option={"image"} handleFile={handleFile} className={styles.descA_image_button}>
              이미지 교체
            </FileButton>
          </div>
        )
      case "webpage":
        return <a href={pm_value}>{pm_value}</a>
      case "eMail":
        return <a href={`mailto:${pm_value}`}>{pm_value}</a>
      // desc B
      case "rawData":
        return (
          <div className={styles.descB_rawData_wrapper}>
            <BasicInputArea
              option={"big"}
              value={pm_value}
              onChange={e => setCompanyDataB({ ...companyDataB, [key]: e.target.value })}
            ></BasicInputArea>
            {JSONFormChecker(pm_value) ? (
              <div className={styles.descB_rawData_formCheck_wrapper}>
                <CheckOutlined className={`${styles.descB_rawData_formCheck} ${styles.descB_rawData_formCheck_true}`} />
              </div>
            ) : (
              <div className={styles.descB_rawData_formCheck_wrapper}>
                파일 형식이 맞지 않습니다.{" "}
                <CloseOutlined
                  className={`${styles.descB_rawData_formCheck} ${styles.descB_rawData_formCheck_false}`}
                />
              </div>
            )}
          </div>
        )
      default:
        if (typeof pm_value === "object" && !Array.isArray(pm_value) && pm_value !== null)
          return <div>{JSON.stringify(pm_value)}</div>
        return <div>{pm_value}</div>
    }
  }
  //-------------------------------------------------------------------------
  // [UI 출력]
  return (
    <PageFrameFooter titleKey={COMPANYNEW} handler={{ saveHandler: saveHandler, cancelHandler: cancelHandler }}>
      <>
        <div className={styles.container}>
          <>
            <ObjectDescription
              descInfo={CompanyNewDesc.descA}
              descDetails={CompanyNewDescDetail}
              data={companyDataA}
              render={CompanyRender}
            ></ObjectDescription>
          </>
          <Divider></Divider>
          <>
            <ObjectDescription
              descInfo={CompanyNewDesc.descB}
              descDetails={CompanyNewDescDetail}
              data={companyDataB}
              render={CompanyRender}
            ></ObjectDescription>
          </>
          <Divider></Divider>
        </div>
      </>
    </PageFrameFooter>
  )
}

export default NewCompanyPage
