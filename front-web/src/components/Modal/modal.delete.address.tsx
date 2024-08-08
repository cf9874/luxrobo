import { Col, Row, Space } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton } from "components/Button"
import styles from "./modal.delete.address.module.scss"
import { useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import modalStyles from "./modal.module.scss"
import { HomeOutlined } from "@ant-design/icons"
import { AddressDto } from "apis/dto/common.dto"

export const DeleteAddressModal = ({ address, onApply }: { address: AddressDto; onApply: () => Promise<void> }) => {
  const modalDispatch = useRedux(setModal)
  return (
    <BasicModal
      header={"Remove Saved Address"}
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
        <Row className={modalStyles.check_text}>Are you sure you want to remove this address?</Row>
        <Row className={styles.address_wrapper}>
          <HomeOutlined className={styles.address_home_icon} />
          <Space direction="vertical" size={0}>
            <Row align={"middle"}>
              <Col className={styles.address_username}>
                {address.receiver} ({address.address_name})
              </Col>
              <Col className={styles.address_user_number}>{address.phone_number}</Col>
            </Row>
            <Row>
              <Col className={styles.address_address}>
                {address.address_json_string} ({address.postal_code})
              </Col>
            </Row>
          </Space>
        </Row>
      </Col>
    </BasicModal>
  )
}
