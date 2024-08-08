import { Col, Row } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton } from "components/Button"
import modalStyles from "./modal.module.scss"
import styles from "./modal.checkpoint.module.scss"
import { useRedux } from "hooks"
import { setCheck } from "redux/reducers/config"
import { MODIFIED_STEP } from "@const/project.const"
import { useRouter } from "next/router"

export const CheckPointModal = ({ checkPoint }: { checkPoint: MODIFIED_STEP }) => {
  const router = useRouter()
  const checkDispatch = useRedux(setCheck)

  return (
    <BasicModal
      header="Caution"
      width={500}
      height={200}
      customClose={() => {
        void router.push(`/${MODIFIED_STEP[checkPoint]}/${Number(router.query.id)}`)
        checkDispatch({ open: false })
      }}
      footer={
        <Row
          className={modalStyles.modal_button_wrapper}
          style={{
            justifyContent: "flex-end",
            marginRight: 40,
          }}
        >
          <BasicButton
            onClick={() => {
              void router.push(`/${MODIFIED_STEP[checkPoint]}/${Number(router.query.id)}`)
              checkDispatch({ open: false })
            }}
          >
            닫기
          </BasicButton>
        </Row>
      }
    >
      <Col className={modalStyles.basic_modal_container}>
        <Row className={styles.caution_text}>
          {MODIFIED_STEP[checkPoint].toLocaleUpperCase()} 단계를 먼저 진행해주세요.
        </Row>
      </Col>
    </BasicModal>
  )
}
