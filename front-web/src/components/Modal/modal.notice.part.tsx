import { Col, Row, Space } from "antd"
import modalStyles from "./modal.module.scss"
import styles from "./modal.notice.part.module.scss"
import { QuestionCircleOutlined } from "@ant-design/icons"
import { BasicButton } from "components/Button"
import { ColorHeaderModal } from "./modal.color-header"
import { useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import { LogicBlockVoltageDto, LogicPowerNetDto, PartBlockDto } from "apis/dto"
import Image from "next/image"
import { apiManager, apiUtil } from "apis"
import { useRouter } from "next/router"
import { PRICECASE } from "@const/price.const"
import { imgAsset } from "@assets/image"

export const NoticePartChangeModal = ({
  currentPart,
  recommendPart,
  newNetName,
  result,
  applyChanged,
  undoChanged,
}: {
  powerCancel: () => void
  currentPart: PartBlockDto | undefined
  recommendPart:
    | {
        message: string | undefined
      }
    | LogicBlockVoltageDto
  newNetName: string
  result: LogicPowerNetDto[]
  applyChanged: (result: LogicPowerNetDto[]) => void
  undoChanged: () => void
}) => {
  const router = useRouter()
  const modalDispatch = useRedux(setModal)

  const getPriceCase = (
    currentPart: PartBlockDto | undefined,
    recommendPart:
      | {
          message: string | undefined
        }
      | LogicBlockVoltageDto,
  ) => {
    if (apiUtil.isErrorResponse(recommendPart)) {
      return PRICECASE.NO_PART
    } else {
      const currentPrice = currentPart?.part_info.quantity_prices ?? []
      const recommendPrice = recommendPart?.part_info.quantity_prices

      if (currentPrice?.length === recommendPrice?.length) {
        if (currentPrice[0]?.price === recommendPrice[0]?.price) {
          return PRICECASE.EQUAL
        }
      } else if (currentPrice[0]?.price > recommendPrice[0]?.price) {
        return PRICECASE.CHEAP
      } else if (currentPrice[0]?.price < recommendPrice[0]?.price) {
        return PRICECASE.EXPENSIVE
      }
    }
  }

  const onApply = async () => {
    if ("message" in recommendPart) {
      modalDispatch({ open: false })
      void router.push(`/part/${Number(router.query.id)}`)
      return
    }
    if (apiUtil.isErrorResponse(recommendPart)) {
      undoChanged()
      modalDispatch({ open: false })
    } else {
      const response = await apiManager.logicApi.applyBlockVolt({
        blockId: recommendPart?.blockInfo?.block_id ?? "",
        projectId: Number(router.query.id),
        volt: recommendPart,
        netName: newNetName,
      })
      if (apiUtil.isErrorResponse(response)) {
        alert(response.message)
        return
      }

      // const editRes = await apiManager.logicApi.editLinks()
      applyChanged(result)

      modalDispatch({ open: false })
    }
  }

  const onCancel = () => {
    undoChanged()
    modalDispatch({ open: false })
  }
  const priceCase = getPriceCase(currentPart, recommendPart)
  return (
    <ColorHeaderModal
      header={<Row className={styles.notice_modal_title}>부품 변경 알림</Row>}
      width={880}
      height={550}
      footer={
        <Row className={modalStyles.modal_button_wrapper}>
          <BasicButton
            style={{
              width: 132,
            }}
            onClick={onCancel}
          >
            NO
          </BasicButton>
          <BasicButton
            style={{
              width: 132,
            }}
            onClick={onApply}
          >
            YES
          </BasicButton>
        </Row>
      }
    >
      <Col
        style={{
          padding: "0 24px",
        }}
      >
        <Space direction="vertical" className={styles.part_item_container} size={0}>
          <Row className={styles.part_title}>현재부품</Row>
          <Row className={styles.part_item_wrapper}>
            <Col className={styles.part_item_info_wrapper}>
              <Row className={styles.part_category_box}>
                {/* <Col className={styles.part_item_category_img}>{currentPart.category_img ?? "img"}</Col> */}
                <Col className={styles.part_item_category_img}>
                  <Image
                    unoptimized={true}
                    src={
                      process.env.NEXT_PUBLIC_S3_URL +
                      "icons/" +
                      (currentPart?.BlockInfo.type.toLocaleLowerCase() ?? "") +
                      ".svg"
                    }
                    alt={currentPart?.BlockInfo.category}
                    width={20}
                    height={20}
                  />
                </Col>
                <Col className={styles.part_item_category}>{currentPart?.BlockInfo.type}</Col>
                <Col>
                  <QuestionCircleOutlined />
                </Col>
              </Row>
              <Row className={styles.part_type_box}>
                {/* <Col>{currentPart.part_img}</Col> */}
                <Col className={styles.part_item_img}>
                  <Image
                    unoptimized={true}
                    src={currentPart?.part_info.part_image ?? ""}
                    alt={currentPart?.BlockInfo.category}
                    width={64}
                    height={64}
                  />
                </Col>
                <Col className={styles.info_text_wrapper}>
                  <Row className={styles.part_item_type}>{currentPart?.part_info.manufacturer}</Row>
                  <Row className={styles.part_item_name}>{currentPart?.part_info.part_name}</Row>
                </Col>
              </Row>
            </Col>
            <Col className={styles.part_item_spec_wrapper}>
              <Row className={styles.part_item_spec_title}>주요 사양</Row>
              <Row className={styles.part_item_spec_box}>
                {currentPart?.BlockInfo.display_option.map(spec => (
                  <Col key={spec} className={styles.part_item_spec}>
                    {spec}
                  </Col>
                ))}
              </Row>
            </Col>
            <Col className={styles.part_item_price_wrapper}>
              <Row className={styles.part_item_price_title}>단가</Row>
              {currentPart?.part_info.quantity_prices.map(price => (
                <Row key={price.quantity} className={styles.part_item_price_box}>
                  <Col className={styles.part_item_price_quantity}>{price.quantity}개</Col>
                  <Col className={styles.part_item_price_per}>￦ {price.price.toLocaleString()}</Col>
                </Row>
              ))}
            </Col>
          </Row>
          <Col className={styles.arrow_down}>
            <Image src={imgAsset.ArrowUnder} alt="arrow-down" width={40} height={40} />
          </Col>
          <Row className={styles.part_title}>변경 부품</Row>
          {priceCase === PRICECASE.NO_PART ? (
            <Col className={styles.empty_part}>
              <Image src={imgAsset.questionMark} width={55} height={88} alt="empty" />
            </Col>
          ) : (
            <>
              {priceCase === PRICECASE.EQUAL || priceCase === PRICECASE.CHEAP ? (
                <Row className={styles.part_item_wrapper_changed}>
                  <Col className={styles.part_item_info_wrapper}>
                    <Row className={styles.part_category_box}>
                      <Col className={styles.part_item_category_img}>
                        <Image
                          unoptimized={true}
                          src={
                            process.env.NEXT_PUBLIC_S3_URL +
                            "icons/" +
                            ("message" in recommendPart ? "" : recommendPart?.blockInfo.type.toLocaleLowerCase()) +
                            ".svg"
                          }
                          alt={"message" in recommendPart ? "" : recommendPart?.blockInfo.category}
                          width={20}
                          height={20}
                        />
                      </Col>
                      <Col className={styles.part_item_category}>
                        {"message" in recommendPart ? "" : recommendPart?.blockInfo.type}
                      </Col>
                      <Col>
                        <QuestionCircleOutlined />
                      </Col>
                    </Row>
                    <Row className={styles.part_type_box}>
                      <Col className={styles.part_item_img}>
                        <Image
                          unoptimized={true}
                          src={"message" in recommendPart ? "" : recommendPart?.part_info.part_image ?? ""}
                          alt={"message" in recommendPart ? "" : recommendPart?.blockInfo.category}
                          width={64}
                          height={64}
                        />
                      </Col>
                      <Col>
                        <Row className={styles.part_item_type}>
                          {"message" in recommendPart ? "" : recommendPart?.part_info.manufacturer}
                        </Row>
                        <Row className={styles.part_item_name}>
                          {"message" in recommendPart ? "" : recommendPart?.part_info.part_name}
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col className={styles.part_item_spec_wrapper}>
                    <Row className={styles.part_item_spec_title}>주요 사양</Row>
                    <Row className={styles.part_item_spec_box}>
                      {"message" in recommendPart
                        ? ""
                        : recommendPart?.blockInfo.display_option.map(spec => (
                            <Col key={spec} className={styles.part_item_spec}>
                              {spec}
                            </Col>
                          ))}
                    </Row>
                  </Col>
                  <Col className={styles.part_item_price_wrapper}>
                    <Row className={styles.part_item_price_title}>단가</Row>
                    {"message" in recommendPart
                      ? ""
                      : recommendPart?.part_info.quantity_prices.map(price => (
                          <Row key={price.quantity} className={styles.part_item_price_box}>
                            <Col className={styles.part_item_price_quantity}>{price.quantity}개</Col>
                            <Col className={styles.part_item_price_per}>￦ {price.price.toLocaleString()}</Col>
                          </Row>
                        ))}
                  </Col>
                </Row>
              ) : null}
              {priceCase === PRICECASE.EXPENSIVE ? (
                <Row className={styles.part_item_wrapper_changed}>
                  <Col className={styles.part_item_info_wrapper}>
                    <Row className={styles.part_category_box}>
                      <Col className={styles.part_item_category_img}>
                        <Image
                          unoptimized={true}
                          src={
                            process.env.NEXT_PUBLIC_S3_URL +
                            "icons/" +
                            ("message" in recommendPart
                              ? ""
                              : recommendPart?.blockInfo.type.toLocaleLowerCase() ?? "") +
                            ".svg"
                          }
                          alt={"message" in recommendPart ? "" : recommendPart?.blockInfo.category}
                          width={20}
                          height={20}
                        />
                      </Col>
                      <Col className={styles.part_item_category}>
                        {"message" in recommendPart ? "" : recommendPart?.blockInfo.type}
                      </Col>
                      <Col>
                        <QuestionCircleOutlined />
                      </Col>
                    </Row>
                    <Row className={styles.part_type_box}>
                      <Col className={styles.part_item_img}>
                        <Image
                          unoptimized={true}
                          src={"message" in recommendPart ? "" : recommendPart?.part_info.part_image ?? ""}
                          alt={"message" in recommendPart ? "" : recommendPart?.blockInfo.category}
                          width={64}
                          height={64}
                        />
                      </Col>
                      <Col>
                        <Row className={styles.part_item_type}>
                          {"message" in recommendPart ? "" : recommendPart?.part_info.manufacturer}
                        </Row>
                        <Row className={styles.part_item_name}>
                          {"message" in recommendPart ? "" : recommendPart?.part_info.part_name}
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col className={styles.part_item_spec_wrapper}>
                    <Row className={styles.part_item_spec_title}>주요 사양</Row>
                    <Row className={styles.part_item_spec_box}>
                      {"message" in recommendPart
                        ? ""
                        : recommendPart?.blockInfo.display_option.map(spec => (
                            <Col key={spec} className={styles.part_item_spec}>
                              {spec}
                            </Col>
                          ))}
                    </Row>
                  </Col>
                  <Col className={styles.part_item_price_wrapper}>
                    <Row className={styles.part_item_price_title}>단가</Row>
                    {"message" in recommendPart
                      ? ""
                      : recommendPart?.part_info.quantity_prices.map(price => (
                          <Row key={price.quantity} className={styles.part_item_price_box}>
                            <Col className={styles.part_item_price_quantity}>{price.quantity}개</Col>
                            <Col
                              className={styles.part_item_price_per}
                              style={{
                                color: "red",
                              }}
                            >
                              ￦ {(price.price * 3).toLocaleString()}
                            </Col>
                            {/* <Col className={styles.part_item_price_per_price_over}>￦ {price.price_per.toLocaleString()}</Col> */}
                          </Row>
                        ))}
                  </Col>
                </Row>
              ) : null}
            </>
          )}

          <Col className={styles.part_notice_text_wrapper}>
            {priceCase === PRICECASE.CHEAP ? (
              <>
                <Row className={styles.part_notice_text}>부품 변경에 따른 가격 변화가 있습니다.</Row>
                <Row className={styles.part_notice_text}>부품을 변경하시겠습니까?</Row>
              </>
            ) : null}
            {priceCase === PRICECASE.EQUAL ? (
              <>
                <Row className={styles.part_notice_text}>부품을 변경하시겠습니까?</Row>
              </>
            ) : null}
            {priceCase === PRICECASE.EXPENSIVE ? (
              <>
                <Row className={styles.part_notice_text_price_over}>
                  변경한 전원 조건에 맞는 부품의 가격이 크게 증가하였습니다.
                </Row>
                <Row className={styles.part_notice_text}>부품을 변경 하시겠습니까?</Row>
              </>
            ) : null}
            {priceCase === PRICECASE.NO_PART ? (
              <>
                <Row className={styles.part_notice_text}>변경한 전원 조건에 맞는 부품을 찾을 수 없습니다.</Row>
                <Row className={styles.part_notice_text}>부품을 재선정 하시겠습니까?</Row>
              </>
            ) : null}
          </Col>
        </Space>
      </Col>
    </ColorHeaderModal>
  )
}
