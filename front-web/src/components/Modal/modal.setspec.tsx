import { useInputs, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import { BasicModal } from "./modal.basic"
import { Col, Row } from "antd"
import modalStyles from "./modal.module.scss"
import styles from "./modal.spec.part.module.scss"
import { BasicButton } from "components/Button"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { BasicInput } from "components/Input"
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import { BasicDropdown } from "components/Dropdown"

export const AddBlockSpecModal = ({
  spec,
  setSpec,
}: {
  spec: {
    [ket: string]: string
  }
  setSpec: Dispatch<
    SetStateAction<{
      [key: string]: string
    }>
  >
}) => {
  const modalDispatch = useRedux(setModal)

  const [specState, setSpecState] = useState(spec)
  console.log(2828, specState)
  const onAddSpec = () => {
    if (specInput.value === "") return
    const row = {
      [specInput.value]: "",
    }
    setSpecState(state => {
      return { ...state, ...row }
    })
    specInput.onClear()
  }
  const onApply = () => {
    setSpec(specState)
    modalDispatch({ open: false })
  }
  const specInput = useInputs({ value: "" })
  const specValueInput = useInputs({ value: "" })
  return (
    <BasicModal
      header={"Parts Specificationss"}
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
      <Row className={styles.part_spec_wrapper}>
        <Row className={styles.part_spec_wrapper_nav_text} justify={"center"}>
          Parts의 스펙을 수정하거나 추가할 수 있습니다. 스펙을 추가하려면 +버튼을 누르세요.
        </Row>
        <div className={styles.divider} />
        <Row className={styles.add_part_spec_wrapper} justify={"center"}>
          <BasicInput
            value={specInput.value}
            onChange={specInput.onChange}
            placeholder="Text"
            suffix={null}
            style={{
              width: 500,
            }}
          />
          <PlusOutlined className={styles.add_spec_button} onClick={() => onAddSpec()} />
        </Row>
        <div className={styles.part_spec_list}>
          <div />
          {Object.entries(specState).map((v, i) => (
            <SpecRow
              key={i}
              row={v}
              index={i}
              specState={specState}
              setSpecState={setSpecState}
              specValue={specValueInput.value}
              specValueOnChange={specValueInput.onChange}
            />
          ))}
        </div>
      </Row>
    </BasicModal>
  )
}

const SpecRow = ({
  row,
  index,
  specState,
  setSpecState,
}: {
  row: [string, string]
  index: number
  specState: {
    [ket: string]: string
  }
  setSpecState: Dispatch<
    SetStateAction<{
      [key: string]: string
    }>
  >
  specValue: string
  specValueOnChange: (params: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => string | undefined
}) => {
  const onDeleteSpec = () => {
    const spec = Object.entries(specState)
    const defaultValue = spec[index]
    console.log(defaultValue[0])

    const newSpec = [...spec.slice(0, index), ...spec.slice(index + 1)]
    setSpecState(Object.fromEntries(newSpec))
  }
  const valueInput = useInputs({ value: row[1] })
  return (
    <Row className={styles.part_spec_list_list_item}>
      <Col className={styles.part_spec_list_name}>{row[0]}</Col>
      <Col className={styles.part_spec_list_info_box}>
        <Col className={styles.part_spec_list_value}>Value</Col>
        <Col className={styles.part_spec_list_option}>
          {row[0] === "RatingVoltage" ? (
            <BasicDropdown
              options={[
                { value: "1.8", label: "1.8" },
                { value: "3.3", label: "3.3" },
                { value: "5.0", label: "5.0" },
                { value: "9.0", label: "9.0" },
                { value: "12.0", label: "12.0" },
              ]}
              defaultValue={{
                value: row[1],
                label: row[1],
              }}
              style={{
                width: 140,
              }}
              onChange={(e: string) => {
                console.log(e)
                setSpecState(state => {
                  return {
                    ...state,
                    RatingVoltage: e.toString(),
                  }
                })
              }}
            />
          ) : (
            <BasicInput
              suffix={null}
              style={{
                width: 140,
              }}
              value={valueInput.value}
              onChange={e => {
                valueInput.onChange(e)
                const result = {
                  [row[0]]: e.target.value,
                }
                setSpecState(state => {
                  return {
                    ...state,
                    ...result,
                    // {[row[0].toString()]: e }
                  }
                })
              }}
              defaultValue={row[1]}
              placeholder=""
            />
          )}
        </Col>
      </Col>

      <Col className={styles.part_spec_list_delete_icon}>
        {row[0] !== "RatingVoltage" ? (
          <DeleteOutlined
            onClick={() => {
              onDeleteSpec()
            }}
          />
        ) : (
          <div />
        )}
      </Col>
    </Row>
  )
}
