import {
  FeatureBlockOptionDto,
  FeatureDto,
  FeatureInitDto,
  FeatureOptionDto,
  FeatureRecommendDto,
  IFeatureOption,
} from "apis/dto"
import { useAsyncEffect, useRedux, useToast } from "hooks"
import { setLoading, setModal, setPause } from "redux/reducers/config"
import { BasicModal } from "./modal.basic"
import modalStyles from "./modal.module.scss"
import styles from "./modal.block.detail.module.scss"
import { Col, Row, Space } from "antd"
import { BasicButton } from "components/Button"
import { FeatureBlock, FeatureOption } from "components/Extras"
import { CATEGORY_COLOR } from "@const/block.const"
import { apiManager, apiUtil } from "apis"
import { Dispatch, SetStateAction, useState } from "react"
import { plainToInstance } from "class-transformer"
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons"
import { ArrayUtils } from "utils"

export const FeatureOptionModal = ({
  featureList,
  cartItem,
  blockData,
  isCart,
  newIndex,
  onApply,
  setSearchBlockList,
}: {
  featureList: FeatureInitDto[]
  cartItem?: FeatureDto | undefined
  blockData: FeatureInitDto | undefined
  isCart?: boolean
  newIndex: number
  onApply: (featureBlock: FeatureInitDto | undefined, cartItem: FeatureDto | undefined) => void
  setSearchBlockList: Dispatch<SetStateAction<FeatureInitDto[]>>
}) => {
  const featureOptionToast = useToast()
  const modalDispatch = useRedux(setModal)
  const loadingDispatch = useRedux(setLoading)
  const pauseDispatch = useRedux(setPause)
  const [selectedOptions, setSelectedOptions] = useState<Omit<FeatureOptionDto, "toJson">[]>([])
  const getMatchingIds = (parentId: number) => {
    return optionInfo?.option_links.find(link => link.parent_id === parentId)?.option_list
  }

  const pushOption = (
    options: typeof selectedOptions,
    parentOption: (typeof selectedOptions)[number],
    choiceIndex = 0,
  ) => {
    const subOptionId = getMatchingIds(parentOption?.id)?.[choiceIndex]

    if (subOptionId) {
      const subOption = optionInfo?.options.find(opt => opt.id === subOptionId)
      if (subOption) {
        options.push(subOption)
        pushOption(options, subOption)
      }
    }
  }

  const getPushedOptions = (options: typeof selectedOptions, option: (typeof selectedOptions)[number]) => {
    const initialOptions = options
    pushOption(options, option)

    return initialOptions
  }

  const onChoice = (option: (typeof selectedOptions)[number], choiceIndex: number) => {
    const subOptionId = getMatchingIds(option.id)?.[choiceIndex]

    if (subOptionId) {
      const subOption = optionInfo?.options.find(opt => opt.id === subOptionId)

      if (subOption) {
        setSelectedOptions(getPushedOptions([option, subOption], subOption))
      }
    }
  }
  const [showDetail, setShowDetail] = useState(false)

  const [optionInfo, setOptionInfo] = useState<FeatureBlockOptionDto>()
  const [recommendInfo, setRecommendInfo] = useState<FeatureRecommendDto>()

  const [currentOptionState, setCurrentOptionState] = useState<IFeatureOption>(
    isCart ? (cartItem?.selected_option as IFeatureOption) : (optionInfo?.selected_option as IFeatureOption),
  )

  const uniqOptions = ArrayUtils.uniq<typeof selectedOptions>(optionInfo?.options ?? [], (a, b) => a.desc === b.desc)

  const mergedOptions = ArrayUtils.merge<typeof selectedOptions>(
    uniqOptions,
    selectedOptions,
    (a, b) => a.desc === b.desc,
  )
  const mainOptions = mergedOptions.filter(e => !e.is_sub)
  const subOptions = mergedOptions.filter(e => e.is_sub)

  const defaultOption = {
    selected_option: {},
    type: blockData?.type ?? "",
  }
  const featureOption = {
    selected_option: cartItem?.selected_option ?? {},
    type: blockData?.type ?? "",
  }

  useAsyncEffect(async () => {
    loadingDispatch(true)
    const settingRes = await apiManager.featureApi.setting(isCart ? featureOption : defaultOption)
    if (apiUtil.isErrorResponse(settingRes)) {
      loadingDispatch(false)

      featureOptionToast.onMessage({
        type: "error",
        content: settingRes.message ?? "",
      })
      return
    }
    if (apiUtil.isErrorResponse(settingRes)) {
      loadingDispatch(false)
      featureOptionToast.onMessage({ type: "error", content: "추천 부품이 없습니다." })
      modalDispatch({ open: false })
      return
    }
    const recommendedOption = {
      selected_option: settingRes.selected_option ?? {},
      type: blockData?.type ?? "",
    }
    const recommendRes = await apiManager.featureApi.recommend(isCart ? featureOption : recommendedOption)
    loadingDispatch(false)
    if (apiUtil.isErrorResponse(recommendRes)) {
      pauseDispatch(true)
      featureOptionToast.onMessage({
        type: "error",
        content: recommendRes.message ?? "",
      })
      setTimeout(() => {
        pauseDispatch(false)
        modalDispatch({ open: false })
      }, 1000)
      return
    }
    setOptionInfo(settingRes)
    if (isCart) {
      setCurrentOptionState(cartItem?.selected_option as IFeatureOption)
    } else {
      setCurrentOptionState(settingRes.selected_option)
    }
    setRecommendInfo(recommendRes)
    loadingDispatch(false)
  }, [])

  const changeOption = async ({ title, option }: { title: string; option: string }) => {
    console.log(145145, title, option)

    const [settingRes, recommendRes] = await Promise.all([
      apiManager.featureApi.setting({
        selected_option: { ...currentOptionState, [title]: option } ?? {},
        type: blockData?.type ?? "",
      }),
      apiManager.featureApi.recommend({
        selected_option: { ...currentOptionState, [title]: option } ?? {},
        type: blockData?.type ?? "",
      }),
    ])

    if (apiUtil.isErrorResponse(settingRes)) {
      console.error(settingRes.message)
      pauseDispatch(true)
      featureOptionToast.onMessage({
        type: "error",
        content: settingRes.message as string,
      })
      pauseDispatch(false)
      return false
    } else if (apiUtil.isErrorResponse(recommendRes)) {
      pauseDispatch(true)
      console.error(recommendRes.message)
      featureOptionToast.onMessage({
        type: "error",
        content: recommendRes.message as string,
      })
      pauseDispatch(false)
      return false
    }
    setCurrentOptionState(state => {
      return {
        ...state,
        [title]: option,
      }
    })
    console.log(177177, recommendRes)
    setOptionInfo(settingRes)
    setRecommendInfo(recommendRes)
    //옵션 불러왔음----------------------------------------------------------------
    return true
  }

  // 모달 내부 옵션 변경
  // 적용 옵션 저장 (apply) --------------------------------------------------------
  // 옵션 관련되서는 네 개의 옵션 스테이트가 필요함
  /*
  1. 모달창 밖에서 사용될 옵션 스테이트
     - 이전 state, 현재 state
  2. 모달창 내부에서 사용될 옵션 스테이트
     - 이전 state, 현재 state

    내부에서 옵션을 변경할 때
  => recommend 옵션이 안되는 경우에 이전 state로 저장해야하니 
     이전스테이트 저장, 현재스테이트 변경 
   */

  let cartData: FeatureDto | undefined

  const onOptionApply = () => {
    console.log("option Apply")
    modalDispatch({ open: false })
    if (!cartItem) {
      cartData = plainToInstance(FeatureDto, {
        block_id: "",
        part_id: recommendInfo?.part_id ?? "",
        category: blockData?.category,
        custom: false,
        icon: blockData?.icon,
        selected_option: { ...currentOptionState },
        type: blockData?.type,
      }).toJson<FeatureDto>()
    } else {
      cartData = plainToInstance(FeatureDto, {
        ...cartItem,
        block_id: "",
        selected_option: { ...currentOptionState },
        id: newIndex,
      }).toJson<FeatureDto>()
    }
    onApply(blockData, cartData)
  }
  // 옵션 변경 취소 cancel --------------------------------------------------------
  /*
   */
  const onOptionCancel = () => {
    console.log("option cancel")
    modalDispatch({ open: false })
  }
  console.log(237237, currentOptionState)
  return (
    <BasicModal
      header="Feature Configuration"
      width={440}
      height={896}
      footer={
        <Row className={modalStyles.modal_button_wrapper}>
          <BasicButton onClick={onOptionCancel}>Cancel</BasicButton>
          <BasicButton onClick={onOptionApply}>Apply</BasicButton>
        </Row>
      }
    >
      <Space direction="vertical" size={24}>
        <>{featureOptionToast.contextHolder}</>
        <Space direction="vertical" className={styles.feature_summary_container} size={0}>
          <Row className={styles.feature_summary_wrapper}>
            <FeatureBlock
              src={process.env.NEXT_PUBLIC_S3_URL + (optionInfo?.info.icon ?? "")}
              className={styles.cart_item}
              isCart
              activeColor={CATEGORY_COLOR[(blockData?.category ?? "") as keyof typeof CATEGORY_COLOR]}
            >
              <div>{optionInfo?.info.type}</div>
            </FeatureBlock>
            <Col className={styles.feature_summary}>
              {/* {optionInfo?.selected_option && */}
              {Object.keys(currentOptionState ?? {}).map(key => {
                return (
                  <Row key={key} className={styles.feature_summary_content_box}>
                    <Col className={styles.summary_title}>{key}</Col>
                    <Col className={styles.summary_content}>{currentOptionState?.[key]}</Col>
                  </Row>
                )
              })}
            </Col>
          </Row>
          <Row className={styles.feature_tag_box}>
            {optionInfo?.info.tags.map(tag => {
              return tag !== "" ? (
                <span
                  key={tag}
                  className={styles.feature_tag}
                  onClick={() => {
                    modalDispatch({ open: false })
                    setSearchBlockList(() => featureList.filter(blocks => blocks.tags.includes(tag)))
                  }}
                >
                  #{tag}
                </span>
              ) : (
                <></>
              )
            })}
          </Row>
        </Space>

        <Space className={styles.feature_product_type_container} size={0} direction="vertical">
          <Row className={styles.feature_product_type_header_wrapper}>
            <Row></Row>
            <Col className={styles.feature_product_stock_box}>
              <Col
                className={
                  (recommendInfo?.stock ?? 0) > 100
                    ? styles.feature_product_stock_count
                    : styles.feature_product_stock_count_error
                }
              >
                {recommendInfo?.stock}
              </Col>
              <Col className={styles.feature_product_stock_text}>In Stock</Col>
            </Col>
          </Row>
          {mainOptions.map((option, key) => {
            return (
              <FeatureOption
                key={key}
                option={option}
                optionInfo={optionInfo}
                onChoice={onChoice}
                changeOption={changeOption}
                currentOptionState={currentOptionState}
                setCurrentOptionState={setCurrentOptionState}
              />
            )
          })}
          <Row className={styles.feature_product_type_header_wrapper}>
            <Col className={styles.showDetail_toggle_title}>세부 사항</Col>
            <Col onClick={() => setShowDetail(state => !state)}>
              {showDetail ? (
                <CaretUpOutlined className={styles.showDetail_toggle} />
              ) : (
                <CaretDownOutlined className={styles.showDetail_toggle} />
              )}
            </Col>
          </Row>
          {!showDetail
            ? subOptions.map((option, key) => {
                return (
                  <FeatureOption
                    key={key}
                    option={option}
                    optionInfo={optionInfo}
                    onChoice={onChoice}
                    changeOption={changeOption}
                    currentOptionState={currentOptionState}
                    setCurrentOptionState={setCurrentOptionState}
                  />
                )
              })
            : null}
        </Space>
      </Space>
    </BasicModal>
  )
}
