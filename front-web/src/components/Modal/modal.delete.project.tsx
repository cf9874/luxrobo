import { Col, Row } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton } from "components/Button"
import modalStyles from "./modal.module.scss"
import { useInputs, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"

export const DeleteProjectModal = ({
  onApply,
  title,
}: {
  onApply: (title: string) => Promise<void>
  title: string
}) => {
  const modalDispatch = useRedux(setModal)

  const titleInput = useInputs({ value: "" })
  return (
    <BasicModal
      header="Delete Project"
      width={732}
      height={286}
      footer={
        <Row className={modalStyles.modal_button_wrapper}>
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton onClick={() => onApply(titleInput.value)}>Apply</BasicButton>
        </Row>
      }
    >
      <Col className={modalStyles.basic_modal_container}>
        <Row className={modalStyles.modal_content_title}>Enter Delete Project Name to confirm</Row>
        <Row className={modalStyles.modal_content_title}>Project Name : {title}</Row>
        <Row className={modalStyles.modal_input_wrapper}>
          <input placeholder="Gumstix Jetson Nano MegaDrive Copy1" onChange={titleInput.onChange} />
        </Row>
      </Col>
    </BasicModal>
  )
}
