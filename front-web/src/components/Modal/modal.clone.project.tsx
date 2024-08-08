import { Col, Row } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton } from "components/Button"
import modalStyles from "./modal.module.scss"
import { useInputs, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"

export const CloneProjectModal = ({ onApply }: { onApply: (title: string) => Promise<void> }) => {
  const modalDispatch = useRedux(setModal)

  const titleInput = useInputs({ value: "" })

  return (
    <BasicModal
      header="Clone Project"
      footer={
        <Row className={modalStyles.modal_button_wrapper}>
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton onClick={() => onApply(titleInput.value)}>Apply</BasicButton>
        </Row>
      }
    >
      <Col className={modalStyles.basic_modal_container}>
        <Row className={modalStyles.modal_content_title}>Enter Clone Project Name to confirm</Row>
        <Row className={modalStyles.modal_input_wrapper}>
          <input
            placeholder="Gumstix Jetson Nano MegaDrive Copy1"
            value={titleInput.value}
            onChange={titleInput.onChange}
          />
        </Row>
      </Col>
    </BasicModal>
  )
}
