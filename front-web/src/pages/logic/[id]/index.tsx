/* eslint-disable @typescript-eslint/no-unused-vars */

import styles from "./logic.module.scss"
import { PowerToLogicToggleSwitch } from "components/Switch"
import { CanvasWrapper } from "components/Wrapper"
import { useState } from "react"
import { LayoutMain } from "Layout"
import LogicDiag from "components/Diagram/LogicDiagram"
import { DiagUtil } from "components/Diagram/Utils/Test"
import { useAsyncEffect, useRedux, useToast, useToggle } from "hooks"
import { setCheck, setLoading, setModal, setPause } from "redux/reducers/config"
import {
  BlockInfoModal,
  CheckPointModal,
  CreateVoltageModal,
  LogicContextMenu,
  NoticePartChangeModal,
  PowerContextMenu,
  PowerInfoModal,
  SetCustomBlockModal,
} from "components/Modal"
import { useRouter } from "next/router"
import PowerDiag from "components/Diagram/PowerDiagram"
import { Col } from "antd"
import { apiManager, apiUtil } from "apis"
// import { GetServerSideProps } from "next"
import { LogicCustomInitDto, LogicLinkDto, LogicPowerNetDto, PartBlockDto, ProjectDto } from "apis/dto"
import { CATEGORY_COLOR } from "@const/block.const"
import { imgAsset } from "@assets/image"
import Image from "next/image"
import { PROJECT_ALERT } from "@const/alarm.const"
import { BasicButton } from "components/Button"
import { getCheckPoint, mappingBlockList, matchPartList } from "utils"
import { useDiagMenu } from "components/Diagram/useDiagMenu"
import { plainToInstance } from "class-transformer"
import { MODIFIED_STEP } from "@const/project.const"

