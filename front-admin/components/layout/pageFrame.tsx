import { Col, Layout, Row } from "antd"
import { BasicProps } from "antd/es/layout/layout"
const { Content } = Layout
import styles from "./pageBasic.module.scss"
import { titleKey } from "@/const"
import FrameLogo from "./frameLogo"
import FrameHeader from "./frameHeader"
import FrameSideBar from "./frameSideBar"

//-----------------------------------------------------------------------------------------------------------
export interface IPageFrameProps extends BasicProps {
  titleKey?: titleKey
  children?: React.ReactNode
}

//-----------------------------------------------------------------------------------------------------------
export const PageFrame = (props: IPageFrameProps) => {
  const { titleKey, children, ...newProps } = props

  return (
    <Col className={styles.layout_main_container}>
      <Row className={styles.layout_main_container_top}>
        <Col className={styles.layout_main_container_left}>
          <FrameLogo className={styles.layout_main_container_logo} />
        </Col>
        <Col className={styles.layout_main_container_right}>
          <FrameHeader titleKey={titleKey} className={styles.layout_main_container_header} />
        </Col>
      </Row>
      <Row className={styles.layout_main_container_bottom}>
        <Col className={styles.layout_main_container_left}>
          <FrameSideBar titleKey={titleKey} className={styles.layout_main_container_sideBar}></FrameSideBar>
        </Col>
        <Col className={styles.layout_main_container_right}>
          <Content className={styles.layout_main_container_content}>
            <div>{children}</div>
          </Content>
        </Col>
      </Row>
    </Col>
  )
}

export default PageFrame
