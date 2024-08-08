import { Col, Row, Space } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton } from "components/Button"
import modalStyles from "./modal.module.scss"
import { useInputs, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"

export const ChangePasswordModal = ({ onApply }: { onApply: (old: string, news: string) => Promise<void> }) => {
  const modalDispatch = useRedux(setModal)

  const oldInput = useInputs({ value: "" })
  const newInput = useInputs({ value: "" })
  const confirmInput = useInputs({ value: "" })

  return (
    <BasicModal
      header="Change Password"
      width={732}
      height={418}
      footer={
        <Row className={modalStyles.modal_button_wrapper}>
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton
            onClick={async () => {
              if (confirmInput.value !== newInput.value) {
                alert("새로운 비밀번호가 일치하지않습니다.")
                return
              }

              modalDispatch({ open: false })
              await onApply(oldInput.value, newInput.value)
            }}
          >
            Apply
          </BasicButton>
        </Row>
      }
    >
      <Space direction="vertical" size={24} className={modalStyles.basic_modal_container}>
        <Col>
          <Row className={modalStyles.modal_content_title}>Old Password</Row>
          <Row className={modalStyles.modal_input_wrapper}>
            <input placeholder="" value={oldInput.value} onChange={oldInput.onChange} />
          </Row>
        </Col>
        <Col>
          <Row className={modalStyles.modal_content_title}>New Password</Row>
          <Row className={modalStyles.modal_input_wrapper}>
            <input placeholder="" value={newInput.value} onChange={newInput.onChange} />
          </Row>
        </Col>
        <Col>
          <Row className={modalStyles.modal_content_title}>Confirm new Password</Row>
          <Row className={modalStyles.modal_input_wrapper}>
            <input placeholder="" value={confirmInput.value} onChange={confirmInput.onChange} />
          </Row>
        </Col>
      </Space>
    </BasicModal>
  )
}
