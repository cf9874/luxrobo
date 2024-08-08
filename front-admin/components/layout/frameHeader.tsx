import { Col, Layout, Row } from "antd"
import { BasicProps } from "antd/es/layout/layout"
const { Header } = Layout
import FrameProfile from "./frameProfile"
import styles from "./pageBasic.module.scss"
import { pageTitle, titleKey } from "@/const"

//-----------------------------------------------------------------------------------------------------------
interface IHeaderProps extends BasicProps {
  titleKey?: titleKey
}

//-----------------------------------------------------------------------------------------------------------
const FrameHeader = (props: IHeaderProps) => {
  const { titleKey, ...newProps } = props

  return (
    <Header {...newProps}>
      <Row justify={"space-between"}>
        <Col>
          <div className={styles.layout_main_container_title}>{pageTitle[titleKey]}</div>
        </Col>
        <Col>
          <FrameProfile className={styles.layout_main_container_profile} />
        </Col>
      </Row>
    </Header>
  )
}

export default FrameHeader
