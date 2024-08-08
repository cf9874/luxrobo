import { useState } from "react"
import { BasicButton } from "../Button"
import { Modal } from "antd"
import styles from "./projectAlarmModal.module.scss"
import { useAsyncEffect } from "@/hooks"
import { apiManager, apiUtil } from "@/apis"
import { useRouter } from "next/router"
import { API_ERROR_MSG } from "@/const/api.error.const"

export const ProjectAlarmModal = ({ projectID }: { projectID: number }) => {
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alarmList, setAlarmList] = useState<string[]>([])

  useAsyncEffect(async () => {}, [])

  const showModal = async () => {
    const projectAlarmResponse = await apiManager.projectApi.getProjectLog(projectID)
    if (apiUtil.isErrorResponse(projectAlarmResponse)) {
      if (apiUtil.signChecker(projectAlarmResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
      }
      alert(projectAlarmResponse.message)
      return
    }

    setAlarmList(projectAlarmResponse)
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setAlarmList([])
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setAlarmList([])
    setIsModalOpen(false)
  }

  const copyText = text => {
    console.log(text)
    window.navigator.clipboard.writeText(text)
  }

  return (
    <>
      <BasicButton onClick={showModal}>알람 로그 조회</BasicButton>
      <Modal
        width={600}
        open={isModalOpen}
        title={<h3 className={styles.modalTitle}>프로젝트 알람</h3>}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={_ => (
          <>
            <div className={styles.projetAlarm_wrapper}>
              {alarmList.map((item, index) => (
                <div
                  className={styles.projectAlarm}
                  onClick={e => {
                    copyText(item)
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </>
        )}
      ></Modal>
    </>
  )
}

export default ProjectAlarmModal
