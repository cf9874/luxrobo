import { Col, Row } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton } from "components/Button"
import modalStyles from "./modal.module.scss"
import { useInputs, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import { CustomblockDto } from "apis/dto"
// import { useState } from "react"

export const ShareCustomBlockModal = ({
  onApply,
  selectItem,
}: {
  onApply: (accountID: string) => Promise<void>
  selectItem: CustomblockDto
}) => {
  const modalDispatch = useRedux(setModal)
  const titleInput = useInputs({ value: "" })
  //   const [userList, setUserList] = useState<string[]>([])

  return (
    <BasicModal
      header="CunstomBlock Share"
      footer={
        <Row className={modalStyles.modal_button_wrapper}>
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton onClick={() => onApply(titleInput.value)}>Apply</BasicButton>
        </Row>
      }
    >
      <Col className={modalStyles.basic_modal_container}>
        <Row className={modalStyles.modal_content_title}>Enter Clone Custom Block Description to confirm</Row>
        <Row className={modalStyles.modal_input_wrapper}>
          <input placeholder={selectItem.name + "Copy1"} value={titleInput.value} onChange={titleInput.onChange} />
        </Row>
      </Col>
    </BasicModal>
  )
}
