import { Col, Row } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton } from "components/Button"
import styles from "./modal.delete.payment.module.scss"
import { useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import modalStyles from "./modal.module.scss"

export const DeletePaymentModal = ({ onApply }: { onApply: () => void }) => {
  const modalDispatch = useRedux(setModal)
  return (
    <BasicModal
      header={"Remove Saved Card"}
      width={732}
      height={296}
      footer={
        <Row className={modalStyles.modal_button_wrapper}>
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton onClick={onApply}>Remove</BasicButton>
        </Row>
      }
    >
      <Col className={modalStyles.basic_modal_container}>
        <Row className={modalStyles.check_text}>Are you sure you want to remove this card?</Row>
        <Row className={styles.payment_card_wrapper}>
          <Col className={styles.payment_card_img}>card</Col>
          <Col className={styles.payment_card_name_box}>
            <Row className={styles.card_company}>Master Card</Row>
            <Row className={styles.card_name}>User Card 1</Row>
          </Col>
          <Col className={styles.card_number}>**** **** **** 1720 | 12 / 28</Col>
        </Row>
      </Col>
    </BasicModal>
  )
}
