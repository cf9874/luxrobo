import { IOTypeOption, pinTypeOption } from "@const/dropdow.option.const"
import { Col, Row } from "antd"
import { BasicDropdown } from "components/Dropdown"
import styles from "./logic.naming.row.module.scss"
import { Dispatch, SetStateAction, useState } from "react"
import { useInputs } from "hooks"
import { LogicBlockSchemaDto } from "apis/dto"
import { plainToInstance } from "class-transformer"
import { BasicInput } from "components/Input"

export const NamingRow = ({
  naminOption,
  index,
  namingParam,
  setSchemaState,
}: {
  naminOption: { io_type: string; max_vol: number; min_vol: number; pin_name: string; pin_type: string }
  index: number
  namingParam: {
    io_type: string
    max_vol: number
    min_vol: number
    pin_name: string
    pin_type: string
  }[]
  setSchemaState: Dispatch<SetStateAction<LogicBlockSchemaDto | undefined>>
}) => {
  const [IOType, setIOType] = useState(naminOption.io_type)
  const [pinType, setPinType] = useState<string | number | null | undefined>(naminOption.pin_type)
  const [pinOption, setPinOption] = useState(pinTypeOption[naminOption.io_type])

  const pinTypeInput = useInputs({ value: pinType?.toString() })
  const minInput = useInputs({ value: naminOption.min_vol.toString() })
  const maxInput = useInputs({ value: naminOption.max_vol.toString() })

  return (
    <Row className={styles.IO_item_wrapper}>
      <Col className={styles.IO_item_center}>{index + 1}</Col>
      <Col className={styles.IO_item}>{naminOption.pin_name}</Col>
      <Col className={styles.IO_item_center}>
        <BasicDropdown
          options={IOTypeOption}
          value={{
            value: IOType,
            label: IOType,
          }}
          theme={{
            borderRadius: 0,
          }}
          className={styles.IO_type_dropdown}
          onChange={(e: string) => {
            const modifiedParam = [...namingParam]
            modifiedParam[index].io_type = e
            modifiedParam[index].pin_name = e
            modifiedParam[index].pin_type = pinTypeOption[e] ? (pinTypeOption[e]![0].value as string) : ""

            const resultParam = [
              ...modifiedParam.slice(0, index),
              modifiedParam[index],
              ...modifiedParam.slice(index + 1),
            ]

            console.log(6565, pinTypeOption[e] ? pinTypeOption[e]![0].value : "")
            setIOType(e)
            setPinOption(pinTypeOption[e])
            setPinType(pinTypeOption[e] ? pinTypeOption[e]![0].value : "")
            setSchemaState(state => {
              return plainToInstance(LogicBlockSchemaDto, {
                ...state,
                params: {
                  ...state?.params.schema_bom,
                  naming_param: resultParam,
                },
              }).toJson<LogicBlockSchemaDto>()
            })
          }}
        />
      </Col>
      <Col className={styles.IO_item_center}>
        {IOType === "GPIO" || IOType === "ADC" || IOType === "PWM" ? (
          <input
            className={styles.pin_type_input}
            value={pinTypeInput.value}
            onChange={e => {
              pinTypeInput.onChange(e)
              const modifiedParam = [...namingParam]
              modifiedParam[index].pin_type = e.target.value

              const resultParam = [
                ...modifiedParam.slice(0, index),
                modifiedParam[index],
                ...modifiedParam.slice(index + 1),
              ]
              setPinOption(pinTypeOption[e.target.value])
              setPinType(pinTypeOption[e.target.value] ? pinTypeOption[e.target.value]![0].value : "")
              setSchemaState(state => {
                return plainToInstance(LogicBlockSchemaDto, {
                  ...state,
                  params: {
                    ...state?.params.schema_bom,
                    naming_param: resultParam,
                  },
                }).toJson<LogicBlockSchemaDto>()
              })
            }}
          />
        ) : (
          <BasicDropdown
            options={pinOption}
            value={{
              value: pinType,
              label: pinType,
            }}
            theme={{
              borderRadius: 0,
            }}
            className={styles.pin_type_dropdown}
            onChange={(e: string) => {
              const modifiedParam = [...namingParam]
              modifiedParam[index].pin_type = e

              const resultParam = [
                ...modifiedParam.slice(0, index),
                modifiedParam[index],
                ...modifiedParam.slice(index + 1),
              ]
              setPinType(e)
              setSchemaState(state => {
                return plainToInstance(LogicBlockSchemaDto, {
                  ...state,
                  params: {
                    ...state?.params.schema_bom,
                    naming_param: resultParam,
                  },
                }).toJson<LogicBlockSchemaDto>()
              })
            }}
          />
        )}
      </Col>
      <Col className={styles.IO_item_center}>
        <BasicInput
          type="number"
          value={minInput.value}
          onChange={e => {
            console.log(118118, e.target.value)
            minInput.onChange(e)
            const modifiedParam = [...namingParam]
            modifiedParam[index].min_vol = Number(e.target.value) ? Number(e.target.value) : 0

            const resultParam = [
              ...modifiedParam.slice(0, index),
              modifiedParam[index],
              ...modifiedParam.slice(index + 1),
            ]
            setSchemaState(state => {
              return plainToInstance(LogicBlockSchemaDto, {
                ...state,
                params: {
                  naming_param: resultParam,
                },
              }).toJson<LogicBlockSchemaDto>()
            })
          }}
          placeholder="0"
          suffix={null}
          style={{
            borderRadius: 0,
          }}
        />
      </Col>
      <Col className={styles.IO_item_center}>
        <BasicInput
          type="number"
          value={maxInput.value}
          onChange={e => {
            maxInput.onChange(e)
            const modifiedParam = [...namingParam]
            modifiedParam[index].min_vol = Number(e.target.value) ? Number(e.target.value) : 0

            const resultParam = [
              ...modifiedParam.slice(0, index),
              modifiedParam[index],
              ...modifiedParam.slice(index + 1),
            ]
            setSchemaState(state => {
              return plainToInstance(LogicBlockSchemaDto, {
                ...state,
                params: {
                  naming_param: resultParam,
                },
              }).toJson<LogicBlockSchemaDto>()
            })
          }}
          placeholder="0"
          suffix={null}
          style={{
            borderRadius: 0,
          }}
        />
      </Col>
    </Row>
  )
}
