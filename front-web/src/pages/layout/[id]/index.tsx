import styles from "./layout.module.scss"
import Image from "next/image"
import { CanvasWrapper } from "components/Wrapper"
import { useRef, useState } from "react"
import { LayoutMain } from "Layout"
import { BasicButton, buttonStyle } from "components/Button"
import { useAsyncEffect, useRedux, useToast } from "hooks"
import { setCheck, setLoading, setPause } from "redux/reducers/config"
import { BlockInfoLayoutModal, CheckPointModal, SettingLayoutParameterModal } from "components/Modal"
import { useRouter } from "next/router"
import LayoutDiag from "components/Diagram/LayoutDiagram"
import { DiagUtil } from "components/Diagram/Utils/Test"
import { Col, Row } from "antd"
import { apiManager, apiUtil } from "apis"
import { LayoutBoardDto, LayoutParams, LogicCustomInitDto } from "apis/dto"
import { PartBlock } from "components/Extras"
import { CATEGORY_COLOR } from "@const/block.const"
import { imgAsset } from "@assets/image"
import { PROJECT_ALERT } from "@const/alarm.const"
import { API_ERROR_MSG } from "@const/api.error.const"
import { plainToInstance } from "class-transformer"
import { useDiagMenu } from "components/Diagram/useDiagMenu"
import { DiagBlockConst, EDiagCollisionDetectType } from "components/Diagram/Models/Block"
import { boardPlaceCheck, getCheckPoint, mappingAutoPlacement } from "utils"
import { MODIFIED_STEP } from "@const/project.const"

