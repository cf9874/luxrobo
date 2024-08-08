import { Col, Row, Space } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton, buttonStyle } from "components/Button"
import { useInputs, useRedux, useToast } from "hooks"
import { setLoading, setModal } from "redux/reducers/config"
import modalStyles from "./modal.module.scss"
import styles from "./modal.change.part.module.scss"
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined, ExportOutlined } from "@ant-design/icons"
import { BasicInput } from "components/Input"
import { useState } from "react"
import { FeatureInitDto, PartBlockDto, PartSearchDto } from "apis/dto"
import Image from "next/image"
import { PROJECT_ALERT } from "@const/alarm.const"
import { apiManager, apiUtil } from "apis"
import { useRouter } from "next/router"

export const ChangePartModal = ({
  data,
  feature,
  part_data,
  onApply,
}: {
  data: PartBlockDto
  feature: FeatureInitDto | undefined
  part_data:
    | PartSearchDto[]
    | {
        message: string | undefined
      }
  onApply: (selectPart: PartSearchDto) => Promise<void>
}) => {
  const router = useRouter()
  const modalDispatch = useRedux(setModal)
  const loadingDispatch = useRedux(setLoading)
  const partChangedToast = useToast()
  const [selectPart, setSelectPart] = useState<PartSearchDto | null>()
  const [recommendList] = useState<PartSearchDto[]>(part_data as PartSearchDto[])
  const [searchListState, setSearchListState] = useState<PartSearchDto[]>(part_data as PartSearchDto[])

  const searchInput = useInputs({ value: "" })

  return (
    <BasicModal
      width={1000}
      height={776}
      header={
        <Col className={styles.part_change_modal_title}>
          <Col className={styles.icon_box}>
            <div className={styles.modal_icon}>
              <Image
                unoptimized={true}
                src={process.env.NEXT_PUBLIC_S3_URL + (data.BlockInfo.icon ?? "")}
                width={20}
                height={20}
                alt={data.BlockInfo.category}
              />
            </div>
            <span className={styles.type_title}>{data.BlockInfo.type}</span>
          </Col>
          <span>부품 변경</span>
          <div className={styles.blank}></div>
        </Col>
      }
      footer={
        <Row className={modalStyles.wide_modal_container}>
          <div className={styles.modal_button_wrapper}>
            <BasicButton
              onClick={async () => {
                if (selectPart) {
                  await onApply(selectPart)
                  partChangedToast.onMessage({
                    type: "success",
                    content: PROJECT_ALERT["S011"].kor,
                  })
                }
                modalDispatch({ open: false })
              }}
            >
              Done
            </BasicButton>
          </div>
        </Row>
      }
    >
      {partChangedToast.contextHolder}
      <Col className={styles.part_change_modal_container}>
        <Row justify={"space-between"} align={"middle"}>
          <Col className={styles.part_category_wrapper}>
            {feature?.tags.map((e, i) => {
              if (e === "") return null
              else {
                return (
                  <div key={e + i} className={styles.part_category}>
                    {e}
                  </div>
                )
              }
            })}
          </Col>
          <Col className={styles.search_wrapper}>
            <BasicButton
              className={buttonStyle.general_sub_button}
              onClick={async () => {
                const response = await apiManager.partApi.getUrl({
                  blockId: data.BlockInfo.block_id,
                  projectId: Number(router.query.id),
                })
                if (apiUtil.isErrorResponse(response)) {
                  alert(response.message)
                  return
                }
                window.open(response.url, "_blank")
              }}
            >
              Search on Mouser
            </BasicButton>
            <BasicInput
              style={{ width: 240 }}
              onChange={searchInput.onChange}
              value={searchInput.value}
              onClick={async () => {
                if (searchListState.toString() === ("message" in part_data ? "" : part_data.toString())) {
                  setSearchListState(recommendList)
                  return
                }
                loadingDispatch(true)
                if (searchInput.value) {
                  const response = await apiManager.partApi.search({
                    keyword: searchInput.value,
                    type: data.BlockInfo.type,
                  })

                  if (apiUtil.isErrorResponse(response)) {
                    alert(response.message)
                    return
                  }
                  setSearchListState(response)
                } else {
                  const response = await apiManager.partApi.update({
                    projectId: Number(router.query.id),
                    blockId: data.BlockInfo.block_id,
                  })

                  if (apiUtil.isErrorResponse(response)) {
                    alert(response.message)
                    return
                  }
                  setSearchListState(() =>
                    recommendList.filter(block => block.part_name.includes(searchInput.value.toString())),
                  )
                  setSearchListState(response)
                }
                loadingDispatch(false)
              }}
              onKeyDown={async event => {
                if (event.key === "Enter") {
                  loadingDispatch(true)
                  setSearchListState(() =>
                    recommendList.filter(block => block.part_name.includes(searchInput.value.toString())),
                  )
                  if (searchInput.value) {
                    const response = await apiManager.partApi.search({
                      keyword: searchInput.value,
                      type: data.BlockInfo.type,
                    })
                    if (apiUtil.isErrorResponse(response)) {
                      alert(response.message)
                      return
                    }
                    setSearchListState(response)
                  } else {
                    const response = await apiManager.partApi.update({
                      projectId: Number(router.query.id),
                      blockId: data.BlockInfo.block_id,
                    })

                    if (apiUtil.isErrorResponse(response)) {
                      alert(response.message)
                      return
                    }

                    setSearchListState(response)
                  }
                  loadingDispatch(false)
                }
              }}
              theme={{
                colorPrimary: "#45d6df",
                borderRadius: 20,
                colorBorder: "#1b3852",
              }}
            />
          </Col>
        </Row>
        {searchListState.length > 0 ? (
          <Row className={styles.nav_text}>귀하의 요구사항을 종합하여 추천하는 부품은 다음과 같아요.</Row>
        ) : (
          <Row className={styles.nav_text_warning}>
            선택한 기능 옵션과 일치하는 검색결과가 없습니다. 기능선택을 고려하여 재검색해주세요.
          </Row>
        )}
        <Space className={styles.part_list} direction="vertical" size={12}>
          {searchListState.length > 0 ? (
            searchListState.map((item, index) => {
              const isSupport = item.is_support
              console.log(153153, item)
              return (
                <Col
                  key={item.part_id + index}
                  className={
                    !isSupport
                      ? styles.part_item_not_support
                      : selectPart?.part_id === item.part_id
                        ? styles.part_item_selected
                        : styles.part_item
                  }
                  onClick={() => {
                    if (isSupport) {
                      setSelectPart(item)
                    } else {
                      setSelectPart(null)
                    }
                  }}
                >
                  <Col className={styles.part_item_section}>
                    <Row className={styles.list_title}>제조사 / part #</Row>
                    <Row className={styles.part_item_content} align={"middle"}>
                      <Col className={styles.part_image}>
                        <Image unoptimized={true} src={item.part_image} alt={item.part_name} width={110} height={110} />
                      </Col>
                      <Col className={styles.part_name_wrapper}>
                        <Row className={styles.part_type}>{item.manufacturer}</Row>
                        <Col className={styles.part_name} onClick={() => window.open(item.mouser_url)}>
                          {item.part_name}
                        </Col>
                      </Col>
                    </Row>
                  </Col>
                  <Col className={styles.part_item_section}>
                    <Row className={styles.list_title}>설명</Row>
                    <Row className={styles.part_item_content}>
                      <Col className={styles.part_desc}>{item?.description}</Col>
                      <Col
                        className={styles.datasheet_link}
                        onClick={() => {
                          if (selectPart) {
                            window.open(selectPart.datasheet_url)
                            return
                          }
                        }}
                      >
                        <ExportOutlined className={styles.link_icon} />
                        Datasheet
                      </Col>
                    </Row>
                  </Col>
                  <Col className={styles.part_item_section}>
                    <Row className={styles.list_title}>수량별 단가</Row>
                    <Row className={styles.part_item_content}>
                      <Col className={styles.price_wrapper}>
                        {item.quantity_prices.map((price, index) => (
                          <Row className={styles.price_box} key={index}>
                            <Col className={styles.part_count}>{price.quantity}개</Col>
                            <Col className={styles.part_price}>￦ {price.price.toLocaleString()}</Col>
                          </Row>
                        ))}
                      </Col>
                    </Row>
                  </Col>
                  <Col className={styles.part_item_section}>
                    <Row className={styles.list_title}>재고</Row>
                    <Row className={styles.part_item_content}>
                      <Col className={styles.stock_wrapper}>
                        <Row className={item.stock > 100 ? styles.stock_count : styles.stock_count_error}>
                          {item.stock.toLocaleString()}
                        </Row>
                        <Row className={styles.stock_text}>In Stock</Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col className={styles.part_item_section}>
                    <Row className={styles.list_title}>
                      <Row>MODI EDA</Row>
                      <Row>Support</Row>
                    </Row>
                    <Row className={styles.part_item_content}>
                      <Col className={styles.icon_box}>
                        {isSupport ? (
                          <CheckCircleOutlined className={styles.support_icon} />
                        ) : (
                          <CloseCircleOutlined className={styles.not_support_icon} />
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Col>
              )
            })
          ) : (
            <Col className={styles.part_blank}>
              <CloseOutlined className={styles.part_blank_icon} />
            </Col>
          )}
        </Space>
      </Col>
    </BasicModal>
  )
}
