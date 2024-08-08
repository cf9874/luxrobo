import { useMemo, useState } from "react"
import Image from "next/image"
import { Col, ConfigProvider, Row, Space, Tabs, Layout as AntdLayout } from "antd"
import styles from "./feature.module.scss"
import { CATEGORY_COLOR, CATEGORY_INDEX, MENU_TITLE, isMenuTitle } from "const"
import { BasicButton, buttonStyle } from "components/Button"
import { BasicInput } from "components/Input"
import { FeatureBlock } from "components/Extras/Block.feature"
import { LayoutMain } from "Layout"
import { imgAsset } from "assets/image"
import { useRedux } from "hooks/useRedux"
// import { StoreBlock } from "redux/reducers/cart"
// import { StoreBlock, pushStoreBlock, removeStoreBlock, updateStoreBlock } from "redux/reducers/cart"
import { plainToInstance } from "class-transformer"
import { featureMenuJson } from "json"
// import { FeatureBlockDto, FeatureDto, FeatureInitDto } from "apis/dto"
import { FeatureDto, FeatureInitDto } from "apis/dto"
// import { useAppSelector } from "hooks"
// import { shallowEqual } from "react-redux"
import { setLoading, setModal, setPause } from "redux/reducers/config"
import { FeatureOptionModal } from "components/Modal"
import { CloseOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { apiManager } from "apis"
import { useRouter } from "next/router"
import { apiUtil } from "apis/api.util"
import { useAsyncEffect, useInputs, useToast } from "hooks"
import { PROJECT_ALERT } from "@const/alarm.const"
import AuthHoc from "hoc/AuthHoc"
import { ArrayUtils, getCheckPoint, mappingFeatureIndex } from "utils"
import { MODIFIED_STEP } from "@const/project.const"

// 서버에서 제공해주지 않은 index, id값등을 추가 해야하는 부분이 있기 때문에
// cartList를 최종 이용할 때에는 꼭 combineCartWithEmpty().map 등으로 이용해야함.

const { Sider, Content } = AntdLayout
const mcu: FeatureDto = plainToInstance(FeatureDto, {
  icon: "/icons/mcu.svg",
  category: "MCU",
  id: 9999,
  block_id: "",
  part_id: "BwUEsweDDEwTcfgVxZT85R",
  custom: false,
  selected_option: {
    AntennaBuiltIn: "Yes",
    Bluetooth: "Yes",
    DebugMCU: "UART",
    GPIOHeader: "No",
    ResetSwitch: "No",
    SDCard: "No",
    WiFi: "Yes",
  },
  type: "MCU",
}).toJson<FeatureDto>()
// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const apiCaller = apiManager.updateContext(ctx)

//   const [initRes, cartRes] = await Promise.all([
//     apiCaller.featureApi.init({ ids: [] }),
//     apiCaller.featureApi.load(Number(ctx.query.id)),
//   ])

//   if (apiUtil.isErrorResponse(initRes)) {
//     alert(initRes.message)
//     return {
//       props: { featureList: [], featureCartList: [], errorMsg: initRes.message },
//     }
//   } else if (apiUtil.isErrorResponse(cartRes)) {
//     return {
//       props: { featureList: [], featureCartList: [], errorMsg: cartRes.message },
//     }
//   }

//   return {
//     props: { featureList: initRes, featureCartList: cartRes, errorMsg: "" },
//   }
// }

const FeaturePage = () => {
  const router = useRouter()
  const modalDispatch = useRedux(setModal)
  const loadingDispatch = useRedux(setLoading)
  const pauseDispatch = useRedux(setPause)
  // const cartList = useAppSelector(state => state.cartReducer, shallowEqual)
  const featureToast = useToast()

  const [blockList, setBlockList] = useState<FeatureInitDto[]>([])
  const [searchBlockList, setSearchBlockList] = useState<FeatureInitDto[]>([])

  const [cartListState, setCartListState] = useState<(FeatureDto | "")[]>([])

  const [currentMenuTitle, setCurrentMenuTitle] = useState<MENU_TITLE>(MENU_TITLE.ALL)

  const [editMode, setEditMode] = useState(false)
  const [duplicateMode, setDuplicateMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)

  // // 부품 상관없이 수시로 바뀌는 option State
  // // 모달창을 열때 setState하고 모달창을 닫을때 setState해서 cart에 담음
  // // cart에 담고나서는 state 비우기
  // // 최초에는 추천옵션 또는 원래있던 옵션으로 설정하고
  // const [prevOption, setPrevOption] = useState<{
  //   selected_options: {
  //     [key: string]: string | undefined
  //   }
  // }>()

  // const [currentOption, setCurrentOption] = useState<{
  //   selected_options: {
  //     [key: string]: string | undefined
  //   }
  // }>()
  /*
  // const pushBlockDispatch = useRedux(pushStoreBlock)

  // const removeBlockDispatch = useRedux(removeStoreBlock)

  // const updateBlockDispatch = useRedux(updateStoreBlock)

  // const resetCartDispatch = useRedux(resetCartList)
  // console.log(cartList)
 */
  useAsyncEffect(async () => {
    if (router.query.id === undefined) return

    loadingDispatch(true)

    const projectRes = await apiManager.projectApi.getDetail(Number(router.query.id))
    if (apiUtil.isErrorResponse(projectRes)) {
      loadingDispatch(false)
      featureToast.onMessage({
        type: "error",
        content: projectRes.message ?? "",
      })
      return
    }
    const current = router.route.split("/")[1] as keyof typeof MODIFIED_STEP
    const checkPoint = getCheckPoint({ current, checkPoint: projectRes.checkpoint })

    if (!checkPoint) {
      loadingDispatch(false)
      void router.push(`/current/${Number(router.query.id)}`)
      return
    }
    const customList = await apiManager.blockApi.getList(projectRes?.teamID ? projectRes.teamID : undefined)
    if (apiUtil.isErrorResponse(customList)) {
      loadingDispatch(false)

      featureToast.onMessage({
        type: "error",
        content: customList.message ?? "",
      })

      return
    }
    const ids = customList.map(v => v.customblockID)
    const initRes = await apiManager.featureApi.init({ ids })
    // console.log(111, initRes)
    if (apiUtil.isErrorResponse(initRes)) {
      loadingDispatch(false)

      featureToast.onMessage({
        type: "error",
        content: initRes.message ?? "",
      })

      return
    } else {
      setBlockList(mappingFeatureIndex(initRes))
      setSearchBlockList(initRes.filter(v => v.type !== "MCU"))
    }
    const cartList = await apiManager.featureApi.load(Number(router.query.id))
    if (apiUtil.isErrorResponse(cartList)) {
      loadingDispatch(false)
      featureToast.onMessage({
        type: "error",
        content: cartList.message ?? "",
      })

      return
    } else {
      if (cartList.length === 0) {
        setCartListState([mcu])
      } else {
        setCartListState(
          cartList.map((list, index) => {
            // cart에서 아이템을 삭제하기위한 고유번호(index) 부여, Subpart는 cart에 포함되지않음
            return plainToInstance(FeatureDto, {
              ...list,
              id: list.category === "Subpart" ? -1 : index,
            }).toJson<FeatureDto>()
          }),
        )
      }
    }
    if (projectRes.checkpoint === MODIFIED_STEP.feature) {
      featureToast.onMessage({
        type: "info",
        content: PROJECT_ALERT["I001"].kor,
      })
    }
    loadingDispatch(false)
  }, [router.query.id])

  const selectedMenuData = useMemo(
    () =>
      featureMenuJson.find(v => {
        return isMenuTitle(v.title) && v.title === currentMenuTitle
      }),
    [currentMenuTitle],
  )

  /*
  // const updateBlockList = (instance: FeatureBlockDto) => {
  //   const updatedJsonDto = instance.toJson<FeatureBlockDto>()
  //   setBlockList(list =>
  //     list.map(block => {
  //       return instance.isSameBlock(block.type) ? updatedJsonDto : block
  //     }),
  //   )
  //   return updatedJsonDto
  // }

  // const updateCartList = (instance: FeatureBlockDto, updatedJsonDto: FeatureBlockDto, isPush: boolean) => {
  //   const storeBlockIndex = cartList.findIndex(v => instance.isSameBlock(v.type))
  //   // if (storeBlockIndex !== -1) {
  //   // } else {

  //   isPush ? pushBlockDispatch(updatedJsonDto) : removeBlockDispatch(updatedJsonDto)
  //   updateBlockDispatch({ index: storeBlockIndex, updatedBlock: updatedJsonDto })
  //   // }
  // }

  // const onClickBlock = (block: FeatureBlockDto | StoreBlock, storeBlock?: StoreBlock) => {
  //   const instance = plainToInstance(FeatureBlockDto, storeBlock ? storeBlock : block)
  //   instance.increaseCount()

  //   const updatedJsonDto = updateBlockList(instance)
  //   updateCartList(instance, updatedJsonDto, true)
  // }

  // const onRemoveBlock = (block: FeatureBlockDto | StoreBlock, storeBlock?: StoreBlock) => {
  //   const instance = plainToInstance(FeatureBlockDto, storeBlock ? storeBlock : block)
  //   instance.decreaseCount()

  //   const updatedJsonDto = updateBlockList(instance)
  //   updateCartList(instance, updatedJsonDto, false)
  // }

  // const getMatchingBlock = (block: FeatureBlockDto | StoreBlock) => {
  //   const instance = plainToInstance(FeatureBlockDto, block)

  //   return cartList.find(v => instance.isSameBlock(v.type))
  // }
*/

  const addBlock = (featureBlock: FeatureInitDto, cartItem: FeatureDto) => {
    const newFeatureList = mappingFeatureListForCount([...blockList, featureBlock], true)
    setBlockList(newFeatureList)
    setCartListState(list => [...list, cartItem])
    featureToast.onMessage({
      type: "success",
      content: PROJECT_ALERT["S004"].kor,
    })
  }
  const duplicateBlock = (featureBlock: FeatureInitDto, cartBlock: FeatureDto) => {
    const duplicatedBlock = cartBlock
    duplicatedBlock.block_id = ""
    setCartListState(list => [...list, duplicatedBlock])
    const newFeatureList = mappingFeatureListForCount([...blockList, featureBlock], true)
    setBlockList(newFeatureList)
  }
  const removeBlock = (featureBlock: FeatureInitDto, cartItem: FeatureDto) => {
    const newFeatureList = mappingFeatureListForCount([...blockList, featureBlock], false)
    setBlockList(newFeatureList)
    setCartListState(
      combineCartWithEmpty()
        .filter(list => list !== "")
        .filter(cart => {
          if (cart !== "") {
            return cart.id !== cartItem.id
          }
        }),
    )
  }
  const optionApply = (featureBlock: FeatureInitDto | undefined, cartItem: FeatureDto | undefined) => {
    if (!cartItem || !featureBlock) return
    if (editMode) {
      setCartListState(state => {
        return state.map(cart => {
          if (cart === "") {
            return ""
          } else if (cart.part_id === cartItem.part_id) {
            return cartItem
          } else {
            return cart
          }
        })
      })
    } else {
      addBlock(featureBlock, cartItem)
    }
  }
  const saveFeature = async () => {
    setEditMode(false)
    setDuplicateMode(false)
    setDeleteMode(false)
    const blocks = cartListState
      .filter(v => v !== "")
      .filter(e => {
        if (e !== "") {
          return e.type !== "LDO" && e.type !== "Buck"
        }
      })
      .map(cart => {
        if (cart !== "") {
          return plainToInstance(FeatureDto, {
            block_id: cart.block_id,
            custom: cart.custom,
            part_id: cart.part_id,
            type: cart.type,
            selected_option: cart.selected_option,
          }).toJson<FeatureDto>()
        }
      }) as FeatureDto[]
    const response = await apiManager.featureApi.save({
      projectId: Number(router.query.id),
      blocks: blocks,
    })
    console.log(response)
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }
    featureToast.onMessage({
      type: "success",
      content: PROJECT_ALERT["S010"].kor,
    })
  }
  // console.log(249249, cartListState)
  // console.log(250250, cartListState.length)
  // feature/next
  const nextFeature = async (cartList: FeatureDto[]) => {
    const currentCart = cartListState.filter(e => e !== "") as FeatureDto[]
    const hasMCU = currentCart.find(e => e.category === "MCU")
    if (!hasMCU) {
      featureToast.onMessage({
        type: "error",
        content: "MCU 부품을 추가해주세요.",
      })
      return
    }

    const response = await apiManager.featureApi.next({
      projectId: Number(router.query.id),
      // blocks: cartList,
      blocks: cartList
        .filter(e => e.type !== "LDO")
        .filter(e => e.type !== "Buck")
        .map(cart => {
          return {
            block_id: cart.block_id,
            custom: cart.custom,
            part_id: cart.part_id,
            type: cart.type,
            selected_option: cart.selected_option,
          }
        }),
    })
    console.log(response)
    if (apiUtil.isErrorResponse(response)) {
      featureToast.onMessage({ type: "error", content: response.message ?? "" })
      return
    }
    loadingDispatch(false)
    void router.push(`/part/${String(router.query.id)}`)
  }

  const sliceBlockList = () => {
    const blockListState = mappingFeatureListByCartList(searchBlockList, cartListState)
    const sortList = blockListState.sort((a, b) => {
      const categoryA = a.category.toLocaleUpperCase() as keyof typeof CATEGORY_INDEX
      const categoryB = b.category.toLocaleUpperCase() as keyof typeof CATEGORY_INDEX
      return CATEGORY_INDEX[categoryA] - CATEGORY_INDEX[categoryB]
    })

    const result: { category: MENU_TITLE; blocks: FeatureInitDto[] }[] = []
    sortList.forEach(block => {
      const categoryIndex = result.findIndex(e => e.category === (block.category as MENU_TITLE))
      if (categoryIndex === -1) {
        result.push({ category: block.category as MENU_TITLE, blocks: [block] })
      } else {
        result.find(e => e.category === (block.category as MENU_TITLE))?.blocks.push(block)
      }
    })
    return result
  }
  // resetCartDispatch()
  const combineCartWithEmpty = () => {
    // let list: StoreBlock[] | ""[] = [...cartList]
    let list: (FeatureDto | "")[] = [
      ...cartListState.filter(e => {
        if (e !== "") {
          return e.category.toLocaleLowerCase() !== "subpart"
        }
      }),
    ]

    if (list.length < 16) {
      list = [...list, ...Array(15 - list.length).fill("")]
    } else if (list.length % 3 === 0) {
      list = [...list, ...Array(3).fill("")]
    } else if (list.length % 3 === 1) {
      list = [...list, ...Array(2).fill("")]
    } else {
      list = [...list, ...Array(1).fill("")]
    }

    const indexMap: { [key: string]: number } = {}
    const result = list.map((item, index) => {
      if (item !== "") {
        const { type } = item
        if (indexMap[type] === undefined) {
          indexMap[type] = 1
        } else {
          indexMap[type]++
        }
        if (item.block_id === "") {
          item.icon ===
            (
              cartListState.find(v => {
                if (v !== "") {
                  return v.part_id === item.part_id
                }
              }) as FeatureDto
            )?.icon ?? ""
        }
        return plainToInstance(FeatureDto, {
          ...item,
          index: indexMap[type],
          id: index,
        }).toJson<FeatureDto>()
      } else {
        return ""
      }
    })
    return result
  }
  const mappingFeatureListForCount = (list: FeatureInitDto[], is_add: boolean) => {
    const mappingList = list.reduce((acc: FeatureInitDto[], cur) => {
      const findBlock = acc.find(block => block.type === cur.type && block.category === cur.category)
      if (findBlock) {
        is_add ? findBlock.count++ : findBlock.count--
      } else {
        acc.push(plainToInstance(FeatureInitDto, { ...cur, count: cur.count }).toJson<FeatureInitDto>())
      }
      return acc
    }, [])

    return mappingList
  }
  const mappingFeatureListByCartList = (featureList: FeatureInitDto[], cartList: (FeatureDto | "")[]) => {
    const mappingList: FeatureInitDto[] = []
    featureList.forEach(feature => {
      const matchingFeature = cartList.filter(cart => {
        if (cart !== "") {
          return cart.type === feature.type
        }
      })
      // const matchingFeature = cartList.filter(cart => cart.type === feature.type && cart.category === feature.category)
      const count = matchingFeature.length
      mappingList.push(plainToInstance(FeatureInitDto, { ...feature, count }).toJson<FeatureInitDto>())
    })
    return mappingList
  }
  const searchInput = useInputs({ value: "" })

  return (
    <LayoutMain>
      <>{featureToast.contextHolder}</>
      <Row className={styles.container}>
        <Col className={styles.save_button_box} onClick={saveFeature}>
          <Image src={imgAsset.saveButton} className={styles.save_button} alt="save" width={24} height={24} />
          <Col className={styles.save_button_text}>SAVE</Col>
        </Col>
        <Col className={styles.main}>
          <div className={styles.main_container}>
            <ConfigProvider
              theme={{
                components: {
                  Tabs: {
                    colorPrimary: selectedMenuData?.activeColor ?? "#000",
                    colorPrimaryHover: "#000",
                  },
                },
              }}
            >
              <Tabs
                defaultActiveKey="0"
                items={featureMenuJson.map((v, i) => {
                  return {
                    key: i.toString(),
                    label: (
                      <Row
                        onClick={e => {
                          const text = e.currentTarget.outerText
                          if (isMenuTitle(text)) {
                            if (text === MENU_TITLE.ALL) {
                              setBlockList(blockList)
                            }
                            setCurrentMenuTitle(text)
                          }
                        }}
                        align={"middle"}
                      >
                        <Row>
                          <Image
                            src={
                              imgAsset[
                                (selectedMenuData?.title === v.title ? v.imgName.active : v.imgName.inactive) ?? ""
                              ]
                            }
                            width={24}
                            height={24}
                            alt="title"
                          />
                          {v.title}
                        </Row>
                      </Row>
                    ),
                    children: (
                      <>
                        {currentMenuTitle === MENU_TITLE.ALL ? (
                          sliceBlockList().map((list, index) => (
                            <AntdLayout key={index} className={styles.block_wrapper}>
                              <Sider className={styles.slider} width={20}>
                                <Col
                                  style={{
                                    backgroundColor: CATEGORY_COLOR[list.category as keyof typeof CATEGORY_COLOR],
                                  }}
                                  className={styles.point}
                                />
                                <Col
                                  style={{
                                    backgroundColor: CATEGORY_COLOR[list.category as keyof typeof CATEGORY_COLOR],
                                  }}
                                  className={styles.bar}
                                />
                              </Sider>
                              <Col className={styles.block_list}>
                                <Col className={styles.category_title}>{list.category}</Col>
                                <Content className={styles.contents_container}>
                                  {/* {featureBlockListJson[v.blockListType as keyof typeof featureBlockListJson]?.map( */}
                                  {list.blocks
                                    ?.filter(block => selectedMenuData?.allowCategoryList.includes(block.category))
                                    .map((block, index) => {
                                      const category = block.category as keyof typeof CATEGORY_COLOR
                                      return (
                                        <FeatureBlock
                                          activeColor={block.color === "" ? CATEGORY_COLOR[category] : block.color}
                                          key={index}
                                          className={styles.feature_block}
                                          hoverAction
                                          onClick={() => {
                                            console.log(486486, block)
                                            const currentCart = cartListState.filter(e => e !== "") as FeatureDto[]
                                            const hasMCU = currentCart.find(e => e.category === "MCU")
                                            if (block.category === "MCU" && hasMCU) {
                                              featureToast.onMessage({
                                                type: "error",
                                                content: "현재 MCU 부품은 하나만 지원합니다.",
                                              })
                                              return
                                            }
                                            modalDispatch({
                                              open: true,
                                              children: (
                                                <FeatureOptionModal
                                                  featureList={blockList}
                                                  setSearchBlockList={setSearchBlockList}
                                                  blockData={block}
                                                  onApply={optionApply}
                                                  newIndex={combineCartWithEmpty().length}
                                                />
                                              ),
                                            })
                                          }}
                                          src={`${process.env.NEXT_PUBLIC_S3_URL}${block.icon}`}
                                          // src={process.env.NEXT_PUBLIC_S3_URL + "/icons/current.svg"}
                                          count={block.count}
                                        >
                                          <div style={{ width: 80 }}>{block.type}</div>
                                        </FeatureBlock>
                                      )
                                    })}
                                </Content>
                              </Col>
                            </AntdLayout>
                          ))
                        ) : currentMenuTitle !== MENU_TITLE.POWER ? (
                          <AntdLayout className={styles.block_wrapper}>
                            <Sider className={styles.slider} width={20}>
                              <Col
                                style={{
                                  backgroundColor: v.activeColor,
                                }}
                                className={styles.point}
                              />
                              <Col
                                style={{
                                  backgroundColor: v.activeColor,
                                }}
                                className={styles.bar}
                              />
                            </Sider>
                            <Col className={styles.block_list}>
                              <Col className={styles.category_title}>{v.title}</Col>
                              <Content className={styles.contents_container}>
                                {(
                                  sliceBlockList().filter(
                                    block => selectedMenuData?.allowCategoryList.includes(block.category),
                                  )[0] ?? []
                                ).blocks?.map((block, index) => {
                                  const category = block.category as keyof typeof CATEGORY_COLOR

                                  return (
                                    <FeatureBlock
                                      activeColor={block.color === "" ? CATEGORY_COLOR[category] : block.color}
                                      key={index}
                                      className={styles.feature_block}
                                      onClick={() => {
                                        console.log(544544, block)
                                        const cartItem = cartListState.find(cart => {
                                          if (cart !== "") {
                                            return cart.type === block.type
                                          }
                                        })
                                        modalDispatch({
                                          open: true,
                                          children: (
                                            <FeatureOptionModal
                                              featureList={blockList}
                                              setSearchBlockList={setSearchBlockList}
                                              cartItem={cartItem !== "" ? cartItem : undefined}
                                              newIndex={combineCartWithEmpty().length}
                                              blockData={block}
                                              onApply={optionApply}
                                            />
                                          ),
                                        })
                                      }}
                                      src={`${process.env.NEXT_PUBLIC_S3_URL}${block.icon}`}
                                      // src={process.env.NEXT_PUBLIC_S3_URL + "/icons/current.svg"}
                                      count={block.count}
                                    >
                                      <div style={{ width: 80 }}>{block.type}</div>
                                    </FeatureBlock>
                                  )
                                })}
                              </Content>
                            </Col>
                          </AntdLayout>
                        ) : (
                          <AntdLayout className={styles.block_wrapper_power}>
                            <Col className={styles.block_box}>
                              <Sider className={styles.slider} width={20}>
                                <Col
                                  style={{
                                    backgroundColor: CATEGORY_COLOR.PowerIn,
                                  }}
                                  className={styles.point}
                                />
                                <Col
                                  style={{
                                    backgroundColor: CATEGORY_COLOR.PowerIn,
                                  }}
                                  className={styles.bar}
                                />
                              </Sider>
                              <Col className={styles.block_list}>
                                <Col className={styles.category_title}>{v.title + "In"}</Col>
                                <Content className={styles.contents_container}>
                                  {(
                                    sliceBlockList().filter(
                                      block => selectedMenuData?.allowCategoryList.includes(block.category),
                                    )[0] ?? []
                                  )?.blocks?.map((block, index) => {
                                    const cartItem = cartListState.find(cart => {
                                      if (cart !== "") {
                                        return cart.type === block.type
                                      }
                                    })

                                    return (
                                      <FeatureBlock
                                        activeColor={block.color === "" ? CATEGORY_COLOR.PowerIn : block.color}
                                        key={index}
                                        className={styles.feature_block}
                                        onClick={() => {
                                          modalDispatch({
                                            open: true,
                                            children: (
                                              <FeatureOptionModal
                                                featureList={blockList}
                                                setSearchBlockList={setSearchBlockList}
                                                cartItem={cartItem !== "" ? cartItem : undefined}
                                                newIndex={combineCartWithEmpty().length}
                                                blockData={block}
                                                onApply={optionApply}
                                              />
                                            ),
                                          })
                                        }}
                                        // src={process.env.NEXT_PUBLIC_S3_URL + "/icons/current.svg"}
                                        src={`${process.env.NEXT_PUBLIC_S3_URL}${block.icon}`}
                                        count={block.count}
                                      >
                                        <div style={{ width: 80 }}>{block.type}</div>
                                      </FeatureBlock>
                                    )
                                  })}
                                </Content>
                              </Col>
                            </Col>
                            <Col className={styles.block_box}>
                              <Sider className={styles.slider} width={20}>
                                <Col
                                  style={{
                                    backgroundColor: CATEGORY_COLOR.PowerOut,
                                  }}
                                  className={styles.point}
                                />
                                <Col
                                  style={{
                                    backgroundColor: CATEGORY_COLOR.PowerOut,
                                  }}
                                  className={styles.bar}
                                />
                              </Sider>
                              <Col className={styles.block_list}>
                                <Col className={styles.category_title}>{v.title + "Out"}</Col>
                                <Content className={styles.contents_container}>
                                  {(
                                    sliceBlockList().filter(
                                      block => selectedMenuData?.allowCategoryList.includes(block.category),
                                    )[1] ?? []
                                  ).blocks?.map((block, index) => {
                                    const cartItem = cartListState.find(cart => {
                                      if (cart !== "") {
                                        return cart.type === block.type
                                      }
                                    })
                                    return (
                                      <FeatureBlock
                                        activeColor={block.color === "" ? CATEGORY_COLOR.PowerOut : block.color}
                                        key={index}
                                        className={styles.feature_block}
                                        onClick={() => {
                                          modalDispatch({
                                            open: true,
                                            children: (
                                              <FeatureOptionModal
                                                featureList={blockList}
                                                setSearchBlockList={setSearchBlockList}
                                                cartItem={cartItem !== "" ? cartItem : undefined}
                                                newIndex={combineCartWithEmpty().length}
                                                blockData={block}
                                                onApply={optionApply}
                                              />
                                            ),
                                          })
                                        }}
                                        // src={`${process.env.NEXT_PUBLIC_S3_URL}${block.icon}`}-
                                        src={`${process.env.NEXT_PUBLIC_S3_URL}${block.icon}`}
                                        count={block.count}
                                      >
                                        <div style={{ width: 80 }}>{block.type} </div>
                                      </FeatureBlock>
                                    )
                                  })}
                                </Content>
                              </Col>
                            </Col>
                          </AntdLayout>
                        )}
                      </>
                    ),
                  }
                })}
                moreIcon={null}
                className={styles.tabs_container}
                size="large"
                tabBarExtraContent={{
                  left: (
                    <div className={styles.tabs_wrapper}>
                      <Image
                        src={imgAsset.headerFeature}
                        unoptimized={true}
                        width={40}
                        className={styles.page_image}
                        alt=""
                      />
                      <h2 className={styles.title}>Feature Select</h2>
                    </div>
                  ),
                  right: (
                    <BasicInput
                      className={styles.search_input}
                      value={searchInput.value}
                      onChange={searchInput.onChange}
                      onClick={() => {
                        if (searchInput.value === "") {
                          setSearchBlockList(blockList)
                        } else {
                          console.log(searchInput.value.toString())
                          setSearchBlockList(() => {
                            return [
                              ...blockList.filter(block => {
                                if (block.tags) {
                                  const tags = block.tags.map(e => e.toLocaleLowerCase())

                                  return tags.includes(searchInput.value.toLocaleLowerCase())
                                } else return
                              }),
                              ...blockList.filter(
                                block => block.type.toLocaleLowerCase() === searchInput.value.toLocaleLowerCase(),
                              ),
                            ]
                          })
                        }
                      }}
                      onKeyDown={event => {
                        if (event.key === "Enter") {
                          if (searchInput.value === "") {
                            setSearchBlockList(blockList)
                          } else {
                            console.log(searchInput.value.toString())
                            setSearchBlockList(() => {
                              return ArrayUtils.uniq([
                                ...blockList.filter(block => {
                                  if (block.tags) {
                                    const tags = block.tags.map(e => e.toLocaleLowerCase())
                                    return tags.includes(searchInput.value.toLocaleLowerCase())
                                  } else return
                                }),
                                ...blockList.filter(
                                  block => block.type.toLocaleLowerCase() === searchInput.value.toLocaleLowerCase(),
                                ),
                              ])
                            })
                          }
                        }
                      }}
                      theme={{
                        colorPrimary: "#45d6df",
                        borderRadius: 20,
                        colorBorder: "#1b3852",
                      }}
                    />
                  ),
                }}
              />
            </ConfigProvider>
          </div>
        </Col>
        <Col className={styles.cart_container}>
          <div className={styles.cart_container_wrapper}>
            <Row className={styles.cart_title_wrapper} align={"middle"}>
              <Space className={styles.cart_title_box}>
                <Image
                  src={imgAsset.cart}
                  width={32}
                  height={32}
                  style={{
                    padding: "5px",
                    borderRadius: 5,
                  }}
                  alt=""
                />
                <Row className={styles.cart_title}>Cart</Row>
              </Space>
            </Row>
            <Row className={styles.cart_content}>
              <Col className={styles.cart_list_wrapper}>
                <Col className={styles.cart_list}>
                  {combineCartWithEmpty().map((block, index) => {
                    // const machedStoreBlock = block !== "" ? getMatchingBlock(block) : ""
                    const category = block !== "" ? (block.category as keyof typeof CATEGORY_COLOR) : ""
                    return block !== "" && category !== "" ? (
                      <Col key={index} className={styles.cart_item_wrapper}>
                        {editMode && block.category !== "Custom" ? (
                          <span className={styles.block_edit_icon}>
                            <EditOutlined
                              onClick={() => {
                                setEditMode(false)
                                const cartItem = combineCartWithEmpty().find(cart => {
                                  if (cart !== "") {
                                    return cart.id === index
                                  }
                                })
                                const blockData = sliceBlockList()
                                  .find(v => v.category === (block.category as MENU_TITLE))
                                  ?.blocks.find(u => u.type === block.type)

                                return modalDispatch({
                                  open: true,
                                  children: (
                                    <FeatureOptionModal
                                      featureList={blockList}
                                      setSearchBlockList={setSearchBlockList}
                                      isCart={true}
                                      cartItem={cartItem !== "" ? cartItem : undefined}
                                      newIndex={combineCartWithEmpty().length}
                                      blockData={blockData}
                                      onApply={optionApply}
                                    />
                                  ),
                                })
                              }}
                            />
                          </span>
                        ) : null}
                        {duplicateMode && block.category !== "MCU" ? (
                          <span className={styles.block_duplicate_icon}>
                            <PlusOutlined
                              onClick={() => {
                                const feature = blockList.find(
                                  // feature => feature.category === block.category && feature.type === block.type,
                                  feature => feature.type === block.type && feature.category === block.category,
                                )

                                if (feature) {
                                  duplicateBlock(feature, block)

                                  featureToast.onMessage({
                                    type: "success",
                                    content: PROJECT_ALERT["S001"].kor,
                                  })
                                }
                              }}
                            />
                          </span>
                        ) : null}
                        {deleteMode && block.category !== "MCU" ? (
                          <span className={styles.block_delete_icon}>
                            <CloseOutlined
                              onClick={() => {
                                const feature = blockList.find(
                                  // feature => feature.category === block.category && feature.type === block.type,
                                  feature => feature.type === block.type && feature.category === block.category,
                                )
                                if (feature) {
                                  removeBlock(feature, block)
                                }
                                featureToast.onMessage({
                                  type: "success",
                                  content: PROJECT_ALERT["S003"].kor,
                                })
                              }}
                            />
                          </span>
                        ) : null}
                        <>
                          <span className={styles.cart_count}>{block.index}</span>
                          <FeatureBlock
                            key={index}
                            src={process.env.NEXT_PUBLIC_S3_URL + block.icon ?? ""}
                            className={styles.cart_item}
                            isCart
                            activeColor={CATEGORY_COLOR[category]}
                          >
                            <div>{block.type}</div>
                          </FeatureBlock>
                        </>
                      </Col>
                    ) : (
                      <div key={index} className={styles.empty_cart_item} />
                    )
                  })}
                </Col>
                <Col className={styles.cart_list_footer}>
                  <Row className={styles.footer_button_wrapper}>
                    <BasicButton
                      onClick={() => {
                        setEditMode(state => !state)
                        setDuplicateMode(false)
                        setDeleteMode(false)
                      }}
                    >
                      Edit
                    </BasicButton>
                    <BasicButton
                      onClick={() => {
                        setEditMode(false)
                        setDuplicateMode(state => !state)
                        setDeleteMode(false)
                      }}
                    >
                      Duplicate
                    </BasicButton>
                    <BasicButton
                      onClick={() => {
                        setEditMode(false)
                        setDuplicateMode(false)
                        setDeleteMode(state => !state)
                      }}
                    >
                      Delete
                    </BasicButton>
                  </Row>
                  <Row className={styles.feature_count_text_wrapper}>
                    <Col className={styles.feature_count_text}>
                      총
                      <span className={styles.feature_count}>
                        {
                          cartListState.filter(e => {
                            if (e !== "") {
                              return e.type !== "LDO" && e.type !== "Buck"
                            }
                          }).length
                        }
                      </span>
                      개의 부품을 담았습니다.
                    </Col>
                  </Row>
                </Col>
              </Col>
            </Row>
          </div>
          <Row className={styles.next_button}>
            <BasicButton
              className={buttonStyle.next_button}
              onClick={async () => {
                await nextFeature(cartListState as FeatureDto[])
              }}
            >
              Next
            </BasicButton>
          </Row>
        </Col>
      </Row>
    </LayoutMain>
  )
}

export default AuthHoc(FeaturePage)
