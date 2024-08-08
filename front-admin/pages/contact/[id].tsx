import { NextPage } from "next"
import { useAsyncEffect } from "@/hooks"
import { useState } from "react"
import { useRouter } from "next/router"
import styles from "./contactDetail.module.scss"
import { PageFrameFooter } from "@/components/layout"
import { QuestionCategorySelection } from "@/components/Select"
import { ContactDescDetail, ContactDesc } from "@/components/pages/contact/contactDesc"
import { BasicInputArea } from "@/components/Input"
import { CONTACTDETAIL } from "@/const"
import { apiManager, apiUtil } from "@/apis"
import { ContactDto } from "@/apis/dto"
import { API_ERROR_MSG } from "@/const/api.error.const"
import { Divider } from "antd"
import { ObjectDescription } from "@/components/Description"

//------------------------------------------------------------------------------------------------------
// [Main]
const QuestionDetail: NextPage = () => {
  const router = useRouter()

  //-------------------------------------------------------------------------
  // [Datas]
  const [contactID, setContactID] = useState<number>(undefined)

  // (Description A)
  const [contactDataA, setContactDataA] = useState<ContactDto>(undefined)

  //-------------------------------------------------------------------------
  // 초기화
  useAsyncEffect(async () => {
    if (!router.query.id) return

    // set contactID
    setContactID(Number(router.query.id))

    // set DescA Data
    const contactResponse = await apiManager.contactApi.getContact(Number(router.query.id))

    // console.log(contactResponse)
    if (apiUtil.isErrorResponse(contactResponse)) {
      if (apiUtil.signChecker(contactResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }

      alert(contactResponse.message)
      return
    }

    setContactDataA(contactResponse)
  }, [router.query.id])

  //------------------------------------------------------------------------------------------------------
  // [footer Handler]
  const saveHandler = async () => {
    console.log("save: Contact")
    console.log("contactID", contactID)

    const contactEdit = {
      content: contactDataA.content,
      phone_number: contactDataA.phone_number,
      reply: contactDataA.reply,
      tag: contactDataA.tag,
      title: contactDataA.title,
      writer: contactDataA.writer,
    }
    console.log("contactEdit", contactEdit)

    const res = apiManager.contactApi.editContact(contactID, contactEdit)
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

    // console.log("success")
    router.push("/contact")
  }

  const cancelHandler = () => {
    console.log("Cancel: Contact")
    router.push("/contact")
  }

  //-------------------------------------------------------------------------
  // [Content Render]
  const ContactRender = ({ key, pm_value }) => {
    switch (key) {
      case "tag":
        return (
          <>
            <QuestionCategorySelection
              value={pm_value}
              onChange={change => setContactDataA({ ...contactDataA, [key]: change })}
            ></QuestionCategorySelection>
          </>
        )
      case "content":
      case "reply":
        return (
          <>
            <BasicInputArea
              option={"middle"}
              value={pm_value}
              onChange={e => setContactDataA({ ...contactDataA, [key]: e.target.value })}
            ></BasicInputArea>
          </>
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
    <PageFrameFooter
      titleKey={CONTACTDETAIL}
      handler={{
        saveHandler: saveHandler,
        cancelHandler: cancelHandler,
      }}
    >
      <div className={styles.container}>
        <ObjectDescription
          descInfo={ContactDesc.descA}
          descDetails={ContactDescDetail}
          data={contactDataA}
          render={ContactRender}
        ></ObjectDescription>
        <Divider></Divider>
      </div>
    </PageFrameFooter>
  )
}

export default QuestionDetail
