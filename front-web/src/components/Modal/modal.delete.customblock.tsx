import { Col, Row } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton } from "components/Button"
import modalStyles from "./modal.module.scss"
import { useInputs, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import { CustomblockDto } from "apis/dto"

export const DeleteCustomBlockModal = ({
  onApply,
  selectItem,
}: {
  onApply: ({ id, title }: { id: number; title: string }) => Promise<void>
  selectItem: CustomblockDto
}) => {
  const modalDispatch = useRedux(setModal)

  const titleInput = useInputs({ value: "" })

  return (
    <BasicModal
      header="Delete Custom Block"
      width={732}
      height={286}
      footer={
        <Row className={modalStyles.modal_button_wrapper}>
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton onClick={() => onApply({ id: selectItem.customblockID, title: titleInput.value })}>
            Apply
          </BasicButton>
        </Row>
      }
    >
      <Col className={modalStyles.basic_modal_container}>
        <Row className={modalStyles.modal_content_title}>Enter Delete Delete Custom Block Name to confirm</Row>
        <Row className={modalStyles.modal_content_title}>Custom Block Name : {selectItem.name}</Row>
        <Row className={modalStyles.modal_input_wrapper}>
          <input placeholder="" value={titleInput.value} onChange={titleInput.onChange} />
        </Row>
      </Col>
    </BasicModal>
  )
}
