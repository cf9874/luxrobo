import { Col, Layout, Row } from "antd"
const { Content } = Layout
import FrameHeader from "./frameHeader"
import FrameLogo from "./frameLogo"
import FrameSideBar from "./frameSideBar"
import FrameFooter from "./frameFooter"
import styles from "./pageBasic.module.scss"
import { IPageFrameProps } from "./pageFrame"

//-----------------------------------------------------------------------------------------------------------
interface IPageFrameFooterProps extends IPageFrameProps {
  handler?: {
    saveHandler?: any
    cancelHandler?: any
  }
}

//-----------------------------------------------------------------------------------------------------------
export const PageFrameFooter = (props: IPageFrameFooterProps) => {
  const { titleKey, handler, children, ...newProps } = props

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
        <Row className={styles.layout_main_container_bottom}>
          <Col className={styles.layout_main_container_left}>
            <FrameSideBar titleKey={titleKey} className={styles.layout_main_container_sideBar}></FrameSideBar>
          </Col>
          <Col className={styles.layout_main_container_right}>
            <Content className={styles.layout_main_container_content}>
              <Row>
                <div>{children}</div>
              </Row>
              <Row>
                <FrameFooter className={styles.layout_main_container_footer} handler={handler}></FrameFooter>
              </Row>
            </Content>
          </Col>
        </Row>
      </Row>
    </Col>
  )
}

export default PageFrameFooter
