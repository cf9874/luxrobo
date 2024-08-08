import { IModalProps } from "type"
import modalStyles from "./modal.module.scss"
import { Col, Row } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { useRedux } from "hooks"
import { setModal } from "redux/reducers/config"

export const ColorHeaderModal = ({ width = 760, height = 250, header, children, footer }: IModalProps) => {
  const modalDispatch = useRedux(setModal)
  return (
    <Col
      className={modalStyles.container}
      style={{
        width,
        height,
      }}
    >
      <Row className={modalStyles.color_header_wrapper}>
        <Col className={modalStyles.header}>{header}</Col>
      </Row>
      <CloseOutlined
        className={modalStyles.close_button}
        style={{
          color: "#fff",
        }}
        onClick={() => modalDispatch({ open: false })}
      />
      <Col className={modalStyles.children_wrapper}>{children}</Col>
      <Row className={modalStyles.color_header_footer_wrapper}>{footer}</Row>
    </Col>
  )
}
