import { IModalProps } from "type"
import styles from "./modal.module.scss"
import { Col, Row } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { useRedux } from "hooks"
import { setModal } from "redux/reducers/config"

export const BasicModal = ({ width = 760, height = 250, header, children, footer, customClose }: IModalProps) => {
  const modalDispatch = useRedux(setModal)
  return (
    <Col
      className={styles.container}
      style={{
        width,
        height,
      }}
    >
      <Row className={styles.header_wrapper}>
        <Col className={styles.header}>{header}</Col>
      </Row>
      <CloseOutlined className={styles.close_button} onClick={() => {
        (customClose) ? (customClose()) : (modalDispatch({ open: false }))
      }} />
      <Col className={styles.children_wrapper}>{children}</Col>
      <Row className={styles.footer_wrapper}>{footer}</Row>
    </Col>
  )
}
