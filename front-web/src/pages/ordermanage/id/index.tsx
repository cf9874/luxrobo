import { LayoutOrderManage } from "Layout"
import styles from "./orderdetail.module.scss"
import { Col, Row, Space } from "antd"
import { HomeOutlined } from "@ant-design/icons"
import { BasicButton } from "components/Button"
import { OrderHistoryDto, OrderShippingDto } from "apis/dto"
import { useAsyncEffect, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import { BasicModal } from "components/Modal"
// import { GetServerSideProps } from "next"
import { apiManager, apiUtil } from "apis"
import { ORDER_STATUS } from "@const/order.status.const"
import dayjs from "dayjs"
import { useState } from "react"
import AuthHoc from "hoc/AuthHoc"
import { useRouter } from "next/router"

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const apiCaller = apiManager.updateContext(ctx)

//   const historyRes = await apiCaller.orderApi.getHistoryDetail(Number(ctx.query.order_id))
//   const shippingRes = await apiCaller.orderApi.getShipping(Number(ctx.query.order_id))

//   console.log(historyRes)
//   if (apiUtil.isErrorResponse(historyRes) || apiUtil.isErrorResponse(shippingRes)) {
//     return {
//       props: { orderDetail: null, shipping: null },
//     }
//   }

//   return {
//     props: { orderDetail: historyRes, shipping: shippingRes },
//   }
// }

const OrderDetailPage = () => {
  const router = useRouter()
  const { id } = router.query
  // const orderDetail = orderList.find(order => order.seq === Number(order_id))
  const modalDispatch = useRedux(setModal)

  const [orderDetail, setOrderDetail] = useState<OrderHistoryDto | null>(null)
  const [shipping, setShipping] = useState<OrderShippingDto | null>(null)

  useAsyncEffect(async () => {
    const historyRes = await apiManager.orderApi.getHistoryDetail(Number(id))
    const shippingRes = await apiManager.orderApi.getShipping(Number(id))
    if (apiUtil.isErrorResponse(historyRes)) {
      alert(historyRes.message)
      return
    } else {
      setOrderDetail(historyRes)
    }
    if (apiUtil.isErrorResponse(shippingRes)) {
      alert(shippingRes.message)
      return
    } else {
      setShipping(shippingRes)
    }
  }, [id])

  return (
    <LayoutOrderManage>
      <Row className={styles.main_container}>
        <Col className={styles.contents_container}>
          <Row className={styles.content_main_title_box} align={"bottom"}>
            <Col className={styles.content_main_title}>History</Col>
            <Col className={styles.content_subtitle}>/ Order Details</Col>
          </Row>
          <Space direction="vertical" size={0} className={styles.contents_wrapper}>
            <Col className={styles.subtitle}>project name</Col>
            <Row className={styles.project_name}>{orderDetail?.project_name}</Row>
            <Row className={styles.order_info_box}>
              <Col className={styles.order_info_item_box}>
                <Row className={styles.order_info_item}>
                  <Col className={styles.item_title}>주문 번호</Col>
                  <Col className={styles.item_content}>{orderDetail?.order_number}</Col>
                </Row>
                <Row className={styles.order_info_item}>
                  <Col className={styles.item_title}>주문 일자</Col>
                  <Col className={styles.item_content}>{dayjs(shipping?.created_at).format("YYYY-MM-DD")}</Col>
                </Row>
                <Row className={styles.order_info_item}>
                  <Col className={styles.item_title}>수량</Col>
                  <Col className={styles.item_content}>{orderDetail?.amount} pcs</Col>
                </Row>
              </Col>
              <div className={styles.divider_vertical} />
              <Col className={styles.order_info_item_box}>
                <Row className={styles.order_info_item}>
                  <Col className={styles.item_title}>발주처</Col>
                  <Col className={styles.item_content}>{orderDetail?.company_data?.name}</Col>
                </Row>
                <Row className={styles.order_info_item}>
                  <Col className={styles.item_title}>SMT 여부</Col>
                  <Col className={styles.item_content}>SMT {orderDetail?.is_smt ? "진행" : "진행 안함"}</Col>
                </Row>
                <Row className={styles.order_info_item}>
                  <Col className={styles.item_title}>동작 검사</Col>
                  <Col className={styles.item_content}>동작 검사 {orderDetail?.is_motion ? "진행" : "진행 안함"}</Col>
                </Row>
              </Col>
              <div className={styles.divider_vertical_blank} />
            </Row>
            <div className={styles.divider} />
            <Col className={styles.subtitle}>PCB Order Options</Col>
            <Row className={styles.order_option_box}>
              <Col className={styles.order_option_item_box}>
                <Row className={styles.order_option_item}>
                  <Col className={styles.item_title}>Board Type</Col>
                  <Col className={styles.item_content}>{orderDetail?.options.board_type}</Col>
                </Row>
                <Row className={styles.order_option_item}>
                  <Col className={styles.item_title}>Thickness</Col>
                  <Col className={styles.item_content}>{orderDetail?.options.thickness}</Col>
                </Row>
                <Row className={styles.order_option_item}>
                  <Col className={styles.item_title}>Solder Mask</Col>
                  <Col className={styles.item_content}>{orderDetail?.options.solder_mask}</Col>
                </Row>
                <Row className={styles.order_option_item}>
                  <Col className={styles.item_title}>Silkscreen</Col>
                  <Col className={styles.item_content}>{orderDetail?.options.silkscreen}</Col>
                </Row>
              </Col>
              <div className={styles.divider_vertical} />
              <Col className={styles.order_option_item_box}>
                <Row className={styles.order_option_item}>
                  <Col className={styles.item_title}>Surface Finish</Col>
                  <Col className={styles.item_content}>{orderDetail?.options.surface_finish}</Col>
                </Row>
                <Row className={styles.order_option_item}>
                  <Col className={styles.item_title}>Via Process</Col>
                  <Col className={styles.item_content}>{orderDetail?.options.via_process}</Col>
                </Row>
                <Row className={styles.order_option_item}>
                  <Col className={styles.item_title}>Finished copper</Col>
                  <Col className={styles.item_content}>{orderDetail?.options.finished_copper}</Col>
                </Row>
              </Col>
              <div className={styles.divider_vertical} />
              <Col className={styles.order_option_item_box}>
                <Row className={styles.order_option_item}>
                  <Col className={styles.item_title}>Min Holl Size</Col>
                  <Col className={styles.item_content}>{orderDetail?.options.min_holl_size}</Col>
                </Row>
                <Row className={styles.order_option_item}>
                  <Col className={styles.item_title}>Min Track / Spacing</Col>
                  <Col className={styles.item_content}>{orderDetail?.options.min_track_spacing}</Col>
                </Row>
              </Col>
            </Row>
            <div className={styles.divider} />
            <Col className={styles.subtitle}>Price</Col>
            <Row className={styles.order_price_box}>
              <Col className={styles.order_price_item}>
                <Row className={styles.price_title}>부품 전체 금액(단가)</Row>
                <Row className={styles.price_amount}>￦ {orderDetail?.prices.part_fee.toLocaleString()}</Row>
              </Col>
              <Col className={styles.divider_plus}>+</Col>
              <Col className={styles.order_price_item}>
                <Row className={styles.price_title}>발주 금액</Row>
                <Row className={styles.price_amount}>￦ {orderDetail?.prices.order_fee.toLocaleString()}</Row>
              </Col>
              <Col className={styles.divider_plus}>+</Col>
              <Col className={styles.order_price_item}>
                <Row className={styles.price_title}>예상 수수료</Row>
                <Row className={styles.price_amount}>￦ {orderDetail?.prices.estimated_fee.toLocaleString()}</Row>
              </Col>
              <Col className={styles.divider_plus}>+</Col>
              <Col className={styles.order_price_item}>
                <Row className={styles.price_title}>배송 금액</Row>
                <Row className={styles.price_amount}>￦ {orderDetail?.prices.delivery_fee.toLocaleString()}</Row>
              </Col>
              <Col className={styles.divider_plus}>+</Col>
            </Row>
            <Col style={{ height: 30 }} />

            <Row className={styles.order_price_box}>
              <Col className={styles.order_price_item}>
                <Row className={styles.price_title}>제작 단가</Row>
                <Row className={styles.price_amount}>￦ {orderDetail?.prices.made_fee.toLocaleString()}</Row>
              </Col>
              <Col className={styles.divider_plus}>=</Col>
              <Col className={styles.order_price_item}>
                <Row className={styles.price_title}>최종 금액</Row>
                <Row className={styles.price_result}>￦ {orderDetail?.prices.total_fee.toLocaleString()}</Row>
              </Col>
            </Row>
            <Col />
            <Col />

            <div className={styles.divider} />
            <Col className={styles.subtitle}>Order Status </Col>
            <Row className={styles.order_status_box}>
              <Space
                className={
                  orderDetail?.is_motion && orderDetail?.is_smt
                    ? styles.order_status_nav_with_WORK_SMT
                    : orderDetail?.is_motion && !orderDetail?.is_smt
                      ? styles.order_status_nav_with_WORK
                      : styles.order_status_nav
                }
              >
                <Col
                  className={
                    Number(orderDetail?.order_step) < 4
                      ? styles.order_status_nav_item_in_progress // 1,2,3
                      : styles.order_status_nav_item_done // 4 ~
                  }
                >
                  {ORDER_STATUS.PREPATE_PART}
                </Col>
                <Col
                  className={
                    Number(orderDetail?.order_step) < 4
                      ? styles.order_status_nav_item_wait // 1,2,3
                      : Number(orderDetail?.order_step) > 3 && Number(orderDetail?.order_step) < 8
                        ? styles.order_status_nav_item_in_progress // 4,5,6,7
                        : styles.order_status_nav_item_done // 8 ~
                  }
                >
                  {ORDER_STATUS.MAKE_CIRCUIT}
                </Col>
                {orderDetail?.is_motion ? (
                  <Col
                    className={
                      Number(orderDetail?.order_step) < 8
                        ? styles.order_status_nav_item_wait // ~ 7
                        : Number(orderDetail?.order_step) > 7 && Number(orderDetail?.order_step) < 10
                          ? styles.order_status_nav_item_in_progress // 8,9
                          : styles.order_status_nav_item_done // 10
                    }
                  >
                    {ORDER_STATUS.INSPECT_PRODUCT}
                  </Col>
                ) : null}
                <Col
                  className={
                    Number(orderDetail?.order_step) < 10
                      ? styles.order_status_nav_item_wait // ~ 9
                      : Number(orderDetail?.order_step) > 9 && Number(orderDetail?.order_step) < 13
                        ? styles.order_status_nav_item_in_progress // 8,9
                        : styles.order_status_nav_item_done // 10
                  }
                >
                  {ORDER_STATUS.DELIVER_PRODUCT}
                </Col>
              </Space>
              <Row
                className={
                  orderDetail?.is_motion && orderDetail?.is_smt
                    ? styles.order_progress_bar_with_WORKandSMT
                    : orderDetail?.is_motion && !orderDetail?.is_smt
                      ? styles.order_progress_bar_with_WORK
                      : !orderDetail?.is_motion && orderDetail?.is_smt
                        ? styles.order_progress_bar_with_SMT
                        : styles.order_progress_bar
                  // ? orderDetail?.order.is_smt
                  //   ? styles.order_progress_bar_with_SMT
                  //   : styles.order_progress_bar
                  // : ""
                }
                align={"middle"}
              >
                {Array(Math.max(Number(orderDetail?.order_step ?? 0) - (orderDetail?.is_smt ? 1 : 2), 0)).fill(
                  <>
                    <Col className={styles.status_icon_done}></Col>
                    <Col className={styles.status_line_done} />
                  </>,
                )}
                {orderDetail?.order_step === 12 ? (
                  <Col className={styles.status_icon_done} />
                ) : (
                  <Col className={styles.status_icon_in_progress} />
                )}
                {orderDetail?.order_step === 12
                  ? null
                  : Array((orderDetail?.is_motion ? 12 : 10) - Number(orderDetail?.order_step ?? 0)).fill(
                      <>
                        <Col className={styles.status_line_wait} />
                        <Col className={styles.status_icon_wait} />
                      </>,
                    )}
              </Row>
              <Row className={styles.order_progress_status} align={"middle"}>
                <Col className={styles.order_progress_desc}>부품 주문</Col>
                <Col className={styles.order_progress_desc}>부품 배송 중</Col>
                <Col className={styles.order_progress_desc}>부품 도착</Col>
                <Col className={styles.order_progress_desc}>회로 주문</Col>
                <Col className={styles.order_progress_desc}>회로 제작</Col>
                {orderDetail?.is_smt ? <Col className={styles.order_progress_desc}>SMT 진행</Col> : null}
                <Col className={styles.order_progress_desc}>회로 도착</Col>
                {orderDetail?.is_motion ? <Col className={styles.order_progress_desc}>검사 진행</Col> : null}
                {orderDetail?.is_motion ? <Col className={styles.order_progress_desc}>검사 완료</Col> : null}
                <Col className={styles.order_progress_desc}>배송 준비</Col>
                <Col className={styles.order_progress_desc}>배송 중</Col>
                <Col className={styles.order_progress_desc}>배송 완료</Col>
              </Row>
              <BasicButton
                className={styles.order_tracking_button}
                onClick={() =>
                  modalDispatch({
                    open: true,
                    children: (
                      <BasicModal header="배송 추적" width={426} height={674}>
                        <Row className={styles.tracking_info_wrapper}>
                          <Row className={styles.tracking_info}>
                            <Col className={styles.tracking_info_title}>주문 번호</Col>
                            <Col className={styles.tracking_info_content}>{shipping?.order_number}</Col>
                          </Row>
                          <Row className={styles.tracking_info}>
                            <Col className={styles.tracking_info_title}>주문 일자</Col>
                            <Col className={styles.tracking_info_content}>
                              {dayjs(orderDetail?.created_at).format("YYYY-MM-DD")}
                            </Col>
                          </Row>
                          <Row className={styles.tracking_info}>
                            <Col className={styles.tracking_info_title}>송장 번호</Col>
                            <Col className={styles.tracking_info_content}>{shipping?.shipping_number}</Col>
                          </Row>
                          <Row className={styles.tracking_info}>
                            <Col className={styles.tracking_info_title}>배송 업체</Col>
                            <Col className={styles.tracking_info_content}>{shipping?.shipping_company}</Col>
                          </Row>
                          {/* <div className={styles.tracking_divider} /> */}
                          {/* <Row className={styles.tracking_detail}></Row> */}
                        </Row>
                      </BasicModal>
                    ),
                  })
                }
              >
                배송 추적
              </BasicButton>
            </Row>
            <div className={styles.divider} />

            <Col className={styles.subtitle}>Address</Col>
            <Row className={styles.order_address_box} align={"middle"}>
              <Space className={styles.order_address_contents} size={10}>
                <Col>
                  <HomeOutlined />
                </Col>
                <Col>
                  <Row>
                    <Col className={styles.address_name}>
                      {orderDetail?.receiver} ({orderDetail?.address_name})
                    </Col>
                    <Col className={styles.address_number}>{orderDetail?.phone_number}</Col>
                  </Row>
                  <Row className={styles.address}>
                    {orderDetail?.address_json_string} ({orderDetail?.postal_code})
                  </Row>
                </Col>
              </Space>
            </Row>
            <div className={styles.divider} />
            {/* 영수증 정보 */}
            {/* <Col className={styles.subtitle}>Payment Card</Col>
            <Row className={styles.order_payment_box} align={"middle"}>
              <Row>
                <Col className={styles.card_image}>img</Col>
                <Col>
                  <Row className={styles.card_company}>Master Card</Row>
                  <Row className={styles.card_name}>
                    Team Card1
                    <EditOutlined />
                  </Row>
                </Col>
              </Row>
              <Row className={styles.card_info}>**** **** **** 1720 | 12 / 28</Row>
            </Row> */}
          </Space>
        </Col>
      </Row>
    </LayoutOrderManage>
  )
}
export default AuthHoc(OrderDetailPage)
