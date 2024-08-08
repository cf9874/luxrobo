import { Col, Row } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton, buttonStyle } from "components/Button"
import modalStyles from "./modal.module.scss"
import { useInputs, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
// import { ICommonModalProps } from "type"

export const DeleteTeamModal = ({ onApply }: { onApply: (title: string) => Promise<void> }) => {
  const modalDispatch = useRedux(setModal)

  const titleInput = useInputs({ value: "" })
  return (
    <BasicModal
      header="Delete Team"
      width={732}
      height={286}
      footer={
        <Row className={modalStyles.modal_button_wrapper}>
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton className={buttonStyle.delete_button} onClick={() => onApply(titleInput.value)}>
            Apply
          </BasicButton>
        </Row>
      }
    >
      <Col className={modalStyles.basic_modal_container}>
        <Row className={modalStyles.modal_content_title}>Enter Your Team name to confirm</Row>
        <Row className={modalStyles.modal_input_wrapper}>
          <input placeholder="" value={titleInput.value} onChange={titleInput.onChange} />
        </Row>
      </Col>
    </BasicModal>
  )
}
