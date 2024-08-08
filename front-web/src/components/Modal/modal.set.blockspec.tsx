import { useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import { BasicModal } from "./modal.basic"
import { Col, Row } from "antd"
import modalStyles from "./modal.module.scss"
import styles from "./modal.open.block.module.scss"
import { BasicButton } from "components/Button"
import { BasicInput } from "components/Input"
import { DeleteOutlined } from "@ant-design/icons"

export const SetBlockSpecModal = () => {
  const modalDispatch = useRedux(setModal)
  const onApply = () => {
    console.log(123)
  }
  return (
    <BasicModal
      header={"Open Custom Block"}
      width={732}
      height={520}
      footer={
        <Row
          className={modalStyles.wide_modal_button_wrapper}
          justify={"center"}
          style={{
            gap: 12,
          }}
        >
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton onClick={onApply}>Apply</BasicButton>
        </Row>
      }
    >
      <Row className={styles.open_custom_block_wrapper}>
        <Row className={styles.open_custom_block_wrapper_nav_text} justify={"center"}>
          클라우드에 저장된 Custom Block 목록입니다.
        </Row>
        <div className={styles.divider} />
        <Row className={styles.open_custom_block_wrapper_search_input_wrapper} justify={"center"}>
          <BasicInput
            style={{
              width: 532,
              height: 40,
            }}
            className={styles.open_custom_block_wrapper_search_input}
          />
        </Row>
        <Row className={styles.custom_block_list}>
          <Row className={styles.custom_block_list_item}>
            <Col className={styles.custom_block_name}>Number Pad</Col>
            <Col className={styles.custom_block_info_box}>
              <Col className={styles.custom_block_info}>9 Push Button Number Pad</Col>
              <Col className={styles.custom_block_delete_icon}>
                <DeleteOutlined />
              </Col>
            </Col>
          </Row>
          <Row className={styles.custom_block_list_item}>
            <Col className={styles.custom_block_name}>Number Pad</Col>
            <Col className={styles.custom_block_info_box}>
              <Col className={styles.custom_block_info}>9 Push Button Number Pad</Col>
              <Col className={styles.custom_block_delete_icon}>
                <DeleteOutlined />
              </Col>
            </Col>
          </Row>
          <Row className={styles.custom_block_list_item}>
            <Col className={styles.custom_block_name}>Number Pad</Col>
            <Col className={styles.custom_block_info_box}>
              <Col className={styles.custom_block_info}>9 Push Button Number Pad</Col>
              <Col className={styles.custom_block_delete_icon}>
                <DeleteOutlined />
              </Col>
            </Col>
          </Row>
          <Row className={styles.custom_block_list_item}>
            <Col className={styles.custom_block_name}>Number Pad</Col>
            <Col className={styles.custom_block_info_box}>
              <Col className={styles.custom_block_info}>9 Push Button Number Pad</Col>
              <Col className={styles.custom_block_delete_icon}>
                <DeleteOutlined />
              </Col>
            </Col>
          </Row>
          <Row className={styles.custom_block_list_item}>
            <Col className={styles.custom_block_name}>Number Pad</Col>
            <Col className={styles.custom_block_info_box}>
              <Col className={styles.custom_block_info}>9 Push Button Number Pad</Col>
              <Col className={styles.custom_block_delete_icon}>
                <DeleteOutlined />
              </Col>
            </Col>
          </Row>
        </Row>
      </Row>
    </BasicModal>
  )
}
