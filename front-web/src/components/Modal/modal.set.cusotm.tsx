import { Col, Row } from "antd"
import styles from "./modal.set.cusotm.module.scss"
import { CloseOutlined, CloudUploadOutlined, DownloadOutlined, PlusOutlined } from "@ant-design/icons"
import { PartBlock } from "components/Extras"
import { CATEGORY_COLOR } from "@const/block.const"
import {
  CustomblockDto,
  LogicBlockInfoDto,
  LogicCustomInitDto,
  LogicLinkDto,
  LogicPowerNetDto,
  ProjectDto,
} from "apis/dto"
import { Dispatch, SetStateAction, useState } from "react"
import { BasicButton } from "components/Button"
import { useAsyncEffect, useInputs, useRedux, useToast } from "hooks"
import Image from "next/image"
import { setLoading, setModal, setPause } from "redux/reducers/config"
import { EditLogicBlock } from "./modal.edit.logic.block"
import { apiManager, apiUtil } from "apis"
import { imgAsset } from "@assets/image"
import { useRouter } from "next/router"
import { BasicDropdown } from "components/Dropdown"
import { dropdowntheme } from "styles"
import { ImportCustomBlock } from "./modal.open.block"
import { colorOptions, textIcOptions } from "@const/dropdow.option.const"
import { AddBlockSpecModal } from "./modal.setspec"
import { DiagUtil } from "components/Diagram/Utils/Test"
import { matchPartList } from "utils"

