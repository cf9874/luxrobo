import { useRouter } from "next/router"
import { AliasToken } from "antd/es/theme/internal"
import { Col, Layout, Row } from "antd"
import { BasicProps } from "antd/es/layout/layout"
const { Footer } = Layout
import styles from "./pageBasic.module.scss"
import { BasicButton } from "../Button"

//-----------------------------------------------------------------------------------------------------------
interface IFooterProps extends BasicProps {
  theme?: Partial<AliasToken>
  handler?: {
    saveHandler?: any
    cancelHandler?: any
  }
}

//-----------------------------------------------------------------------------------------------------------
const FrameFooter = (props: IFooterProps) => {
  const router = useRouter()
  const { handler, ...newProps } = props

  //-----------------------------------------------------------------------------------------------------------
  return (
    <>
      <Footer {...newProps}>
        <Row justify={"space-around"} className={styles.layout_main_container_footer_btnWrapper}>
          <Col>
            <BasicButton
              className={styles.layout_main_container_footer_saveBtn}
              onClick={
                handler && handler.saveHandler
                  ? handler.saveHandler
                  : () => {
                      // Save 기능 구현
                      console.log("Save Undefined")
                    }
              }
            >
              적용
            </BasicButton>
          </Col>
          <Col>
            <BasicButton
              className={styles.layout_main_container_footer_cancelBtn}
              onClick={
                handler && handler.cancelHandler
                  ? handler.cancelHandler
                  : () => {
                      console.log("Cancle Undefined")
                      router.back()
                    }
              }
            >
              취소
            </BasicButton>
          </Col>
        </Row>
      </Footer>
    </>
  )
}

export default FrameFooter
