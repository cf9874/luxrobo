import { useAsyncEffect, useInputs } from "hooks"
import { BasicModal } from "./modal.basic"
import { Col, ConfigProvider, Row, Tabs } from "antd"
import { BasicButton } from "components/Button"
import modalStyles from "./modal.module.scss"
import styles from "./modal.setting.layout.param.module.scss"
import { BasicDropdown } from "components/Dropdown"
import { LayoutParams, LogicCustomInitDto } from "apis/dto"
import { Dispatch, SetStateAction, useState } from "react"
import { apiManager, apiUtil } from "apis"
import { plainToInstance } from "class-transformer"
import { BasicInput } from "components/Input"

export const SettingLayoutParameterModal = ({
  projectId,
  blockList,
  paramState,
  setParamState,
  setOpenSetting,
}: {
  projectId: number
  blockList: LogicCustomInitDto[]
  paramState: LayoutParams | null
  setParamState: Dispatch<SetStateAction<LayoutParams | null>>
  setOpenSetting: Dispatch<SetStateAction<boolean>>
}) => {
  // const modalDispatch = useRedux(setModal)
  // const [paramState, setParamState] = useState<LayoutParams | null>(null)
  useAsyncEffect(async () => {
    const response = await apiManager.layoutApi.getParams(projectId)
    if (apiUtil.isErrorResponse(response)) {
      alert(response)
      return
    }
    setParamState(response)
  }, [])
  const onApply = async () => {
    const editParams = plainToInstance(LayoutParams, {
      ...paramState,
    }).toJson<LayoutParams>()
    console.log(3434, editParams)
    setParamState(editParams)

    const response = await apiManager.layoutApi.editParams({ projectId, params: paramState ?? null })
    console.log(response)
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }
    setOpenSetting(false)
  }

  return (
    <BasicModal
      header={"Layout Parameter Setting"}
      width={1200}
      height={796}
      footer={
        <Row justify={"end"} className={modalStyles.wide_modal_button_wrapper}>
          <BasicButton
            onClick={() => setOpenSetting(false)}
            style={{
              width: 132,
              marginRight: 24,
            }}
          >
            Cancel
          </BasicButton>
          <BasicButton
            onClick={async () => await onApply()}
            style={{
              width: 132,
            }}
          >
            Apply
          </BasicButton>
        </Row>
      }
    >
      <Row
        className={modalStyles.wide_modal_container}
        style={{
          backgroundColor: "white",
        }}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1b3852",
            },
          }}
        >
          <Tabs
            className={styles.tabs_container}
            defaultActiveKey="1"
            moreIcon={null}
            items={[
              {
                label: <Col className={styles.tab_bar_title}>Block</Col>,
                key: "1",
                children: (
                  <Row className={styles.block_wrapper}>
                    <Row className={styles.block_nav_text}>자동 배치 사용 시, Margin 값이 적용되어 배치 됩니다.</Row>
                    <div className={styles.block_table}>
                      <Row className={styles.block_table_nav_wrapper}>
                        <Col className={styles.nav_item}>No</Col>
                        <Col className={styles.nav_item}>Block Type</Col>
                        <Col className={styles.nav_item}>Block Number</Col>
                        <Col className={styles.nav_item}>Block Name</Col>
                        <Col className={styles.nav_item}>Part Name</Col>
                        <Col className={styles.nav_item_divide}>
                          <Row justify={"center"}>Block Placement Margin</Row>
                          <Row className={styles.nav_item_divide}>
                            <Col>Up</Col>
                            <Col>Down</Col>
                            <Col>Right</Col>
                            <Col>Left</Col>
                          </Row>
                        </Col>
                      </Row>
                      {blockList?.map((e, index) => {
                        if (!paramState) return
                        return (
                          <BlockRow
                            key={index}
                            data={e}
                            index={index}
                            paramState={paramState}
                            setParamState={setParamState}
                          />
                        )
                      })}
                    </div>
                  </Row>
                ),
              },
              {
                label: <Col className={styles.tab_bar_title}>Part</Col>,
                key: "2",
                children: (
                  <Row className={styles.part_wrapper}>
                    <Row className={styles.part_nav_text}>보드 생성 시, Prefix와 Name의 표시 여부를 설정합니다.</Row>
                    <div className={styles.part_table}>
                      <Row className={styles.part_table_nav_wrapper}>
                        <Col className={styles.nav_item}>No</Col>
                        <Col className={styles.nav_item}>Name</Col>
                        <Col className={styles.nav_item}>Prefix</Col>
                        <Col className={styles.nav_item}>Footprint</Col>
                        <Col className={styles.nav_item}>Show Prefix</Col>
                        <Col className={styles.nav_item}>Show Name</Col>
                      </Row>

                      {paramState?.part_params?.map((e, index) => (
                        <Row key={index} className={styles.part_table_item_wrapper}>
                          <Col className={styles.part_item_center}>{index + 1}</Col>
                          <Col className={styles.part_item}>{e.part_name}</Col>
                          <Col className={styles.part_item}>{e.part_prefix}</Col>
                          <Col className={styles.part_item}>{e.footprint}</Col>
                          <Col className={styles.part_item}>
                            <BasicDropdown
                              options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                              ]}
                              defaultValue={{ label: e.show_prefix ? "Yes" : "No", value: e.show_prefix ? 1 : 0 }}
                              style={{
                                width: 190,
                              }}
                              size="small"
                            />
                          </Col>
                          <Col className={styles.part_item}>
                            <BasicDropdown
                              options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                              ]}
                              // onChange={}
                              defaultValue={{ label: e.show_prefix ? "Yes" : "No", value: e.show_prefix ? 1 : 0 }}
                              style={{
                                width: 190,
                              }}
                              size="small"
                            />
                          </Col>
                        </Row>
                      ))}
                    </div>
                  </Row>
                ),
              },
              {
                label: <Col className={styles.tab_bar_title}>Net</Col>,
                key: "3",
                children: (
                  <Row className={styles.net_wrapper}>
                    <Row className={styles.net_nav_text}>파라미터 미 입력 시, Default 파라미터로 적용됩니다.</Row>
                    <div className={styles.net_table}>
                      <Row className={styles.net_table_nav_wrapper}>
                        <Col className={styles.nav_item}>No</Col>
                        <Col className={styles.nav_item}>Net Name</Col>
                        <Col className={styles.nav_item}>Track width</Col>
                        <Col className={styles.nav_item}>Clearance</Col>
                        <Col className={styles.nav_item}>Via Diameter</Col>
                        <Col className={styles.nav_item}>Via Drill DiaMeter</Col>
                        <Col className={styles.nav_item}>Add Test Point</Col>
                      </Row>
                      {paramState?.net_params?.map((e, index) => (
                        <NetRow
                          key={index}
                          index={index}
                          data={e}
                          paramState={paramState}
                          setParamState={setParamState}
                        />
                      ))}
                    </div>
                  </Row>
                ),
              },
              {
                label: <Col className={styles.tab_bar_title}>Preference</Col>,
                key: "4",
                children: (
                  <Col className={styles.preference_wrapper}>
                    {paramState ? <PreferenceRow paramState={paramState} setParamState={setParamState} /> : null}
                  </Col>
                ),
              },
            ]}
          />
        </ConfigProvider>
      </Row>
    </BasicModal>
  )
}
const BlockRow = ({
  index,
  data,
  paramState,
  setParamState,
}: {
  index: number
  data: LogicCustomInitDto
  paramState: LayoutParams
  setParamState: Dispatch<SetStateAction<LayoutParams | null>>
}) => {
  const blockParam = paramState?.block_params?.find(v => v.block_id === data.block_id)
  const upInput = useInputs({ value: Number(blockParam?.margin[0] ?? 5).toString() })
  const downInput = useInputs({ value: Number(blockParam?.margin[1] ?? 5).toString() })
  const rightInput = useInputs({ value: Number(blockParam?.margin[2] ?? 5).toString() })
  const leftInput = useInputs({ value: Number(blockParam?.margin[3] ?? 5).toString() })
  return (
    <Row className={styles.block_table_item_wrapper}>
      <Col className={styles.block_item_center}>{index + 1}</Col>
      <Col className={styles.block_item}>{data.type}</Col>
      <Col className={styles.block_item}>0</Col>
      <Col className={styles.block_item}>{data.type + "0"}</Col>
      <Col className={styles.block_item}>{data.part_name}</Col>
      <Col className={styles.block_item_center}>
        <BasicInput
          value={upInput.value}
          type="number"
          onChange={e => {
            upInput.onChange(e)
            const modifiedMargin = [...paramState.block_params]
            modifiedMargin[index].margin[0] = Number(e.target.value)
            const resultMargin = [
              ...paramState.block_params.slice(0, index),
              modifiedMargin[index],
              ...paramState.block_params.slice(index + 1),
            ]
            setParamState(state => {
              return plainToInstance(LayoutParams, {
                ...state,
                block_params: resultMargin,
              }).toJson<LayoutParams>()
            })
          }}
          suffix={null}
          placeholder=""
        />
      </Col>
      <Col className={styles.block_item_center}>
        <BasicInput
          value={downInput.value}
          type="number"
          onChange={e => {
            downInput.onChange(e)
            const modifiedMargin = [...paramState.block_params]
            modifiedMargin[index].margin[1] = Number(e.target.value)
            const resultMargin = [
              ...paramState.block_params.slice(0, index),
              modifiedMargin[index],
              ...paramState.block_params.slice(index + 1),
            ]
            setParamState(state => {
              return plainToInstance(LayoutParams, {
                ...state,
                block_params: resultMargin,
              }).toJson<LayoutParams>()
            })
          }}
          suffix={null}
          placeholder=""
        />
      </Col>
      <Col className={styles.block_item_center}>
        <BasicInput
          value={rightInput.value}
          type="number"
          onChange={e => {
            rightInput.onChange(e)
            const modifiedMargin = [...paramState.block_params]
            modifiedMargin[index].margin[2] = Number(e.target.value)
            const resultMargin = [
              ...paramState.block_params.slice(0, index),
              modifiedMargin[index],
              ...paramState.block_params.slice(index + 1),
            ]
            setParamState(state => {
              return plainToInstance(LayoutParams, {
                ...state,
                block_params: resultMargin,
              }).toJson<LayoutParams>()
            })
          }}
          suffix={null}
          placeholder=""
        />
      </Col>
      <Col className={styles.block_item_center}>
        <BasicInput
          value={leftInput.value}
          type="number"
          onChange={e => {
            leftInput.onChange(e)
            const modifiedMargin = [...paramState.block_params]
            modifiedMargin[index].margin[3] = Number(e.target.value)
            const resultMargin = [
              ...paramState.block_params.slice(0, index),
              modifiedMargin[index],
              ...paramState.block_params.slice(index + 1),
            ]
            setParamState(state => {
              return plainToInstance(LayoutParams, {
                ...state,
                block_params: resultMargin,
              }).toJson<LayoutParams>()
            })
          }}
          suffix={null}
          placeholder=""
        />
      </Col>
    </Row>
  )
}
const NetRow = ({
  index,
  data,
  paramState,
  setParamState,
}: {
  index: number
  data: { add_tp: boolean; clearance: number; net: string; track_width: number; via_drill: number; via_hole: number }
  paramState: LayoutParams
  setParamState: Dispatch<SetStateAction<LayoutParams | null>>
}) => {
  const tractWidthInput = useInputs({ value: data.track_width.toString() })
  const clrearanceInput = useInputs({ value: data.clearance.toString() })
  const holeInput = useInputs({ value: data.via_hole.toString() })
  const drillInput = useInputs({ value: data.via_drill.toString() })

  return (
    <Row className={styles.net_table_item_wrapper}>
      <Col className={styles.net_item_center}>1</Col>
      {/* <Col className={styles.net_item}>{e.net}</Col> */}

      <Col className={styles.net_item}>{data.net}</Col>
      <Col className={styles.net_item_center}>
        <BasicInput
          value={tractWidthInput.value}
          onChange={e => {
            tractWidthInput.onChange(e)
            const modifiedNet = [...paramState.net_params]
            modifiedNet[index].track_width = Number(e.target.value)
            const resultNet = [
              ...paramState.net_params.slice(0, index),
              modifiedNet[index],
              ...paramState.net_params.slice(index + 1),
            ]
            setParamState(state => {
              return plainToInstance(LayoutParams, {
                ...state,
                net_params: resultNet,
              }).toJson<LayoutParams>()
            })
          }}
          suffix={null}
        />
      </Col>
      <Col className={styles.net_item}>
        <BasicInput
          value={clrearanceInput.value}
          onChange={e => {
            clrearanceInput.onChange(e)
            const modifiedNet = [...paramState.net_params]
            modifiedNet[index].clearance = Number(e.target.value)
            const resultNet = [
              ...paramState.net_params.slice(0, index),
              modifiedNet[index],
              ...paramState.net_params.slice(index + 1),
            ]
            setParamState(state => {
              return plainToInstance(LayoutParams, {
                ...state,
                net_params: resultNet,
              }).toJson<LayoutParams>()
            })
          }}
          suffix={null}
        />
      </Col>
      <Col className={styles.net_item}>
        <BasicInput
          value={holeInput.value}
          onChange={e => {
            holeInput.onChange(e)
            const modifiedNet = [...paramState.net_params]
            modifiedNet[index].via_hole = Number(e.target.value)
            const resultNet = [
              ...paramState.net_params.slice(0, index),
              modifiedNet[index],
              ...paramState.net_params.slice(index + 1),
            ]
            setParamState(state => {
              return plainToInstance(LayoutParams, {
                ...state,
                net_params: resultNet,
              }).toJson<LayoutParams>()
            })
          }}
          suffix={null}
        />
      </Col>
      <Col className={styles.net_item}>
        <BasicInput
          value={drillInput.value}
          onChange={e => {
            drillInput.onChange(e)
            const modifiedNet = [...paramState.net_params]
            modifiedNet[index].via_drill = Number(e.target.value)
            const resultNet = [
              ...paramState.net_params.slice(0, index),
              modifiedNet[index],
              ...paramState.net_params.slice(index + 1),
            ]
            setParamState(state => {
              return plainToInstance(LayoutParams, {
                ...state,
                net_params: resultNet,
              }).toJson<LayoutParams>()
            })
          }}
          suffix={null}
        />
      </Col>
      <Col className={styles.net_item}>
        <BasicDropdown
          options={[
            { label: "No", value: 0 },
            { label: "Yes", value: 1 },
          ]}
          defaultValue={{ label: data.add_tp ? "Yes" : "No", value: data.add_tp ? 1 : 0 }}
          style={{
            width: 150,
            height: 30,
          }}
          size="small"
          onChange={e => {
            const modifiedNet = [...paramState.net_params]
            modifiedNet[index].add_tp = Boolean(e)
            const resultNet = [
              ...paramState.net_params.slice(0, index),
              modifiedNet[index],
              ...paramState.net_params.slice(index + 1),
            ]
            setParamState(state => {
              return plainToInstance(LayoutParams, {
                ...state,
                net_params: resultNet,
              }).toJson<LayoutParams>()
            })
          }}
        />
      </Col>
    </Row>
  )
}
const PreferenceRow = ({
  paramState,
  setParamState,
}: {
  paramState: LayoutParams
  setParamState: Dispatch<SetStateAction<LayoutParams | null>>
}) => {
  const gridInput = useInputs({ value: paramState.preference_params?.grid_size.toString() })
  const [unit, setUnit] = useState(paramState.preference_params?.unit)
  const unitOption = [
    { label: "mil", value: "mil" },
    { label: "mm", value: "mm" },
  ]
  return (
    <div>
      <Row className={styles.preference_row}>
        <Col className={styles.input_label_text}>Unit</Col>
        <BasicDropdown
          options={unitOption}
          defaultValue={unitOption[0]}
          value={unit}
          style={{
            width: 200,
          }}
          onChange={(e: string) => {
            setUnit(e)

            setParamState(state => {
              return plainToInstance(LayoutParams, {
                ...state,
                preference_params: {
                  ...state?.preference_params,
                  unit: e,
                },
              }).toJson<LayoutParams>()
            })
          }}
        />
      </Row>
      <Row className={styles.preference_row}>
        <Col className={styles.input_label_text}>Grid Size</Col>
        <BasicInput
          style={{
            width: 200,
          }}
          suffix={null}
          value={gridInput.value}
          onChange={e => {
            gridInput.onChange(e)
            setParamState(state => {
              return plainToInstance(LayoutParams, {
                ...state,
                preference_params: {
                  ...state?.preference_params,
                  grid_size: Number(e.target.value),
                },
              }).toJson<LayoutParams>()
            })
          }}
        />
      </Row>
    </div>
  )
}