export const SetCustomBlockModal = ({
  customBlockId,
  setOpenCustom,
  setBlockListState,
  setLinkState,
  setCurrentPowerNetState,
  setCurrentLogicLinkJson,
  setCurrentPowerJson,
  allUpdate,
}: {
  customBlockId: string
  setOpenCustom: Dispatch<SetStateAction<boolean>>
  setBlockListState: Dispatch<SetStateAction<LogicCustomInitDto[]>>
  setLinkState: Dispatch<SetStateAction<LogicLinkDto[]>>
  setCurrentPowerNetState: Dispatch<SetStateAction<LogicPowerNetDto[]>>
  setCurrentLogicLinkJson: Dispatch<SetStateAction<string>>
  setCurrentPowerJson: Dispatch<SetStateAction<string>>
  allUpdate: () => Promise<void>
}) => {
  const router = useRouter()
  const modalDispatch = useRedux(setModal)
  const loadingDispatch = useRedux(setLoading)
  const pauseDispatch = useRedux(setPause)

  const customBlockToast = useToast()

  const [customBlock, setCustomBlock] = useState<LogicBlockInfoDto | null>(null)
  const [spec, setSpec] = useState<{
    [key: string]: string
  }>({})
  const [customList, setCustomList] = useState<CustomblockDto[]>([])
  const [selectCustomBlock, setSelectCustomBlock] = useState<CustomblockDto>()
  const [blockStyle, setblockStyle] = useState<{
    icon: string
    activeColor: CATEGORY_COLOR | string
    type: string
    part_name?: string
    description?: string
  }>({
    icon: "",
    activeColor: "white",
    type: "",
    part_name: "",
    description: "",
  })
  const [project, setProject] = useState<ProjectDto>()

  useAsyncEffect(async () => {
    const response = await apiManager.projectApi.getDetail(Number(router.query.id))
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }
    setProject(response)
    const customBlock = await apiManager.logicApi.getBlockInfo({
      blockId: customBlockId,
      projectId: Number(router.query.id),
    })

    if (apiUtil.isErrorResponse(customBlock)) {
      alert(customBlock.message)
      return
    }
    setblockStyle({
      activeColor: customBlock.color,
      icon: customBlock.icon,
      type: customBlock.type,
      description: customBlock.description,
      part_name: customBlock.part_name,
    })
    setCustomBlock(customBlock)
    setSpec(customBlock.specification)

    // setSchema(schemaResponse)
    const customListResponse = await apiManager.blockApi.getList(response.teamID ? response.teamID : undefined)
    if (apiUtil.isErrorResponse(customListResponse)) {
      alert(customListResponse.message)
      return
    }
    setCustomList(customListResponse)
    // // setSchema(response)
  }, [])
  const onSaveCustomBlock = async () => {
    if (customBlock) {
      if (selectCustomBlock === undefined) {
        const response = await apiManager.blockApi.create({
          teamId: project?.teamID ? project.teamID : undefined,
          blocks: {
            color: blockStyle.activeColor,
            description: descInput.value ?? "",
            name: nameInput.value ?? "",
            type: blockStyle.type,
            specification: spec,
          },
        })
        if (apiUtil.isErrorResponse(response)) {
          customBlockToast.onMessage({
            type: "error",
            content: response.message ?? "",
          })
          return
        } else {
          customBlockToast.onMessage({
            type: "success",
            content: "커스텀 블록을 저장했습니다.",
          })
        }
        return
      }
      const response = await apiManager.blockApi.edit({
        customblockID: selectCustomBlock?.customblockID ?? 0,
        blocks: {
          part_id: customBlock?.part_id ?? "",
          type: customBlock.type,
          color: blockStyle.activeColor,
          description:
            descInput.value === " " || descInput.value === "" ? selectCustomBlock.description : descInput.value,
          name: nameInput.value === " " || nameInput.value === "" ? selectCustomBlock.name : nameInput.value,
          specification: spec,
        },
      })

      if (apiUtil.isErrorResponse(response)) {
        alert(response.message)
        return
      } else {
        const customList = await apiManager.blockApi.getList(project?.teamID ? project.teamID : undefined)
        if (apiUtil.isErrorResponse(customList)) {
          pauseDispatch(true)
          customBlockToast.onMessage({
            type: "error",
            content: "서버 에러가 발생했습니다.",
          })
          pauseDispatch(false)
          return
        }
        pauseDispatch(true)
        setCustomList(customList)
        customBlockToast.onMessage({
          type: "success",
          content: "커스텀 블록을 저장했습니다.",
        })
        pauseDispatch(false)
        return
      }
    } else {
      const projectRes = await apiManager.projectApi.getDetail(Number(router.query.id))
      if (apiUtil.isErrorResponse(projectRes)) {
        alert(projectRes.message)
        return
      }
      const response = await apiManager.blockApi.create({
        teamId: projectRes.teamID ? projectRes.teamID : undefined,
        blocks: {
          color: blockStyle.activeColor,
          description: descInput.value || "description",
          name: nameInput.value || "name",
          specification: spec,
          type: blockStyle.type,
        },
      })
      if (apiUtil.isErrorResponse(response)) {
        alert(response.message)
        return
      }
    }
  }

  const onLoadCustomBlock = (customList: CustomblockDto[]) => {
    modalDispatch({
      open: true,
      children: (
        <ImportCustomBlock
          customList={customList}
          setCustomList={setCustomList}
          setSpecState={setSpec}
          setblockStyle={setblockStyle}
          setSelectCustomBlock={setSelectCustomBlock}
          setCustomBlock={setCustomBlock}
        />
      ),
    })
  }
  const onSetCustomBlock = async () => {
    loadingDispatch(true)
    const response = await apiManager.logicApi.setCustomBlock({
      block: {
        color: blockStyle.activeColor,
        description: descInput.value === "" ? blockStyle.description ?? "" : descInput.value,
        name: nameInput.value === "" ? blockStyle.part_name ?? "" : nameInput.value,
        specification: spec,
        type: blockStyle.type,
      },
      projectid: Number(router.query.id),
      blockID: customBlockId,
    })

    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
    }

    const logicRes = await apiManager.logicApi.init(Number(router.query.id))
    if (apiUtil.isErrorResponse(logicRes)) {
      alert(logicRes.message)
      return
    }
    const linkRes = await apiManager.logicApi.getLinks(Number(router.query.id))
    if (apiUtil.isErrorResponse(linkRes)) {
      alert(linkRes.message)
      return
    }
    const powerRes = await apiManager.logicApi.getPowerNets(Number(router.query.id))
    if (apiUtil.isErrorResponse(powerRes)) {
      alert(powerRes.message)
      return
    }
    loadingDispatch(false)
    setBlockListState(logicRes)
    setLinkState(linkRes)
    setCurrentPowerNetState(powerRes)
    setCurrentLogicLinkJson(
      DiagUtil.logicJson({
        blocks: matchPartList(logicRes),
        links: linkRes,
      }),
    )
    setCurrentPowerJson(
      DiagUtil.powerJson({
        blocks: matchPartList(logicRes),
        powernets: powerRes,
      }),
    )
    setOpenCustom(false)
  }

  const nameInput = useInputs({ value: " " })
  const descInput = useInputs({ value: " " })
  return (
    <Col>
      <>{customBlockToast.contextHolder}</>
      <Row className={styles.title_wrapper}>
        <Col className={styles.title}>Block Infomation</Col>
        <Col className={styles.close_button} onClick={() => setOpenCustom(false)}>
          <CloseOutlined />
        </Col>
      </Row>
      <Row className={styles.block_info_wrapper}>
        <Row className={styles.button_group}>
          <Row className={styles.button_box}>
            <BasicButton className={styles.cancel_button} onClick={() => onLoadCustomBlock(customList)}>
              <DownloadOutlined /> Open
            </BasicButton>
            <BasicButton className={styles.set_button} onClick={() => onSaveCustomBlock()}>
              <CloudUploadOutlined /> Save
            </BasicButton>
          </Row>
        </Row>
        <Col className={styles.img_wrapper}>
          <PartBlock src={process.env.NEXT_PUBLIC_S3_URL + blockStyle.icon} activeColor={blockStyle.activeColor}>
            <div>{blockStyle.type}</div>
          </PartBlock>
        </Col>
      </Row>
      <Col className={styles.block_option_info_wrapper}>
        <Row className={styles.info_row}>
          <Col className={styles.option_name}>Name</Col>
          <input
            className={styles.part_info_input}
            placeholder={"Name"}
            value={nameInput.value === " " ? blockStyle.part_name : nameInput.value}
            onChange={nameInput.onChange}
          />
        </Row>
        <Row className={styles.info_row}>
          <Col className={styles.option_name}>Desc</Col>
          <textarea
            className={styles.part_info_desc_input}
            value={descInput.value === " " ? blockStyle.description : descInput.value}
            placeholder={"Description"}
            onChange={descInput.onChange}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault()
                return
              }
            }}
          />
        </Row>
        <Row className={styles.info_row_dropdown}>
          <Col className={styles.option_name}>Icon</Col>
          <BasicDropdown
            options={textIcOptions}
            defaultValue={textIcOptions![0]}
            value={blockStyle.type}
            onChange={(e: string) => {
              setblockStyle(state => {
                return {
                  ...state,
                  icon: "/icons/" + e.toLocaleLowerCase() + ".svg",
                  type: e,
                }
              })
            }}
            className={styles.icon_dropdown}
            theme={dropdowntheme}
          />
        </Row>
        <Row className={styles.info_row_dropdown}>
          <Col className={styles.option_name}>Color</Col>

          <BasicDropdown
            options={colorOptions}
            defaultValue={colorOptions![0]}
            value={blockStyle.activeColor}
            className={styles.icon_dropdown}
            onChange={e =>
              setblockStyle(state => {
                return { ...state, activeColor: e as CATEGORY_COLOR }
              })
            }
            theme={dropdowntheme}
          />
        </Row>
        {/* {Object.entries(blockInfo?.option_names ?? {}).map(([key, value]) => (
          <Row key={key} className={styles.info_row}>
            <Col className={styles.option_name}>{key}</Col>
            <Col className={styles.option_value}>{value}</Col>
          </Row>
        ))} */}
        <div className={styles.divider} />
        <Row className={styles.spec_button_wrapper} justify={"center"}>
          {Object.keys(spec).length === 0 ? (
            <BasicButton
              className={styles.spec_button}
              onClick={() => {
                // setSpecState(test)
                modalDispatch({
                  open: true,
                  children: <AddBlockSpecModal spec={spec} setSpec={setSpec} />,
                })
              }}
            >
              <PlusOutlined />
              Add Specification
            </BasicButton>
          ) : (
            <BasicButton
              className={styles.spec_button}
              onClick={() => {
                // setSpecState(test)
                modalDispatch({ open: true, children: <AddBlockSpecModal spec={spec} setSpec={setSpec} /> })
              }}
            >
              <Image src={imgAsset.modifyIcon} width={24} height={24} alt="modify" /> Modify
            </BasicButton>
          )}
        </Row>
        {Object.entries(spec).map((e, i) => {
          return (
            <div key={i} className={styles.spec_wrapper}>
              <div className={styles.spec_title}>{e[0]}</div>
              <div className={styles.spec_value}>{e[1]}</div>
            </div>
          )
        })}
      </Col>

      <div className={styles.divider} />
      <Row className={styles.button_group}>
        <Row>
          <BasicButton
            className={styles.edit_button}
            onClick={() =>
              modalDispatch({
                open: true,
                children: <EditLogicBlock blockId={customBlock?.block_id ?? ""} allUpdate={allUpdate} />,
              })
            }
          >
            Edit
          </BasicButton>
        </Row>
        <Row className={styles.button_box}>
          <BasicButton className={styles.cancel_button} onClick={() => setOpenCustom(false)}>
            Cancel
          </BasicButton>
          <BasicButton className={styles.set_button} onClick={onSetCustomBlock}>
            Set
          </BasicButton>
        </Row>
      </Row>
    </Col>
  )
}
