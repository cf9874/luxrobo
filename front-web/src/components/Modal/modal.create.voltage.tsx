import { Col, Row } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton } from "components/Button"
import modalstyles from "./modal.module.scss"
import styles from "./modal.create.voltage.module.scss"
import { useInputs, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"

export const CreateVoltageModal = ({ onApply }: { onApply: ({ refvolt }: { refvolt: number }) => Promise<void> }) => {
  const modalDispatch = useRedux(setModal)
  const refvoltInput = useInputs({ value: "" })
  return (
    <BasicModal
      header="New Voltage Net"
      width={732}
      height={286}
      footer={
        <Row className={modalstyles.modal_button_wrapper}>
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton onClick={() => onApply({ refvolt: Number(refvoltInput.value) })}>Apply</BasicButton>
        </Row>
      }
    >
      <Col className={modalstyles.basic_modal_container}>
        <Row className={styles.voltage_box}>
          <Col className={styles.voltage_title}>Reference Valtage</Col>
          <input
            type="number"
            placeholder="Voltage (V)"
            className={styles.voltage_input}
            value={refvoltInput.value}
            onChange={e => {
              const regEXP = /[0-9]/g
              const test = regEXP.test(e.target.value)
              if (!test) return
              refvoltInput.onChange(e)
            }}
          />
        </Row>
      </Col>
    </BasicModal>
  )
}