const LayoutPage = () => {
  const router = useRouter()
  const checkDispatch = useRedux(setCheck)
  const loadingDispatch = useRedux(setLoading)
  const pauseDispatch = useRedux(setPause)
  const menuHooks = useDiagMenu()
  const [openInfo, setOpenInfo] = useState(false)
  const [openSetting, setOpenSetting] = useState(false)
  const [ableNext, setAbleNext] = useState(false)

  const layoutToast = useToast()
  const [paramState, setParamState] = useState<LayoutParams | null>(null)
  const [blockList, setBlockList] = useState<LogicCustomInitDto[]>([])
  const [blockListState, setBlockListState] = useState<LogicCustomInitDto[]>([])

  const initialCartListRef = useRef<LogicCustomInitDto[]>([])
  const [cartListState, setCartListState] = useState<LogicCustomInitDto[]>([])

  const [boardPropsState, setBoardPropsState] = useState<LayoutBoardDto>()
  const [errorMsg, setErrorMsg] = useState("")
  const [diagJson, setDiagJson] = useState("")
  const [selectBlock, setSelectBlock] = useState<LogicCustomInitDto | null>(null)
  const [selectBlockId, setSelectBlockId] = useState<string>("")

  const jsonHistoryRef = useRef<string[]>([])
  const jsonHistoryIdx = useRef<number>(0)

  useAsyncEffect(async () => {
    if (!router.query.id) return
    loadingDispatch(true)
    const projectRes = await apiManager.projectApi.getDetail(Number(router.query.id))
    if (apiUtil.isErrorResponse(projectRes)) {
      loadingDispatch(false)
      layoutToast.onMessage({
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
    const initRes = await apiManager.logicApi.init(Number(router.query.id))
    const boardProps = await apiManager.layoutApi.getBoard(Number(router.query.id))
    const response = await apiManager.layoutApi.getParams(Number(router.query.id))
    if (apiUtil.isErrorResponse(response)) {
      alert(response)
      return
    }
    console.log(6464, response)
    setParamState(response)
    if (apiUtil.isErrorResponse(initRes) || apiUtil.isErrorResponse(boardProps)) {
      if ("message" in initRes) {
        setErrorMsg(initRes.message ?? "")
      } else if ("message" in boardProps) {
        setErrorMsg(boardProps.message ?? "")
      }
    } else {
      setBlockList(initRes)

      const filteredBlockList = initRes
        .filter(v => v.category !== "Subpart")
        .map((v, index) => ({ ...v, index }) as LogicCustomInitDto)

      setBlockListState(filteredBlockList)
      setCartListState(filteredBlockList)
      initialCartListRef.current = filteredBlockList

      const boardShpae = [
        { x: 0, y: 0, r: 0 },
        { x: 300, y: 0, r: 0 },
        { x: 300, y: 200, r: 0 },
        { x: 0, y: 200, r: 0 },
      ]
      setBoardPropsState(boardProps)
      setDiagJson(
        DiagUtil.layoutJson({
          blocks: initRes,
          layout: plainToInstance(LayoutBoardDto, {
            ...boardProps,
            shape: boardProps.shape.length === 0 ? boardShpae : boardProps.shape,
          }).toJson<LayoutBoardDto>(),
        }),
      )

      const data = DiagUtil.layoutJson({
        blocks: initRes,
        layout: plainToInstance(LayoutBoardDto, {
          ...boardProps,
          shape: boardProps.shape.length === 0 ? boardShpae : boardProps.shape,
        }).toJson<LayoutBoardDto>(),
      })

      setDiagJson(data)

      jsonHistoryRef.current = [data]
    }

    if ((errorMsg as API_ERROR_MSG) === API_ERROR_MSG.MCU_PIN_OVER) {
      layoutToast.onMessage({
        type: "error",
        content: PROJECT_ALERT["E004"].kor,
      })
      return
    }
    loadingDispatch(false)
  }, [router.query.id])

  const nextLayout = async () => {
    if (cartListState.length > 0 || !ableNext) {
      pauseDispatch(true)
      layoutToast.onMessage({
        type: "error",
        content: "부품 배치를 완료해주세요.",
      })
      pauseDispatch(false)
      return
    }
    loadingDispatch(true)
    if (boardPropsState) {
      const response = await apiManager.layoutApi.next({ projectId: Number(router.query.id), board: boardPropsState })
      if (apiUtil.isErrorResponse(response)) {
        loadingDispatch(false)
        pauseDispatch(true)
        layoutToast.onMessage({
          type: "error",
          content: response.message ?? "",
        })
        pauseDispatch(false)
        return
      }
      loadingDispatch(false)
      void router.push(`/result/id/?id=${String(router.query.id)}`)
    }
  }
  const saveLayout = async () => {
    if (boardPropsState) {
      const response = await apiManager.layoutApi.save({
        projectId: Number(router.query.id),
        board: boardPropsState,
      })
      if (apiUtil.isErrorResponse(response)) {
        alert(response.message)
        return
      }
    }
  }

  const onAutoPlacement = async () => {
    if (boardPropsState) {
      loadingDispatch(true)
      const autoResponse = await apiManager.layoutApi.autoplace({
        projectId: Number(router.query.id),
        board: boardPropsState,
      })
      if (apiUtil.isErrorResponse(autoResponse)) {
        loadingDispatch(false)
        layoutToast.onMessage({
          type: "error",
          content: autoResponse.message ?? "",
        })
        return
      }
      const initRes = await apiManager.logicApi.init(Number(router.query.id))
      if (apiUtil.isErrorResponse(initRes)) {
        loadingDispatch(false)
        layoutToast.onMessage({
          type: "error",
          content: initRes.message ?? "",
        })
        return
      }
      if (initialCartListRef.current.length !== cartListState.length) {
        const placedBlock = boardPlaceCheck({ blocks: blockList, board: boardPropsState })

        const boardValid = DiagBlockConst.testCD(placedBlock, boardPropsState?.shape ?? [])
        if (boardValid.type === EDiagCollisionDetectType.Block) {
          setAbleNext(false)
          layoutToast.onMessage({
            type: "error",
            content: PROJECT_ALERT.E002.kor,
          })
          setDiagJson(
            DiagUtil.layoutJson({
              blocks: initRes,
              layout: mappingAutoPlacement({ boardValid, autoResponse }),
            }),
          )
        } else if (boardValid.type === EDiagCollisionDetectType.Board) {
          setAbleNext(false)
          layoutToast.onMessage({
            type: "error",
            content: PROJECT_ALERT.E003.kor,
          })
        }
        setDiagJson(
          DiagUtil.layoutJson({
            blocks: initRes,
            layout: mappingAutoPlacement({ boardValid, autoResponse }),
          }),
        )
      } else {
        setAbleNext(true)
        setDiagJson(
          DiagUtil.layoutJson({
            blocks: initRes,
            layout: autoResponse,
          }),
        )
      }

      setBoardPropsState(autoResponse)
    }
    setCartListState([])
    loadingDispatch(false)
  }

  // const [placeLayout, setPlaceLayout] = useState
  const onPlace = (id: string, isTop: boolean) => {
    console.log(isTop)
    console.log("place a block!!!")
    setCartListState(state => state.filter(e => e.block_id !== id).sort((a, b) => a.index - b.index))
  }

  const onDeleteBlocks = (id: string) => {
    const block = initialCartListRef.current.find(v => v.block_id === id)

    if (block == undefined) return

    setCartListState(state => [...state, block].sort((a, b) => a.index - b.index))

    setDiagJson(state => {
      const prevState: { layout: LayoutBoardDto } = JSON.parse(state)

      const deleted_layout_blocks_json = prevState.layout.layout_blocks.map(e => {
        if (e.block_id === id) {
          return { ...e, is_placed: false }
        } else return e
      })

      const data = DiagUtil.layoutJson({
        blocks: blockListState,
        layout: plainToInstance(LayoutBoardDto, {
          ...prevState.layout,
          layout_blocks: deleted_layout_blocks_json,
        }).toJson<LayoutBoardDto>(),
      })

      jsonHistoryRef.current = [...jsonHistoryRef.current, data]
      jsonHistoryIdx.current = Math.max(0, jsonHistoryRef.current.length - 1)

      return data
    })
  }

  const redoLayout = () => {
    console.log("redo!!!")

    const redoJson = jsonHistoryRef.current[jsonHistoryIdx.current + 1]

    if (!redoJson) {
      return
    }
    const currentJson = jsonHistoryRef.current[jsonHistoryIdx.current]

    const parsedredoJson: { layout: LayoutBoardDto } = JSON.parse(redoJson)
    const parsedCurrentJson: { layout: LayoutBoardDto } = JSON.parse(currentJson)

    const changedBlockData = findChangedIsPlaced(
      parsedredoJson.layout.layout_blocks,
      parsedCurrentJson.layout.layout_blocks,
    )

    console.log(changedBlockData)

    setCartListState(list => {
      const updatedListWithoutTrueToFalse = list.filter(item => {
        return !changedBlockData.trueToFalse?.some(changedBlock => changedBlock.block_id === item.block_id)
      })
      const updatedList = [...updatedListWithoutTrueToFalse, ...(changedBlockData?.falseToTrue ?? [])]

      return updatedList.sort((a, b) => a.index - b.index)
    })

    setDiagJson(redoJson)

    jsonHistoryIdx.current = Math.min(jsonHistoryIdx.current + 1, jsonHistoryRef.current.length)
  }

  const undoLayout = () => {
    console.log("undo!!!")

    const undoJson = jsonHistoryRef.current[jsonHistoryIdx.current - 1]

    if (!undoJson) {
      return
    }

    const currentJson = jsonHistoryRef.current[jsonHistoryIdx.current]

    const parsedUndoJson: { layout: LayoutBoardDto } = JSON.parse(undoJson)
    const parsedCurrentJson: { layout: LayoutBoardDto } = JSON.parse(currentJson)

    // const changedBlockIds = parsedUndoJson.layout.layout_blocks
    //   .filter(currentBlock => {
    //     const correspondingPrevBlock = parsedCurrentJson.layout.layout_blocks.find(
    //       prevBlock => prevBlock.block_id === currentBlock.block_id,
    //     )

    //     return correspondingPrevBlock && correspondingPrevBlock.is_placed && !currentBlock.is_placed
    //   })
    //   .map(changedBlock => initialCartListRef.current.find(v => v.block_id === changedBlock.block_id))

    const changedBlockData = findChangedIsPlaced(
      parsedUndoJson.layout.layout_blocks,
      parsedCurrentJson.layout.layout_blocks,
    )

    console.log(changedBlockData)

    setCartListState(list => {
      const updatedListWithoutTrueToFalse = list.filter(item => {
        return !changedBlockData.trueToFalse?.some(changedBlock => changedBlock.block_id === item.block_id)
      })
      const updatedList = [...updatedListWithoutTrueToFalse, ...(changedBlockData?.falseToTrue ?? [])]

      return updatedList.sort((a, b) => a.index - b.index)
    })

    setDiagJson(undoJson)

    jsonHistoryIdx.current = Math.max(0, jsonHistoryIdx.current - 1)
  }

  const findChangedIsPlaced = (prev: LayoutBoardDto["layout_blocks"], current: LayoutBoardDto["layout_blocks"]) => {
    const changedStates = current.reduce(
      (acc: { trueToFalse: LogicCustomInitDto[]; falseToTrue: LogicCustomInitDto[] }, currentBlock) => {
        const matchingBlock = prev.find(prevBlock => prevBlock.block_id === currentBlock.block_id)

        const block = initialCartListRef.current.find(c => c.block_id === currentBlock.block_id)

        if (block === undefined) return acc

        if (matchingBlock && matchingBlock.is_placed && !currentBlock.is_placed) {
          acc.trueToFalse.push(block)
        } else if (matchingBlock && !matchingBlock.is_placed && currentBlock.is_placed) {
          acc.falseToTrue.push(block)
        }

        return acc
      },
      { trueToFalse: [], falseToTrue: [] },
    )

    return changedStates
  }

  const onUpdateJson = (json: string) => {
    console.log(`updated`)
    const updatedJson: { layout: LayoutBoardDto } = JSON.parse(json)

    setBoardPropsState(state => {
      return plainToInstance(LayoutBoardDto, {
        ...state,
        ...updatedJson.layout,
      }).toJson<LayoutBoardDto>()
    })
    setCartListState(state => state.filter(e => e.block_id !== selectBlockId).sort((a, b) => a.index - b.index))

    const newDiagJson = DiagUtil.layoutJson({
      blocks: blockList,
      layout: plainToInstance(LayoutBoardDto, updatedJson.layout).toJson<LayoutBoardDto>(),
    })

    jsonHistoryRef.current = [...jsonHistoryRef.current, newDiagJson]
    jsonHistoryIdx.current = Math.max(0, jsonHistoryRef.current.length - 1)

    setDiagJson(newDiagJson)
  }

  if (diagJson === "") return
  return (
    <LayoutMain>
      {layoutToast.contextHolder}
      <CanvasWrapper Switch={null}>
        <Col className={styles.save_button_box} onClick={async () => saveLayout()}>
          <Image src={imgAsset.saveButton} className={styles.save_button} alt="save" width={24} height={24} />
          <Col className={styles.save_button_text}>SAVE</Col>
        </Col>
        <Row>
          {openInfo ? (
            <Col className={styles.option_modal_container}>
              <BlockInfoLayoutModal blockInfo={selectBlock} setOpenInfo={setOpenInfo} />
            </Col>
          ) : null}
          {openSetting ? (
            <Col className={styles.setting_modal_container} onClick={() => setOpenSetting(false)}>
              <SettingLayoutParameterModal
                projectId={Number(router.query.id)}
                blockList={blockListState.filter(v => v.category !== "Subpart" && v.type !== "Inertial")}
                setOpenSetting={setOpenSetting}
                paramState={paramState}
                setParamState={setParamState}
              />
            </Col>
          ) : null}
          <LayoutDiag
            menuHooks={menuHooks}
            onRightDown={() => {}}
            json={diagJson}
            gridSize={paramState?.preference_params.grid_size ?? 11}
            // CAUTION: layout 정보만 줌
            onUpdateJson={(json: string) => onUpdateJson(json)}
            width={window.innerWidth - 350}
            height={window.innerHeight - 70}
            onUndo={undoLayout}
            onRedo={redoLayout}
            onClick={(id: string) => {
              console.log(`click!!! id: ${id}`)
              setOpenInfo(true)
              setSelectBlockId(id)
              setSelectBlock(blockListState.find(e => e.block_id === id) ?? null)
            }}
            onRelease={() => {
              console.log(`Released: no selected block.`)
              setSelectBlockId("")
              setSelectBlock(null)
              setOpenInfo(false)
            }}
            onSetting={() => {
              console.log("setting!!!")
              setOpenSetting(true)
            }}
            onPlaceBlock={(id: string, isTop: boolean) => {
              setSelectBlockId(id)
              onPlace(id, isTop)
            }}
            onDeleteBlocks={(id: string[]) => {
              onDeleteBlocks(id[0])
            }}
            dragBlockId={selectBlockId}
          />
          <Col className={styles.cart_container}>
            <Col className={styles.cart_wrapper}>
              <Row className={styles.cart_title_wrapper}>
                <Col className={styles.cart_title}>Blocks</Col>
              </Row>
              <div className={styles.blocks_wrapper}>
                <div className={styles.blocks_box}>
                  {cartListState
                    .filter(v => v.category !== "Subpart")
                    .map(block => (
                      <div key={block.block_id} className={styles.block_box}>
                        <PartBlock
                          src={process.env.NEXT_PUBLIC_S3_URL + block.icon}
                          activeColor={CATEGORY_COLOR[block.category as keyof typeof CATEGORY_COLOR]}
                          onClick={() => {
                            console.log(385, block.block_id)
                            setSelectBlockId(block.block_id)
                          }}
                        >
                          <div>{block.type}</div>
                        </PartBlock>
                      </div>
                    ))}
                </div>
                <Col className={styles.button_wrapper}>
                  <BasicButton className={styles.autoplacement_button} onClick={onAutoPlacement}>
                    Auto Placement
                  </BasicButton>
                </Col>
              </div>
            </Col>
            <Row className={styles.next_button}>
              <BasicButton className={buttonStyle.next_button} onClick={async () => nextLayout()}>
                Next →
              </BasicButton>
            </Row>
          </Col>
        </Row>
      </CanvasWrapper>
    </LayoutMain>
  )
}

export default LayoutPage
