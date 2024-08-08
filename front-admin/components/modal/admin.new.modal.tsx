import { useAsyncEffect, useInputs } from "@/hooks"
import { Col, Modal, Row } from "antd"
import { CheckboxValueType } from "antd/es/checkbox/Group"
import { useState } from "react"
import styles from "@/components/modal/adminModal.module.scss"
import { BasicButton } from "../Button"
import { BasicInput } from "../Input"
import { BasicCheckBox, BasicCheckBoxGroup } from "../Checkbox"
import { AuthIndexType } from "../pages/admin/indexDesc"

export const AdminNewModal = ({
  id,
  adminList,
  setAdminList,
}: {
  id: number
  adminList: AuthIndexType[]
  setAdminList: React.Dispatch<React.SetStateAction<AuthIndexType[]>>
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  //
  const newKey = id
  const newAdminName = useInputs({ value: "" })
  const [authChecked, setAuthChecked] = useState<CheckboxValueType[]>([])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    newAdminName.onClear()
    setAuthChecked([])
    setIsModalOpen(false)
  }

  const onChange = (values: CheckboxValueType[]) => {
    setAuthChecked(values)
  }

  const saveHandler = async () => {
    if (newAdminName.value === "") {
      alert("권한명을 입력해 주십시오")
      return
    }
    if (newAdminName.value.toLowerCase() === "master") {
      alert("사용 불가능한 이름입니다!")
      return
    }

    const newAdminItem = {
      key: newKey,
      auth_ID: newKey,
      auth_name: newAdminName.value,
      auth_admin: false,
      auth_user: authChecked.includes("auth_user"),
      auth_team: authChecked.includes("auth_team"),
      auth_project: authChecked.includes("auth_project"),
      auth_customblock: authChecked.includes("auth_customblock"),
      auth_part: authChecked.includes("auth_part"),
      auth_company: authChecked.includes("auth_company"),
      auth_order: authChecked.includes("auth_order"),
      auth_contact: authChecked.includes("auth_contact"),
    } as AuthIndexType
    console.log("newAdminItem", newAdminItem)

    setAdminList([...adminList, newAdminItem])
    newAdminName.onClear()
    setAuthChecked([])
    setIsModalOpen(false)
  }

  useAsyncEffect(async () => {}, [])

  return (
    <>
      <BasicButton className={styles.openBtn} onClick={showModal}>
        신규 권한 추가
      </BasicButton>
      <Modal
        width={600}
        open={isModalOpen}
        title={<h3 className={styles.modalTitle}>신규 권한 추가</h3>}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={_ => (
          <>
            <div className={styles.adminModal_inputName_wrapper}>
              <BasicInput
                className={styles.adminModal_inputName}
                value={newAdminName.value}
                placeholder="권한 분류 명"
                onChange={newAdminName.onChange}
              />
            </div>
            <BasicCheckBoxGroup className={styles.adminModal_checkGroup} value={authChecked} onChange={onChange}>
              <Row>
                <Col span={6} className={styles.adminModal_checkGroup_item}>
                  <BasicCheckBox value="auth_user">사용자 관리</BasicCheckBox>
                </Col>
                <Col span={6} className={styles.adminModal_checkGroup_item}>
                  <BasicCheckBox value="auth_team">팀 관리</BasicCheckBox>
                </Col>
                <Col span={6} className={styles.adminModal_checkGroup_item}>
                  <BasicCheckBox value="auth_project">프로젝트 관리</BasicCheckBox>
                </Col>
                <Col span={6} className={styles.adminModal_checkGroup_item}>
                  <BasicCheckBox value="auth_customblock">커스텀 블록 관리</BasicCheckBox>
                </Col>
                <Col span={6} className={styles.adminModal_checkGroup_item}>
                  <BasicCheckBox value="auth_part">부품 관리</BasicCheckBox>
                </Col>
                <Col span={6} className={styles.adminModal_checkGroup_item}>
                  <BasicCheckBox value="auth_company">발주처 관리</BasicCheckBox>
                </Col>
                <Col span={6} className={styles.adminModal_checkGroup_item}>
                  <BasicCheckBox value="auth_order">주문 배송 관리</BasicCheckBox>
                </Col>
                <Col span={6} className={styles.adminModal_checkGroup_item}>
                  <BasicCheckBox value="auth_contact">문의 관리</BasicCheckBox>
                </Col>
              </Row>
            </BasicCheckBoxGroup>
            <div className={styles.buttonContainer}>
              <BasicButton key="cancel" className={styles.button_cancel} onClick={handleCancel}>
                cancel
              </BasicButton>
              <BasicButton className={styles.button_save} onClick={saveHandler}>
                Apply
              </BasicButton>
            </div>
          </>
        )}
      ></Modal>
    </>
  )
}
export default AdminNewModal
