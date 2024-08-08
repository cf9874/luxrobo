import { Col, Row } from "antd"
import styles from "./modal.info.power.module.scss"
import { CloseOutlined } from "@ant-design/icons"
import { PartBlock } from "components/Extras"
import { CATEGORY_COLOR } from "@const/block.const"
import { LogicCustomInitDto } from "apis/dto"
import { Dispatch, SetStateAction } from "react"
import { BasicButton } from "components/Button"
import { useInputs, useRedux, useToast } from "hooks"
import Image from "next/image"
import { setLoading, setModal, setPause } from "redux/reducers/config"
import { EditLogicBlock } from "./modal.edit.logic.block"
import { BasicDropdown } from "components/Dropdown"
import { converterOptions } from "@const/dropdow.option.const"
import { dropdowntheme } from "styles"
import { imgAsset } from "@assets/image"
import { apiManager, apiUtil } from "apis"
import { useRouter } from "next/router"
import { DiagUtil } from "components/Diagram/Utils/Test"
import { mappingBlockList, matchPartList } from "utils"

export const PowerInfoModal = ({
  blockInfo,
  setBlockInfo,
  setOpenPower,
  setCurrentPowerJson,
  setCurrentLogicLinkJson,
  allUpdate,
  setBlockListState,
}: {
  blockInfo: LogicCustomInitDto | null
  setBlockInfo: Dispatch<SetStateAction<LogicCustomInitDto | null>>
  setOpenPower: Dispatch<SetStateAction<boolean>>
  setCurrentPowerJson: Dispatch<SetStateAction<string>>
  setCurrentLogicLinkJson: Dispatch<SetStateAction<string>>
  allUpdate: () => Promise<void>
  setBlockListState: Dispatch<SetStateAction<LogicCustomInitDto[]>>
}) => {
  const router = useRouter()
  const modalDispatch = useRedux(setModal)
  const loadingDispatch = useRedux(setLoading)
  const pauseDispatch = useRedux(setPause)
  const powerToast = useToast()

  const partNameInput = useInputs({ value: "" })
  return (
    <Col>
      <>{powerToast.contextHolder}</>
      <Row className={styles.title_wrapper}>
        <Col className={styles.title}>Block Infomation</Col>
        <Col className={styles.close_button} onClick={() => setOpenPower(false)}>
          <CloseOutlined />
        </Col>
      </Row>
      <Row className={styles.block_info_wrapper}>
        <Col className={styles.img_wrapper}>
          <PartBlock
            src={process.env.NEXT_PUBLIC_S3_URL + (blockInfo?.icon ?? "")}
            activeColor={blockInfo?.color as CATEGORY_COLOR}
          >
            <div>{blockInfo?.type}</div>
          </PartBlock>
        </Col>
        <Col className={styles.name_input_wrapper}>
          <Col className={styles.input_label}>Name</Col>
          <input
            className={styles.part_name_input}
            value={partNameInput.value === "" ? blockInfo?.part_name : partNameInput.value}
            onChange={partNameInput.onChange}
          />
        </Col>
      </Row>
      <Col className={styles.block_option_info_wrapper}>
        <Row className={styles.info_row}>
          <Col className={styles.option_name}>Type</Col>
          <Col className={styles.option_value}>{blockInfo?.type}</Col>
        </Row>
        <Row className={styles.info_row}>
          <Col className={styles.option_name}>Description</Col>
          <Col className={styles.option_value_desc}>{blockInfo?.description}</Col>
        </Row>
        <Row className={styles.info_row}>
          <Col className={styles.option_name}>Converter</Col>
          <BasicDropdown
            options={converterOptions}
            value={converterOptions?.find(o => o.value === blockInfo?.type) ?? converterOptions![0]}
            onChange={async (e: string) => {
              const test = {
                blockId: blockInfo?.block_id ?? "",
                projectId: Number(router.query.id),
                topology: e,
              }
              console.log(7676, test)
              loadingDispatch(true)
              const response = await apiManager.logicApi.editRegulator({
                blockId: blockInfo?.block_id ?? "",
                projectId: Number(router.query.id),
                topology: e,
              })
              if (apiUtil.isErrorResponse(response) && response.message !== undefined) {
                loadingDispatch(false)
                pauseDispatch(true)
                powerToast.onMessage({
                  type: "error",
                  content: "Regulater 변경에 실패했습니다.",
                })
                pauseDispatch(false)
                return
              }
              if (apiUtil.isErrorResponse(response)) {
                loadingDispatch(false)
                pauseDispatch(true)
                powerToast.onMessage({
                  type: "error",
                  content: "커스텀블록 추가에 실패했습니다.",
                })
                pauseDispatch(false)
                return
              } else {
                const initRes = await apiManager.logicApi.init(Number(router.query.id))
                if (apiUtil.isErrorResponse(initRes)) {
                  loadingDispatch(false)
                  pauseDispatch(true)
                  powerToast.onMessage({
                    type: "error",
                    content: initRes.message ?? "",
                  })
                  pauseDispatch(false)
                  return
                }
                const linkRes = await apiManager.logicApi.getLinks(Number(router.query.id))
                if (apiUtil.isErrorResponse(linkRes)) {
                  loadingDispatch(false)
                  pauseDispatch(true)
                  powerToast.onMessage({
                    type: "error",
                    content: linkRes.message ?? "",
                  })
                  pauseDispatch(false)
                  return
                }
                const powerRes = await apiManager.logicApi.getPowerNets(Number(router.query.id))
                if (apiUtil.isErrorResponse(powerRes)) {
                  loadingDispatch(false)
                  pauseDispatch(true)
                  powerToast.onMessage({
                    type: "error",
                    content: powerRes.message ?? "",
                  })
                  pauseDispatch(false)
                  return
                }
                const partRes = await apiManager.partApi.init(Number(router.query.id))
                if (apiUtil.isErrorResponse(partRes)) {
                  loadingDispatch(false)
                  pauseDispatch(true)
                  powerToast.onMessage({
                    type: "error",
                    content: partRes.message ?? "",
                  })
                  pauseDispatch(false)
                  return
                }
                const newRegulater = initRes.find(e => e.block_id === response.block_id)
                setBlockListState(initRes)
                setBlockInfo(newRegulater ?? blockInfo)
                setCurrentLogicLinkJson(
                  DiagUtil.logicJson({
                    blocks: mappingBlockList({ blocks: matchPartList(initRes), parts: partRes }),
                    links: linkRes,
                  }),
                )
                setCurrentPowerJson(
                  DiagUtil.powerJson({
                    blocks: mappingBlockList({ blocks: matchPartList(initRes), parts: partRes }),
                    powernets: powerRes,
                  }),
                )
                loadingDispatch(false)
              }
            }}
            className={styles.icon_dropdown}
            theme={dropdowntheme}
          />
        </Row>

        <Row className={styles.info_row}>
          <Col className={styles.option_value_voltage}>
            <Col className={styles.voltage_value}>{blockInfo?.option_names["InputVoltage"]}V</Col>
            <Image src={imgAsset.convertArrow} width={108} height={24} alt="convert" />
            <Col className={styles.voltage_value}>{blockInfo?.option_names["OutputVoltage"]}V</Col>
          </Col>
        </Row>
        <Row className={styles.info_row}>
          <Col className={styles.option_name}>Part #</Col>
          <Col className={styles.option_value}>{blockInfo?.part_name}</Col>
        </Row>
        <Row className={styles.info_row}>
          <Col className={styles.option_name}>Output</Col>
          <Col className={styles.option_value}></Col>
        </Row>
        <Row className={styles.info_row}>
          <Col className={styles.option_name}>Power Dissipation</Col>
          <Col className={styles.option_value}></Col>
        </Row>

        {/* {Object.entries(blockInfo?.option_names ?? {}).map(([key, value]) => (
          <Row key={key} className={styles.info_row}>
            <Col className={styles.option_name}>{key}</Col>
            <Col className={styles.option_value}>{value}</Col>
          </Row>
        ))} */}

        <div className={styles.divider} />
        <Row className={styles.option_image_box}>
          <Row className={styles.option_image_title}>Symbol & Footprint</Row>
          <Row className={styles.option_images}>
            <Col className={styles.option_image}>
              <Image unoptimized={true} src={blockInfo?.part_image ?? ""} alt="part_image" width={89} height={89} />
            </Col>
            <Col className={styles.option_image}>
              <Image unoptimized={true} src={blockInfo?.symbol_image ?? ""} alt="symbol_image" width={89} height={89} />
            </Col>

            <Col className={styles.option_image}>
              <Image
                unoptimized={true}
                src={blockInfo?.footprint_image ?? ""}
                alt="footprint_image"
                width={89}
                height={89}
              />
            </Col>
          </Row>
        </Row>
      </Col>
      <Row className={styles.button_group}>
        <Row>
          <BasicButton
            className={styles.edit_button}
            onClick={() =>
              modalDispatch({
                open: true,
                children: <EditLogicBlock blockId={blockInfo?.block_id ?? ""} allUpdate={allUpdate} />,
              })
            }
          >
            Edit
          </BasicButton>
        </Row>
        <Row className={styles.button_box}>
          <BasicButton className={styles.cancel_button} onClick={() => setOpenPower(false)}>
            Cancel
          </BasicButton>
          <BasicButton className={styles.set_button} onClick={() => setOpenPower(false)}>
            Set
          </BasicButton>
        </Row>
      </Row>
    </Col>
  )
}