const LogicPage = () => {
  const router = useRouter()
  const projectID = Number(router.query.id)
  const modalDispatch = useRedux(setModal)
  const loadingDispatch = useRedux(setLoading)
  const pauseDispatch = useRedux(setPause)
  const checkDispatch = useRedux(setCheck)
  const logicToast = useToast()
  const menuHooks = useDiagMenu()
  const [contextMenuPositon, setContextMenuPositon] = useState({
    x: 0,
    y: 0,
  })
  const [blockListState, setBlockListState] = useState<LogicCustomInitDto[]>([])
  const [linkState, setLinkState] = useState<LogicLinkDto[]>([])
  const [prevPowerNetState, setPrevPowerNetState] = useState<LogicPowerNetDto[]>([])
  const [currentPowerNetState, setCurrentPowerNetState] = useState<LogicPowerNetDto[]>([])
  const [projectData, setProjectData] = useState<ProjectDto>()
  const [toggle, setToggle] = useToggle(true)
  const [openContextMenu, setOpenContextMenu] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)
  const [openCustom, setOpenCustom] = useState(false)
  const [openPower, setOpenPower] = useState(false)
  const [recentCreateBlockId, setRecentCreateBlockId] = useState<string[]>([])
  const [prevLogicAction, setPrevLogicAction] = useState("")
  // logic/links api 호출해서 받는 json 연결하기
  const [currentLogicLinkJson, setCurrentLogicLinkJson] = useState("")
  const [currentPowerJson, setCurrentPowerJson] = useState("")
  const [prevPowerJson, setPrevPowerJson] = useState("")
  const [selectBlock, setSelectBlock] = useState<LogicCustomInitDto | null>(null)
  const [selectBlockID, setSelectBlockID] = useState<string>("")
  const [selectPower, setSelectPower] = useState<LogicCustomInitDto | null>(null)

  const [powerHistory, setPowerHistory] = useState<string[]>([])
  const [logicHistory, setLogicHistory] = useState<string[]>([])
  // const [history, setHistory] = useState<{ link: []; power: []; block: [] }[]>([])

  const [errorMsg, setErrorMsg] = useState("")

  const clearDuplicate = (array: string[]) => {
    return array.filter((v, i) => array.indexOf(v) === i).filter(v => v !== "")
  }

  useAsyncEffect(async () => {
    if (!router.query.id) return

    loadingDispatch(true)
    const projectRes = await apiManager.projectApi.getDetail(Number(router.query.id))
    if (apiUtil.isErrorResponse(projectRes)) {
      loadingDispatch(false)
      logicToast.onMessage({
        type: "error",
        content: projectRes.message ?? "",
      })
      setErrorMsg(projectRes.message ?? "")
      return
    }

    const current = router.route.split("/")[1] as keyof typeof MODIFIED_STEP
    const checkPoint = getCheckPoint({ current, checkPoint: projectRes.checkpoint })

    if (!checkPoint) {
      loadingDispatch(false)
      checkDispatch({ open: true, children: <CheckPointModal checkPoint={projectRes.checkpoint} /> })
      return
    }

    const blockListRes = await apiManager.logicApi.init(Number(router.query.id))
    const linkRes = await apiManager.logicApi.getLinks(Number(router.query.id))
    const powerRes = await apiManager.logicApi.getPowerNets(Number(router.query.id))
    const partRes = await apiManager.partApi.init(Number(router.query.id))
    // console.log(9090, partRes)
    // console.log(8989, blockListRes)

    if (
      apiUtil.isErrorResponse(blockListRes) ||
      apiUtil.isErrorResponse(linkRes) ||
      apiUtil.isErrorResponse(powerRes)
    ) {
      if ("message" in blockListRes) {
        setErrorMsg(blockListRes.message ?? "")
      } else if ("message" in linkRes) {
        setErrorMsg(linkRes.message ?? "")
      } else if ("message" in powerRes) {
        setErrorMsg(powerRes.message ?? "")
      }
    } else {
      setBlockListState(blockListRes)
      setLinkState(linkRes)
      setPrevPowerNetState(powerRes)
      setCurrentPowerNetState(powerRes)
      setProjectData(projectRes)

      setCurrentLogicLinkJson(
        DiagUtil.logicJson({
          blocks: mappingBlockList({ blocks: matchPartList(blockListRes), parts: partRes }),
          links: linkRes,
        }),
      )
      setCurrentPowerJson(
        DiagUtil.powerJson({
          blocks: mappingBlockList({ blocks: matchPartList(blockListRes), parts: partRes }),
          powernets: powerRes,
        }),
      )
      setLogicHistory(state =>
        clearDuplicate([
          ...state,
          DiagUtil.logicJson({
            blocks: mappingBlockList({ blocks: matchPartList(blockListRes), parts: partRes }),
            links: linkRes,
          }),
        ]),
      )
      setPowerHistory(state =>
        clearDuplicate([
          ...state,
          DiagUtil.powerJson({
            blocks: mappingBlockList({ blocks: matchPartList(blockListRes), parts: partRes }),
            powernets: powerRes,
          }),
        ]),
      )
    }

    // blockList: LogicCustomInitDto[]
    // linkList: LogicLinkDto[]
    // powerList: LogicPowerNetDto[]
    // projectData: ProjectDto
    loadingDispatch(false)
  }, [router.query.id])
  // const [selectBlockLink, setSelectBlockLink] = useState<IDiagBlock | null>(null)
  const onToggleChange = () => {
    console.log("toggle switch")
    setToggle()
    closeContextMenu()
    setOpenInfo(false)
    setOpenCustom(false)
  }

  const closeContextMenu = () => {
    setOpenContextMenu(false)
  }

  //custom block
  const onAddCustomBlock = async () => {
    loadingDispatch(true)
    const response = await apiManager.logicApi.setCustomBlock({
      projectid: Number(router.query.id),
      block: {
        color: CATEGORY_COLOR.Input,
        description: "Description",
        name: "Switch0",
        specification: { RatingVoltage: "1.8" },
        type: "Switch",
      },
    })

    if (apiUtil.isErrorResponse(response)) {
      loadingDispatch(false)
      pauseDispatch(true)
      logicToast.onMessage({
        type: "error",
        content: "커스텀블록 추가에 실패했습니다.",
      })
      pauseDispatch(false)
      return
    } else {
      const logicRes = await apiManager.logicApi.init(projectID)
      if (apiUtil.isErrorResponse(logicRes)) {
        loadingDispatch(false)
        pauseDispatch(true)
        logicToast.onMessage({
          type: "error",
          content: logicRes.message ?? "",
        })
        pauseDispatch(false)
        return
      }
      const linkRes = await apiManager.logicApi.getLinks(projectID)
      if (apiUtil.isErrorResponse(linkRes)) {
        loadingDispatch(false)
        pauseDispatch(true)
        logicToast.onMessage({
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
        logicToast.onMessage({
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
        logicToast.onMessage({
          type: "error",
          content: partRes.message ?? "",
        })
        pauseDispatch(false)
        return
      }

      setBlockListState(logicRes)
      setLinkState(linkRes)
      setCurrentPowerNetState(powerRes)
      setCurrentLogicLinkJson(
        DiagUtil.logicJson({
          blocks: mappingBlockList({ blocks: matchPartList(logicRes), parts: partRes }),
          links: linkRes,
        }),
      )
      setCurrentPowerJson(
        DiagUtil.powerJson({
          blocks: mappingBlockList({ blocks: matchPartList(logicRes), parts: partRes }),
          powernets: powerRes,
        }),
      )
      setRecentCreateBlockId(state => [...state, response.block_id])
      setOpenCustom(true)
      setSelectBlockID(response.block_id)
      loadingDispatch(false)
    }
  }

  /* logic */
  const onCopy = (id: string) => {
    setSelectBlockID(id)
    if (id === "Power") {
      logicToast.onMessage({
        type: "error",
        content: "Power 부품은 복제할 수 없습니다.",
      })
    } else if (selectBlock?.type === "MCU") {
      logicToast.onMessage({
        type: "error",
        content: "현재 MCU 부품은 하나만 지원합니다.",
      })
    } else {
      logicToast.onMessage({
        type: "success",
        content: PROJECT_ALERT["S001"].kor,
      })
    }
  }
  const onCloneBlock = async ({ blockID }: { blockID: string }) => {
    if (selectBlock?.category === "MCU") {
      logicToast.onMessage({
        type: "error",
        content: "MCU 부품은 하나만 추가 가능합니다.",
      })
      return
    }
    const response = await apiManager.logicApi.copy({ projectID, blockID })
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      logicToast.onMessage({
        type: "error",
        content: "부품 복제에 실패했습니다.",
      })
      return
    }
    console.log(response)
    setRecentCreateBlockId(state => [...state, response.block_id])

    const logicRes = await apiManager.logicApi.init(projectID)
    if (apiUtil.isErrorResponse(logicRes)) {
      logicToast.onMessage({
        type: "error",
        content: logicRes.message ?? "",
      })
      return
    }
    const linkRes = await apiManager.logicApi.getLinks(projectID)
    if (apiUtil.isErrorResponse(linkRes)) {
      logicToast.onMessage({
        type: "error",
        content: linkRes.message ?? "",
      })
      return
    }
    const partRes = await apiManager.partApi.init(Number(router.query.id))
    if (apiUtil.isErrorResponse(partRes)) {
      loadingDispatch(false)
      pauseDispatch(true)
      logicToast.onMessage({
        type: "error",
        content: partRes.message ?? "",
      })
      pauseDispatch(false)
      return
    }
    setCurrentLogicLinkJson(
      DiagUtil.logicJson({
        blocks: mappingBlockList({ blocks: matchPartList(logicRes), parts: partRes }),
        links: linkRes,
      }),
    )
    setBlockListState(logicRes)
    setLinkState(linkRes)
    setPrevLogicAction("block")
  }
  // 블록 복제 (daigam)
  const onPaste = async () => {
    if (selectBlockID === "Power") {
      logicToast.onMessage({
        type: "error",
        content: "Power 부품은 복제할 수 없습니다.",
      })
      return
    } else if (selectBlock?.type === "MCU") {
      logicToast.onMessage({
        type: "error",
        content: "현재 MCU 부품은 하나만 지원합니다.",
      })
      return
    }
    await onCloneBlock({ blockID: selectBlockID })
    logicToast.onMessage({
      type: "success",
      content: PROJECT_ALERT["S002"].kor,
    })
  }

  const allUpdate = async () => {
    loadingDispatch(true)
    const initRes = await apiManager.logicApi.init(Number(router.query.id))
    if (apiUtil.isErrorResponse(initRes)) {
      loadingDispatch(false)
      alert(initRes.message)
      logicToast.onMessage({
        type: "error",
        content: initRes.message ?? "",
      })
      return
    }
    const powerNetRes = await apiManager.logicApi.getPowerNets(Number(router.query.id))
    if (apiUtil.isErrorResponse(powerNetRes)) {
      loadingDispatch(false)
      alert()
      logicToast.onMessage({
        type: "error",
        content: powerNetRes.message ?? "",
      })
      return
    }
    const partRes = await apiManager.partApi.init(Number(router.query.id))
    if (apiUtil.isErrorResponse(partRes)) {
      loadingDispatch(false)
      logicToast.onMessage({
        type: "error",
        content: partRes.message ?? "",
      })
      return
    }

    const linkRes = await apiManager.logicApi.getLinks(Number(router.query.id))
    if (apiUtil.isErrorResponse(linkRes)) {
      logicToast.onMessage({
        type: "error",
        content: linkRes.message ?? "",
      })
      return
    }

    setBlockListState(initRes)
    setCurrentPowerNetState(powerNetRes)
    setLinkState(linkRes)
    setCurrentLogicLinkJson(
      DiagUtil.logicJson({
        blocks: mappingBlockList({ blocks: matchPartList(initRes), parts: partRes }),
        links: linkRes,
      }),
    )
    setCurrentPowerJson(
      DiagUtil.powerJson({
        blocks: mappingBlockList({ blocks: matchPartList(blockListState), parts: partRes }),
        powernets: powerNetRes,
      }),
    )

    setPowerHistory(state =>
      clearDuplicate([
        ...state,
        DiagUtil.powerJson({
          blocks: mappingBlockList({ blocks: matchPartList(blockListState), parts: partRes }),
          powernets: powerNetRes,
        }),
      ]),
    )
    loadingDispatch(false)
  }

  const onLogicBlockClick = (block: string) => {
    closeContextMenu()
    if (block === "Power") {
      setOpenInfo(false)
      return
    }
    setOpenCustom(false)
    setOpenInfo(true)
    setSelectBlockID(block)
    setSelectBlock(blockListState.find(e => e.block_id === block) ?? null)
  }
  const onLogicRealse = () => {
    closeContextMenu()
    setOpenInfo(false)
    setOpenCustom(false)
    setOpenPower(false)
    console.log(`Released: no selected block.`)
  }
  const onAddPowerNet = () => {
    modalDispatch({
      open: true,
      children: <CreateVoltageModal onApply={({ refvolt }: { refvolt: number }) => createPowerNet({ refvolt })} />,
    })
  }
  const onUndoLogic = async () => {
    if (prevLogicAction === "") return
    if (prevLogicAction === "block") {
      const response = await apiManager.logicApi.delete({
        blockId: recentCreateBlockId.at(-1) ?? "",
        projectID,
      })
      if (apiUtil.isErrorResponse(response)) {
        logicToast.onMessage({
          type: "error",
          content: "더 이상 되돌릴 수 없습니다.",
        })
        return
      }
      setRecentCreateBlockId(state => state.filter(id => id !== recentCreateBlockId.at(-1) ?? ""))
      const logicRes = await apiManager.logicApi.init(projectID)
      if (apiUtil.isErrorResponse(logicRes)) {
        alert(logicRes.message)
        return
      }
      const linkRes = await apiManager.logicApi.getLinks(projectID)
      if (apiUtil.isErrorResponse(linkRes)) {
        alert(linkRes.message)
        return
      }
      const partRes = await apiManager.partApi.init(Number(router.query.id))
      if (apiUtil.isErrorResponse(partRes)) {
        loadingDispatch(false)
        pauseDispatch(true)
        logicToast.onMessage({
          type: "error",
          content: partRes.message ?? "",
        })
        pauseDispatch(false)
        return
      }
      setCurrentLogicLinkJson(
        DiagUtil.logicJson({
          blocks: mappingBlockList({ blocks: matchPartList(logicRes), parts: partRes }),
          links: linkRes,
        }),
      )
    } else if (prevLogicAction === "option") {
      // 변경전 옵션 으로 다시 apply
    }
  }
  const onRedoLogic = async () => {
    if (prevLogicAction === "") return
    await onCloneBlock({ blockID: recentCreateBlockId.at(-1) ?? "" })
    console.log("redo!!!")
  }
  // powernet 추가
  const createPowerNet = async ({ refvolt }: { refvolt: number }) => {
    loadingDispatch(true)

    const createPowerNetsRes = await apiManager.logicApi.createPowerNets({ projectID, refvolt })
    if (apiUtil.isErrorResponse(createPowerNetsRes)) {
      loadingDispatch(false)
      pauseDispatch(true)
      logicToast.onMessage({
        type: "error",
        content: createPowerNetsRes.message ?? "",
      })
      pauseDispatch(false)
      return
    }
    const initRes = await apiManager.logicApi.init(projectID)
    if (apiUtil.isErrorResponse(initRes)) {
      loadingDispatch(false)
      pauseDispatch(true)
      alert(initRes.message)
      logicToast.onMessage({
        type: "error",
        content: initRes.message ?? "",
      })
      pauseDispatch(false)
      return
    }
    const powerNetRes = await apiManager.logicApi.getPowerNets(projectID)
    if (apiUtil.isErrorResponse(powerNetRes)) {
      loadingDispatch(false)
      pauseDispatch(true)
      alert()
      logicToast.onMessage({
        type: "error",
        content: powerNetRes.message ?? "",
      })
      pauseDispatch(false)
      return
    }
    const partRes = await apiManager.partApi.init(Number(router.query.id))
    if (apiUtil.isErrorResponse(partRes)) {
      loadingDispatch(false)
      pauseDispatch(true)
      logicToast.onMessage({
        type: "error",
        content: partRes.message ?? "",
      })
      pauseDispatch(false)
      return
    }
    setBlockListState(initRes)
    setCurrentPowerNetState(powerNetRes)
    setCurrentPowerJson(
      DiagUtil.powerJson({
        blocks: mappingBlockList({ blocks: matchPartList(blockListState), parts: partRes }),
        powernets: powerNetRes,
      }),
    )

    setPowerHistory(state =>
      clearDuplicate([
        ...state,
        DiagUtil.powerJson({
          blocks: mappingBlockList({ blocks: matchPartList(blockListState), parts: partRes }),
          powernets: powerNetRes,
        }),
      ]),
    )
    loadingDispatch(false)
    modalDispatch({ open: false })
  }

  const onPowerBlockClick = (id: string) => {
    console.log(`click!!! id: ${id}`)
    setOpenPower(true)
    setSelectPower(blockListState.find(v => v.block_id === id) ?? null)
  }
  const onPowerRelease = () => {
    closeContextMenu()
    console.log(`Released: no selected block.`)
  }
  const powerCancel = async () => {
    const partRes = await apiManager.partApi.init(Number(router.query.id))
    if (apiUtil.isErrorResponse(partRes)) {
      loadingDispatch(false)
      pauseDispatch(true)
      logicToast.onMessage({
        type: "error",
        content: partRes.message ?? "",
      })
      pauseDispatch(false)
      return
    }
    setCurrentPowerJson(
      DiagUtil.powerJson({
        powernets: prevPowerNetState,
        blocks: mappingBlockList({ blocks: matchPartList(blockListState), parts: partRes }),
      }),
    )
    modalDispatch({ open: false })
  }
  const onNetChanged = async ({ movedBlockId, newNetName }: { movedBlockId: string; newNetName: string }) => {
    //  Not Found-not have a part for recommend 추천 부품이 없는 경우 이렇게 에러가 나옴.
    // 이렇게 되면 추천 부품이 없습니다.
    const ref_voltage = currentPowerNetState.find(v => v.net_name === newNetName)?.ref_voltage
    const partRes = await apiManager.partApi.init(projectID)
    if (apiUtil.isErrorResponse(partRes)) {
      alert(partRes.message)
      return
    }
    console.log(prevPowerNetState)
    const currentPart = partRes.find(v => v.BlockInfo.block_id === movedBlockId)
    const prev = JSON.parse(JSON.stringify(prevPowerNetState)) as LogicPowerNetDto[]
    const prevNet = prev.find(net => net.group.includes(movedBlockId))
    console.log("prevNet : ", prevNet)
    const prevNetGroup = prevNet?.group.filter(e => !e.includes(movedBlockId))
    console.log("prevNetGroup : ", prevNetGroup)
    prevNet!.group = [...(prevNetGroup ?? [""])]
    const targetNet = prev.find(net => net.net_name === newNetName)
    console.log("targetNet : ", targetNet)
    const targetNetGroup = [...(prev.find(net => net.net_name === newNetName)?.group ?? []), movedBlockId]
    console.log("targetNetGroup : ", targetNetGroup)
    targetNet!.group = [...targetNetGroup]

    const untargetedNet = prev.filter(net => net.net_name !== newNetName).filter(e => !e.group.includes(movedBlockId))

    const result = [...untargetedNet, targetNet] as LogicPowerNetDto[]
    console.log("result", result)
    const recommendPart = await apiManager.logicApi.getBlockVolt({
      projectID,
      blockId: movedBlockId,
      newvolt: ref_voltage ?? 0,
    })

    modalDispatch({
      open: true,
      children: (
        <NoticePartChangeModal
          powerCancel={powerCancel}
          currentPart={currentPart}
          recommendPart={recommendPart}
          newNetName={newNetName}
          result={result}
          applyChanged={applyChanged}
          undoChanged={undoChanged}
        />
      ),
    })
  }
  // const onRedoLogic = async (flag: string) => {
  //   if (flag === "block") {
  //     const response = await apiManager.logicApi.delete({
  //       blockId: recentCreateBlockId,
  //       projectID,
  //     })
  //     if (apiUtil.isErrorResponse(response)) {
  //       alert(response.message)
  //     }
  //     const logicRes = await apiManager.logicApi.init(projectID)
  //     if (apiUtil.isErrorResponse(logicRes)) {
  //       alert(logicRes.message)
  //       return
  //     }
  //     const linkRes = await apiManager.logicApi.getLinks(projectID)
  //     if (apiUtil.isErrorResponse(linkRes)) {
  //       alert(linkRes.message)
  //       return
  //     }
  //     console.log(flag)
  //   } else if (flag === "option") {
  //     console.log(flag)
  //     // 변경전 옵션 으로 다시 apply
  //   }
  // }

  // const onRedoPower = async (result: LogicPowerNetDto[]) => {
  //   //현재 값을 이전 값에 담음
  //   setPrevPowerJson(
  //     DiagUtil.powerJson({
  //       blocks: matchPartList(blockListState),
  //       powernets: currentPowerNetState,
  //     }),
  //   )
  //   // 결과 값을 현재 값에 담음
  //   setCurrentPowerJson(
  //     DiagUtil.powerJson({
  //       blocks: matchPartList(blockListState),
  //       powernets: result,
  //     }),
  //   )
  // }
  const onUndoPower = () => {
    /* 이전으로 돌리기 */
    // 이전 값을 현재 값에 담음
    undoChanged()
  }
  const onRedoPower = async () => {
    const partRes = await apiManager.partApi.init(Number(router.query.id))
    if (apiUtil.isErrorResponse(partRes)) {
      loadingDispatch(false)
      pauseDispatch(true)
      logicToast.onMessage({
        type: "error",
        content: partRes.message ?? "",
      })
      pauseDispatch(false)
      return
    }
    setCurrentPowerJson(
      DiagUtil.powerJson({
        powernets: prevPowerNetState,
        blocks: mappingBlockList({ blocks: matchPartList(blockListState), parts: partRes }),
      }),
    )
    // modalDispatch({ open: false })
  }
  const applyChanged = async (result: LogicPowerNetDto[]) => {
    const partRes = await apiManager.partApi.init(Number(router.query.id))
    if (apiUtil.isErrorResponse(partRes)) {
      loadingDispatch(false)
      pauseDispatch(true)
      logicToast.onMessage({
        type: "error",
        content: partRes.message ?? "",
      })
      pauseDispatch(false)
      return
    }
    /*변경값 적용 */
    //현재 값을 이전 값에 담음
    setPrevPowerJson(
      DiagUtil.powerJson({
        blocks: mappingBlockList({ blocks: matchPartList(blockListState), parts: partRes }),
        powernets: currentPowerNetState,
      }),
    )
    // 결과 값을 현재 값에 담음
    setCurrentPowerJson(
      DiagUtil.powerJson({
        blocks: mappingBlockList({ blocks: matchPartList(blockListState), parts: partRes }),
        powernets: result,
      }),
    )
  }
  const undoChanged = (isUndo = false) => {
    if (isUndo) {
      if (powerHistory.length < 2) {
        logicToast.onMessage({
          type: "error",
          content: "더 이상 되돌릴 수 없습니다.",
        })
        return
      }
      return
    }
    if (powerHistory.length > 0) {
      setCurrentPowerJson(powerHistory.at(-1) ?? "")
      setPowerHistory(state => state.splice(0, state.length - 1))
    }
  }
  const nextLogic = async () => {
    loadingDispatch(true)
    const response = await apiManager.logicApi.next(projectID)
    if (apiUtil.isErrorResponse(response)) {
      loadingDispatch(false)
      pauseDispatch(true)
      logicToast.onMessage({
        type: "error",
        content: response.message ?? "",
      })
      pauseDispatch(false)
      return
    }
    loadingDispatch(false)
    void router.push(`/layout/${String(router.query.id)}`)
  }
  const onLink = async (blockId: string, targetBlockId: string) => {
    const selectBlock = linkState.find(link => link.block_id === blockId)
    const tagetBlock = linkState.find(link => link.block_id === targetBlockId)
    const changedLink = [...linkState]
    let linkResult: LogicLinkDto[] = changedLink
    if (selectBlock) {
      const canLink = selectBlock.target_blocks.find(block => block.target_block_id === targetBlockId)
      if (canLink) {
        const alreadyLink = canLink.link_status
        if (alreadyLink) {
          console.log("이 블록에는 이미 연결되어 있음")
          return
        } else {
          console.log("연결 가능")
          // 여기서 linkState 바꾸기
          const result: LogicLinkDto[] = changedLink.map(e => {
            if (e.block_id === blockId) {
              const target = e.target_blocks.map(b => {
                if (b.target_block_id === targetBlockId) {
                  return {
                    ...b,
                    link_status: true,
                  }
                } else {
                  return b
                }
              })
              return plainToInstance(LogicLinkDto, {
                ...e,
                target_blocks: target,
              }).toJson<LogicLinkDto>()
            } else {
              return e
            }
          })

          linkResult = result
        }
      } else {
        console.log("이 블록에는 연결할 수 없음")
        return
      }
    }
    console.log("result : ", linkResult)
    // loadingDispatch(true)
    // const response = await apiManager.logicApi.editLinks(linkResult)
    // if (apiUtil.isErrorResponse(response)) {
    //   loadingDispatch(false)
    //   pauseDispatch(true)
    //   logicToast.onMessage({
    //     type: "error",
    //     content: response.message ?? "",
    //   })
    //   pauseDispatch(false)
    //   return
    // }
    const partRes = await apiManager.partApi.init(Number(router.query.id))
    if (apiUtil.isErrorResponse(partRes)) {
      loadingDispatch(false)
      pauseDispatch(true)
      logicToast.onMessage({
        type: "error",
        content: partRes.message ?? "",
      })
      pauseDispatch(false)
      return
    }
    setLinkState(linkResult)
    setCurrentLogicLinkJson(
      DiagUtil.logicJson({
        blocks: mappingBlockList({ blocks: matchPartList(blockListState), parts: partRes }),
        links: linkResult,
      }),
    )
    // loadingDispatch(false)
  }

  if (errorMsg !== "") {
    alert(errorMsg)
    return
  }
  if (currentLogicLinkJson === "" || currentPowerJson === "") return
  return (
    <LayoutMain>
      <>{logicToast.contextHolder}</>
      <CanvasWrapper
        Switch={<PowerToLogicToggleSwitch onToggleChange={onToggleChange} />}
        flag
        isLogic={toggle}
        setOpenCustom={setOpenCustom}
        onAddPowerNet={onAddPowerNet}
        onAddCustomBlock={onAddCustomBlock}
        setContextMenuPositon={setContextMenuPositon}
      >
        <BasicButton className={styles.next_button_box} onClick={nextLogic}>
          <Image src={imgAsset.arrowNext} width={24} height={24} alt="next" />
        </BasicButton>
        <>
          {openContextMenu ? (
            toggle ? (
              <LogicContextMenu
                onCloneBlock={async () => {
                  closeContextMenu()
                  if (selectBlockID === "") {
                    return
                  }
                  await onCloneBlock({ blockID: selectBlockID })
                }}
                position={contextMenuPositon}
                onZoomIn={() => {
                  menuHooks.setZoomIn()
                  closeContextMenu()
                }}
                onZoomout={() => {
                  menuHooks.setZoomOut()
                  closeContextMenu()
                }}
                onResetView={() => {
                  menuHooks.resetView()
                  closeContextMenu()
                }}
                setOpenCustom={async () => {
                  await onAddCustomBlock()
                  closeContextMenu()
                }}
              />
            ) : (
              <PowerContextMenu
                position={contextMenuPositon}
                onZoomIn={() => {
                  menuHooks.setZoomIn()
                  closeContextMenu()
                }}
                onZoomout={() => {
                  menuHooks.setZoomOut()
                  closeContextMenu()
                }}
                onResetView={() => {
                  menuHooks.resetView()
                  closeContextMenu()
                }}
                onAddPowerNet={() => {
                  closeContextMenu()
                  onAddPowerNet()
                }}
              />
            )
          ) : null}
          {openInfo ? (
            <Col className={styles.option_modal_container}>
              <BlockInfoModal blockInfo={selectBlock} setOpenInfo={setOpenInfo} allUpdate={allUpdate} />
            </Col>
          ) : null}
          {openCustom ? (
            <Col className={styles.option_modal_container}>
              <SetCustomBlockModal
                setOpenCustom={setOpenCustom}
                customBlockId={selectBlockID}
                setBlockListState={setBlockListState}
                setLinkState={setLinkState}
                setCurrentPowerNetState={setCurrentPowerNetState}
                setCurrentLogicLinkJson={setCurrentLogicLinkJson}
                setCurrentPowerJson={setCurrentPowerJson}
                allUpdate={allUpdate}
              />
            </Col>
          ) : null}
          {openPower ? (
            <Col className={styles.option_modal_container}>
              {selectPower?.category === "Subpart" ? (
                <PowerInfoModal
                  allUpdate={allUpdate}
                  blockInfo={selectPower}
                  setBlockInfo={setSelectPower}
                  setBlockListState={setBlockListState}
                  setOpenPower={setOpenPower}
                  setCurrentPowerJson={setCurrentPowerJson}
                  setCurrentLogicLinkJson={setCurrentLogicLinkJson}
                />
              ) : (
                <BlockInfoModal blockInfo={selectPower} setOpenInfo={setOpenPower} allUpdate={allUpdate} />
              )}
            </Col>
          ) : null}
        </>
        {toggle ? (
          <LogicDiag
            onLink={(blockId: string, targetBlockId: string) => onLink(blockId, targetBlockId)}
            onDoublClick={() => {
              closeContextMenu()
              setOpenInfo(false)
              setOpenCustom(false)
              setOpenPower(false)
            }}
            menuHooks={menuHooks}
            onRightDown={() => {
              // const [openContextMenu, setOpenContextMenu] = useState(false)
              setOpenContextMenu(true)
            }}
            json={currentLogicLinkJson}
            width={window.innerWidth - 70}
            height={window.innerHeight - 70}
            onUndo={onUndoLogic}
            onRedo={onRedoLogic}
            onCopy={(id: string) => onCopy(id)}
            onPaste={onPaste}
            onClick={(id: string) => {
              const isCustom = blockListState.find(block => block.block_id === id)?.category === "Custom"
              if (isCustom) {
                setSelectBlockID(id)
                setOpenCustom(true)
                setOpenInfo(false)
              } else {
                onLogicBlockClick(id)
              }
            }}
            onRelease={onLogicRealse}
          />
        ) : (
          <PowerDiag
            menuHooks={menuHooks}
            onRightDown={() => setOpenContextMenu(true)}
            json={currentPowerJson}
            width={window.innerWidth - 70}
            height={window.innerHeight - 70}
            onUndo={() => {
              onUndoPower()
              closeContextMenu()
            }}
            onRedo={async () => {
              await onRedoPower()
              closeContextMenu()
            }}
            onClick={(id: string) => {
              console.log(id)
              onPowerBlockClick(id)
              closeContextMenu()
            }}
            onRelease={onPowerRelease}
            onNetChanged={async (movedBlockId: string, newNetName: string) => {
              console.log("movedBlockId : ", movedBlockId)
              console.log("newNetName : ", newNetName)
              closeContextMenu()
              await onNetChanged({ movedBlockId, newNetName })
            }}
          />
        )}
      </CanvasWrapper>
    </LayoutMain>
  )
}
export default LogicPage
