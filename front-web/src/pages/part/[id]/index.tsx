import { Col, List, Row, Space } from "antd"
import styles from "./part.module.scss"
import { LayoutMain } from "Layout"
import { BasicButton, buttonStyle } from "components/Button"
import { Dispatch, SetStateAction, useState } from "react"
import { DeleteOutlined, InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons"
import { ChangePartModal, CheckPointModal } from "components/Modal"
import { setCheck, setLoading, setModal, setPause } from "redux/reducers/config"
import { useAsyncEffect, useRedux, useToast } from "hooks"
import { BasicPopover } from "components/Popover"
import { Placement } from "type"
import { plainToInstance } from "class-transformer"
import { FeatureInitDto, PartBlockDto, PartLisSaveDto, PartSearchDto } from "apis/dto"
import { useRouter } from "next/router"
import { apiManager, apiUtil } from "apis"
import Image from "next/image"
import { imgAsset } from "@assets/image"
import { PartBlock } from "components/Extras"
import { CATEGORY_COLOR } from "@const/block.const"
import { mappingPartList } from "utils/calculatePartData.util"
import { fee } from "@const/price.const"
import { NumberUtil, getCheckPoint } from "utils"
import { PROJECT_ALERT } from "@const/alarm.const"
import AuthHoc from "hoc/AuthHoc"
import { MODIFIED_STEP } from "@const/project.const"

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const response = await apiManager.updateContext(ctx).partApi.init(Number(ctx.query.id))

//   if (apiUtil.isErrorResponse(response)) {
//     return {
//       props: { partList: [], errorMsg: response.message },
//     }
//   }

//   return {
//     props: { partList: response, errorMsg: "" },
//   }
// }
const PartPage = () => {
  const router = useRouter()
  const checkDispatch = useRedux(setCheck)
  const loadingDispatch = useRedux(setLoading)
  const pauseDispatch = useRedux(setPause)
  const partToast = useToast()

  const [partList, setPartList] = useState<PartBlockDto[]>([])
  const [visibleMainParts, setVisibleMainParts] = useState(true)
  const [visibleSubParts, setVisibleSubParts] = useState(false)
  const [cartList, setCartList] = useState<FeatureInitDto[]>([])
  const [selectPart, setSelectPart] = useState<PartBlockDto | null>(null)

  useAsyncEffect(async () => {
    if (router.query.id === undefined) return
    loadingDispatch(true)
    const projectRes = await apiManager.projectApi.getDetail(Number(router.query.id))
    if (apiUtil.isErrorResponse(projectRes)) {
      loadingDispatch(false)
      partToast.onMessage({
        type: "error",
        content: projectRes.message ?? "",
      })
      return
    }

    const current = router.route.split("/")[1] as keyof typeof MODIFIED_STEP
    const checkPoint = getCheckPoint({ current, checkPoint: projectRes.checkpoint })

    if (!checkPoint) {
      loadingDispatch(false)
      checkDispatch({ open: true, children: <CheckPointModal checkPoint={projectRes.checkpoint} /> })
      return
    }

    const cartlist = await apiManager.featureApi.init({ ids: [] })

    const response = await apiManager.partApi.init(Number(router.query.id))
    if (apiUtil.isErrorResponse(response)) {
      loadingDispatch(false)
      pauseDispatch(true)
      partToast.onMessage({
        type: "error",
        content: response.message ?? "",
      })
      pauseDispatch(false)

      return
    } else {
      setCartList(cartlist)
    }
    if (apiUtil.isErrorResponse(response)) {
      loadingDispatch(false)
      pauseDispatch(true)
      partToast.onMessage({
        type: "error",
        content: response.message ?? "",
      })
      pauseDispatch(false)

      return
    } else {
      setPartList(response)
    }
    if (projectRes.checkpoint === MODIFIED_STEP.part) {
      partToast.onMessage({
        type: "info",
        content: PROJECT_ALERT.I003.kor,
      })
    }
    loadingDispatch(false)
  }, [router.query.id])

  const savePart = async () => {
    const saveList: PartLisSaveDto[] = partList.map(part => {
      return plainToInstance(PartLisSaveDto, {
        block_id: part.BlockInfo.block_id,
        part_id: part.part_info.part_id,
        type: part.BlockInfo.type,
      }).toJson<PartLisSaveDto>()
    })
    const response = await apiManager.partApi.save({
      projectId: Number(router.query.id),
      blocks: saveList,
    })
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
    }
    console.log(response)
  }

  // part/next
  const nextPart = async () => {
    const saveList: PartLisSaveDto[] = partList.map(part => {
      return plainToInstance(PartLisSaveDto, {
        block_id: part.BlockInfo.block_id,
        part_id: part.part_info.part_id,
        type: part.BlockInfo.type,
      }).toJson<PartLisSaveDto>()
    })
    loadingDispatch(true)
    const response = await apiManager.partApi.next({
      projectId: Number(router.query.id),
      blocks: saveList,
    })

    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
    }
    console.log(response)
    loadingDispatch(false)
    void router.push(`/logic/${String(router.query.id)}`)
  }

  const { partList: mappedPartList, totalPrice, bulkPrice } = mappingPartList(partList)
  const matchPartList = ({ is_main }: { is_main: boolean }) => {
    const indexMap: { [key: string]: number } = {}
    const list = partList
      .filter(part => part.BlockInfo.is_sub !== is_main)
      .map(part => {
        const {
          BlockInfo: { type },
        } = part
        if (indexMap[type] === undefined) {
          indexMap[type] = 1
        } else {
          indexMap[type]++
        }
        return { ...part, index: indexMap[type] }
      })
      .map(part => plainToInstance(PartBlockDto, part).toJson<PartBlockDto>())
    return list
  }

  return (
    <LayoutMain>
      <> {partToast.contextHolder}</>
      <Row justify={"space-evenly"}>
        <Col className={styles.save_button_box} onClick={async () => savePart()}>
          <Image src={imgAsset.saveButton} className={styles.save_button} alt="save" width={24} height={24} />
          <Col className={styles.save_button_text}>SAVE</Col>
        </Col>
        <Col className={styles.main_container}>
          <Space className={styles.page_title_container} size={0}>
            <div
              style={{
                marginTop: 9,
              }}
            >
              <Image src={imgAsset.headerPart} width={40} height={40} className={styles.page_image} alt="Part Select" />
            </div>
            <h2 className={styles.title_text}>Part Select</h2>
          </Space>
          <Space className={styles.main_content} direction="vertical">
            <Row justify={"space-between"}>
              <Space className={styles.sub_title}>
                <Col className={styles.sub_title_text}>주요 부품</Col>
                <Col className={styles.sub_parts_count_circle}>
                  <span className={styles.sub_parts_count}>{matchPartList({ is_main: true }).length}</span>
                </Col>
              </Space>
              <Col className={styles.collapse_button} onClick={() => setVisibleMainParts(state => !state)}>
                <Image
                  src={visibleMainParts ? imgAsset.menuDropDown : imgAsset.menuDropUp}
                  alt={visibleMainParts ? "drop-down" : "drop-up"}
                  width={24}
                  height={24}
                />
              </Col>
            </Row>
            {visibleMainParts ? (
              <Row>
                <List
                  dataSource={matchPartList({ is_main: true })}
                  className={styles.parts_list_container}
                  renderItem={item => {
                    const activeColor = item.BlockInfo.category as keyof typeof CATEGORY_COLOR

                    return (
                      <List.Item className={styles.part_list}>
                        <PartRow
                          item={item}
                          feature={cartList.find(e => e.type === item.BlockInfo.type)}
                          setSelectPart={setSelectPart}
                          activeColor={CATEGORY_COLOR[activeColor]}
                          setPartList={setPartList}
                        />
                      </List.Item>
                    )
                  }}
                />
              </Row>
            ) : null}
            <div className={styles.divider} />
            <Row justify={"space-between"}>
              <Col className={styles.sub_title}>
                <Col className={styles.sub_title_text}>보조 부품</Col>
                <Col className={styles.sub_parts_count_circle}>
                  <span className={styles.sub_parts_count}>{matchPartList({ is_main: false }).length}</span>
                </Col>
                <BasicPopover
                  width={270}
                  placement={Placement.left}
                  text="보조 부품은 증폭기, 필터 등 주요 부품의
                  주변 회로를 설계할 때 필요한 부품입니다."
                >
                  <Col className={styles.sub_parts_question}>
                    <QuestionCircleOutlined />
                  </Col>
                </BasicPopover>
              </Col>
              <Col className={styles.collapse_button} onClick={() => setVisibleSubParts(state => !state)}>
                <Image
                  src={visibleSubParts ? imgAsset.menuDropDown : imgAsset.menuDropUp}
                  alt={visibleSubParts ? "drop-down" : "drop-up"}
                  width={24}
                  height={24}
                />
              </Col>
            </Row>
            {visibleSubParts ? (
              <Row>
                <List
                  dataSource={matchPartList({ is_main: false })}
                  className={styles.parts_list_container}
                  renderItem={item => (
                    <List.Item className={styles.part_list}>
                      <PartRow
                        item={item}
                        feature={cartList.find(e => e.type === item.BlockInfo.type)}
                        setSelectPart={setSelectPart}
                        setPartList={setPartList}
                      />
                    </List.Item>
                  )}
                />
              </Row>
            ) : null}
            <div className={styles.divider} />
          </Space>
        </Col>
        <Col className={styles.cart_container} span={5}>
          <div className={styles.main}>
            <Row className={styles.cart_title_container} align={"middle"}>
              <Col className={styles.cart_title}>주문 금액</Col>
            </Row>
            <Row className={styles.parts_order_content}>
              <Col className={styles.parts_order_list_container}>
                <Row className={styles.parts_order_list_title}>상세 내역</Row>
                <Space className={styles.parts_order_list} size={0}>
                  {mappedPartList.map(part => (
                    <Col className={styles.parts_order_list_item} key={part.BlockInfo.block_id}>
                      <Row className={styles.parts_order_list_item_name}>
                        {part.BlockInfo.category}/{part.BlockInfo.type}
                      </Row>
                      <Row className={styles.parts_order_list_item_wrapper}>
                        <Col className={styles.parts_order_list_item_model}>{part.part_info.part_name}</Col>
                        <Col className={styles.parts_order_list_item_count}>{part.count}개</Col>
                        <Col className={styles.parts_order_list_item_price}>$ {part.totalPrice.toFixed(3)}</Col>
                      </Row>
                    </Col>
                  ))}
                </Space>
              </Col>
              <Col className={styles.parts_order_summary}>
                <Row justify={"space-between"} align={"middle"}>
                  <Col className={styles.parts_order_summay_title}>부품 전체 금액(단가)</Col>
                  <Col className={styles.parts_order_summary_price}>$ {totalPrice}</Col>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                  <Col className={styles.parts_order_summay_title_box}>
                    <span className={styles.parts_order_summay_title}>예상 수수료</span>
                    <BasicPopover
                      width={264}
                      placement={Placement.left}
                      text="수수료에는 회로 검수비용, 배송비가 포함됩니다."
                    >
                      <QuestionCircleOutlined />
                    </BasicPopover>
                  </Col>
                  <Col className={styles.parts_order_summary_price}>$ {fee}</Col>
                </Row>
                <p className={styles.divider} />
                <Row justify={"space-between"} align={"middle"}>
                  <Col className={styles.parts_order_summay_title_box}>
                    <span className={styles.parts_order_summay_title}>샘플 예상 단가</span>
                    <BasicPopover
                      width={304}
                      placement={Placement.center}
                      text="현재 금액은 최종 금액이 아니며, 회로도
                      설계가 끝나면 최종금액이 정해집니다."
                    >
                      <QuestionCircleOutlined />
                    </BasicPopover>
                  </Col>
                  <Col className={styles.parts_order_summary_price_result}>
                    ${NumberUtil.roundToDecimalPlaces(totalPrice + fee, 3)}
                  </Col>
                </Row>
                <Row justify={"space-between"} align={"middle"}>
                  <Col className={styles.parts_order_summay_title_box}>
                    <span className={styles.parts_order_summay_title}>5,000 ea 예상 단가</span>
                    <BasicPopover
                      width={304}
                      placement={Placement.center}
                      text="현재 금액은 최종 금액이 아니며, 회로도
                      설계가 끝나면 최종금액이 정해집니다."
                    >
                      <QuestionCircleOutlined />
                    </BasicPopover>
                  </Col>
                  <Col className={styles.parts_order_summary_price_result}>
                    ${NumberUtil.roundToDecimalPlaces(bulkPrice + fee, 3)}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <Row className={styles.next_button}>
            <BasicButton
              className={buttonStyle.next_button}
              onClick={async () => {
                await nextPart()
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
const PartRow = ({
  item,
  feature,
  activeColor,
  setSelectPart,
  setPartList,
}: {
  item: PartBlockDto
  feature: FeatureInitDto | undefined
  activeColor?: CATEGORY_COLOR
  setSelectPart: Dispatch<SetStateAction<PartBlockDto | null>>
  setPartList: Dispatch<SetStateAction<PartBlockDto[]>>
}) => {
  const modalDispatch = useRedux(setModal)
  const loadingDispatch = useRedux(setLoading)
  const router = useRouter()
  console.log(item)

  return (
    <>
      <Col className={styles.part_info_container}>
        <Row className={styles.part_info_wrapper}>
          <Col className={styles.part_type_img}>
            <Col className={styles.part_block}>
              {item.BlockInfo.original_part_id !== item.part_info.part_id ? (
                <div className={styles.update_dot} />
              ) : null}
              <span className={styles.block_index}>{item.index}</span>
              <PartBlock
                src={process.env.NEXT_PUBLIC_S3_URL + (item.BlockInfo.icon ?? "")}
                activeColor={activeColor ? activeColor : item.BlockInfo.color}
              >
                <div>{item.BlockInfo.type}</div>
              </PartBlock>
            </Col>
          </Col>
          <Col className={styles.part_img}>
            <Image
              unoptimized={true}
              src={item.part_info.part_image}
              alt={item.part_info.part_name}
              width={110}
              height={82.5}
            />
          </Col>
          <Col className={styles.part_id}>
            <Row className={styles.part_created_by}>{item.part_info.manufacturer}</Row>
            <Row className={styles.part_model}>{item.part_info.part_name}</Row>
          </Col>
          <Col className={styles.part_model_info}>
            <InfoCircleOutlined onClick={() => console.log("info")} />
          </Col>
        </Row>
      </Col>
      <Col className={styles.part_spec}>
        <Row className={styles.part_spec_title}>주요 사양</Row>
        <Row className={styles.part_spec_item_wrapper}>
          {Object.values(item.BlockInfo.display_option ?? {}).map((spec, index) => (
            <Col key={index} className={styles.part_spec_item}>
              {spec}
            </Col>
          ))}
        </Row>
      </Col>
      <Col className={styles.part_edit}>
        <Row className={styles.part_edit_title}>수정</Row>
        <Row className={styles.part_edit_button}>
          <BasicButton
            className={buttonStyle.general_sub_button}
            onClick={async () => {
              setSelectPart(item)

              const response = await apiManager.partApi.update({
                projectId: Number(router.query.id),
                blockId: item.BlockInfo.block_id,
              })

              // if (apiUtil.isErrorResponse(response)) {
              //   alert(response.message)
              //   return
              // }

              modalDispatch({
                open: true,
                children: (
                  <ChangePartModal
                    feature={feature}
                    data={item}
                    part_data={response}
                    onApply={async (selectPart: PartSearchDto) => {
                      const response = await apiManager.partApi.apply({
                        projectId: Number(router.query.id),
                        block_id: item.BlockInfo.block_id,
                        part_id: selectPart.part_id,
                        type: item.BlockInfo.type,
                      })
                      if (apiUtil.isErrorResponse(response)) {
                        alert(response.message)
                        return
                      }
                      const partRes = await apiManager.partApi.init(Number(router.query.id))
                      if (apiUtil.isErrorResponse(partRes)) {
                        alert(partRes.message)
                        return
                      }
                      setPartList(partRes)
                    }}
                  />
                ),
              })
            }}
          >
            부품 변경
          </BasicButton>
        </Row>
      </Col>
      <Col className={styles.part_price}>
        <Col className={styles.part_price}>
          <Row className={styles.part_price_title}>수량별 단가</Row>
          <Col className={styles.part_price_wrapper}>
            {item.part_info.quantity_prices.map((price, index) => (
              <Row key={index} className={styles.part_price_box} justify={"space-between"}>
                <Col className={styles.part_price_count}>{price.quantity}개</Col>
                <Col className={styles.part_price_price}>${price.price}</Col>
              </Row>
            ))}
          </Col>
        </Col>
      </Col>
      <Col className={styles.part_price_sample}>
        <Row className={styles.part_price_sample_wrapper} justify={"space-between"} align={"middle"}>
          <Col className={styles.part_price_sample_title}>샘플 예상금액</Col>
          <DeleteOutlined
            className={styles.delete_icon}
            onClick={async () => {
              loadingDispatch(true)
              const response = await apiManager.partApi.delete({
                blockId: item.BlockInfo.block_id,
                projectId: Number(router.query.id),
              })
              if (apiUtil.isErrorResponse(response)) {
                loadingDispatch(false)
                return
              }
              const partListRes = await apiManager.partApi.init(Number(router.query.id))
              if (apiUtil.isErrorResponse(partListRes)) {
                alert(partListRes.message)
                return
              }
              setPartList(partListRes)
              loadingDispatch(false)
            }}
          />
        </Row>
        <Row>
          <Col className={styles.part_price_sample_price}>${item.part_info.quantity_prices[0]?.price}</Col>
          <div className={styles.price_divider} />
        </Row>
      </Col>
    </>
  )
}
export default AuthHoc(PartPage)
