import { Col, Row } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton } from "components/Button"
import modalStyles from "./modal.module.scss"
import { useInputs, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"

export const CreateTeamModal = ({ onApply }: { onApply: (title: string) => Promise<void> }) => {
  const modalDispatch = useRedux(setModal)

  const titleInput = useInputs({ value: "" })

  return (
    <BasicModal
      header="Create New Team"
      footer={
        <Row className={modalStyles.modal_button_wrapper}>
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton onClick={async () => await onApply(titleInput.value)}>Apply</BasicButton>
        </Row>
      }
    >
      <Col className={modalStyles.basic_modal_container}>
        <Row className={modalStyles.modal_content_title}>Enter new team name to create</Row>
        <Row className={modalStyles.modal_input_wrapper}>
          <input placeholder="" value={titleInput.value} onChange={titleInput.onChange} />
        </Row>
      </Col>
    </BasicModal>
  )
}
