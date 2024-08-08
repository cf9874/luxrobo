import { Col, Row, Space } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton } from "components/Button"
import modalStyles from "./modal.module.scss"
import { useInputs, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import { CustomblockDto } from "apis/dto"

export const CloneCustomBlockModal = ({
  onApply,
  selectItem,
}: {
  onApply: ({ clone_description, clone_name }: { clone_description: string; clone_name: string }) => Promise<void>
  selectItem: CustomblockDto
}) => {
  const modalDispatch = useRedux(setModal)
  const titleInput = useInputs({ value: "" })
  const descriptionInput = useInputs({ value: "" })

  return (
    <BasicModal
      header="Clone Custom Block"
      height={350}
      footer={
        <Row className={modalStyles.modal_button_wrapper}>
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton
            onClick={() => onApply({ clone_name: titleInput.value, clone_description: descriptionInput.value })}
          >
            Apply
          </BasicButton>
        </Row>
      }
    >
      <Space direction="vertical" className={modalStyles.basic_modal_container} size={20}>
        <Col>
          <Row className={modalStyles.modal_content_title}>Enter Clone Custom Block Name to confirm</Row>
          <Row className={modalStyles.modal_input_wrapper}>
            <input placeholder={selectItem.name + " Copy1"} value={titleInput.value} onChange={titleInput.onChange} />
          </Row>
        </Col>
        <Col>
          <Row className={modalStyles.modal_content_title}>Enter Clone Custom Block Description to confirm</Row>
          <Row className={modalStyles.modal_input_wrapper}>
            <input
              placeholder={selectItem.description + " Copy1"}
              value={titleInput.value}
              onChange={descriptionInput.onChange}
            />
          </Row>
        </Col>
      </Space>
    </BasicModal>
  )
}
