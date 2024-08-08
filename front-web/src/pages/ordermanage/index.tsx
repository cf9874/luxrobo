import { LayoutOrderManage } from "Layout"
import styles from "./ordermanage.module.scss"
import { Col, Row, Space } from "antd"
import { BasicInput } from "components/Input"
import { useRouter } from "next/router"
import { BasicButton } from "components/Button"
import { OrderHistoryDto } from "apis/dto"
// import { GetServerSideProps } from "next"
import { OrderStatus } from "components/OrderStatus"
import { apiManager, apiUtil } from "apis"
import dayjs from "dayjs"
import { useAsyncEffect, useInputs } from "hooks"
import { useState } from "react"
import AuthHoc from "hoc/AuthHoc"

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const response = await apiManager.updateContext(ctx).orderApi.getHistoryList()

//   if (apiUtil.isErrorResponse(response)) {
//     return {
//       props: { orderList: [] },
//     }
//   }

//   return {
//     props: { orderList: response },
//   }
// }

const OderManagePage = () => {
  const [orderListState, setOrderListState] = useState<OrderHistoryDto[]>([])
  const [orderSearchListState, setOrderSearchListState] = useState<OrderHistoryDto[]>([])

  useAsyncEffect(async () => {
    const response = await apiManager.orderApi.getHistoryList()
    console.log(response)
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      // 상황에 따라 빈배열로 set할지 alert만 띄울지 선택
      // 페이지에따라 기존 props에서 errorMsg가 있으면 retrun하던 코드 제거필요
      // setOrderListState([])
    } else {
      setOrderListState(response)
      setOrderSearchListState(response)
    }
  }, [])

  const router = useRouter()

  const searchInput = useInputs({ value: "" })

  return (
    <LayoutOrderManage>
      <Row className={styles.main_container}>
        <Col className={styles.contents_container}>
          <Row className={styles.content_main_title_box} align={"bottom"}>
            <Col className={styles.content_main_title}>History</Col>
          </Row>
          <Row className={styles.subtitle_wrapper} justify={"space-between"} align={"middle"}>
            <Col className={styles.subtitle}>Order History</Col>
            <BasicInput
              style={{ width: 600, marginRight: 12 }}
              onChange={searchInput.onChange}
              value={searchInput.value}
              onKeyDown={event => {
                if (event.key === "Enter") {
                  if (searchInput.value === "") {
                    setOrderSearchListState(orderListState)
                  } else {
                    // setCustomListState(() => blockList.filter(faq => faq.tags.includes(searchInput.value.toString())))
                    setOrderSearchListState(() =>
                      orderListState.filter(order => order.project_name.includes(searchInput.value)),
                    )
                  }
                }
              }}
              theme={{
                colorPrimary: "#45d6df",
                borderRadius: 20,
                colorBorder: "#1b3852",
              }}
            />
          </Row>
          <Space direction="vertical" className={styles.order_list_wrapper}>
            <Row className={styles.order_list_nav}>
              <Col className={styles.order_list_nav_item}>Project</Col>
              <Col className={styles.order_list_nav_item}>Price</Col>
              <Col className={styles.order_list_nav_item}>Order Status</Col>
              <Col className={styles.order_list_nav_item}>Detail</Col>
            </Row>
            {orderSearchListState.map(order => {
              return (
                <Row key={order.seq_no} className={styles.order_list}>
                  <Col className={styles.order_list_item}>
                    <Row className={styles.order_project_box}>
                      <Col className={styles.order_project_name}>{order.project_name}</Col>
                      <Col className={styles.order_project_info}>
                        <Row className={styles.order_project_info_box}>
                          <Row className={styles.order_project_info_title}>주문 번호</Row>
                          <Row className={styles.order_project_info_detail}>{order.order_number}</Row>
                        </Row>
                        <Row className={styles.order_project_info_box}>
                          <Row className={styles.order_project_info_title}>주문 일자</Row>
                          <Row className={styles.order_project_info_detail}>
                            {dayjs(order.created_at).format("YYYY-MM-DD")}
                          </Row>
                        </Row>
                        <Row className={styles.order_project_info_box}>
                          <Row className={styles.order_project_info_title}>수량</Row>
                          <Row className={styles.order_project_info_detail}>{order.amount}pcs</Row>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col className={styles.order_list_item}>
                    <Row className={styles.order_price_box}>
                      <Col className={styles.order_price_info}>
                        <Row className={styles.order_price_info_box}>
                          <Row className={styles.order_price_info_title}>부품 전체 금액</Row>
                          <Row className={styles.order_price_info_detail}>￦ {order.prices.part_fee}</Row>
                        </Row>
                        <Row className={styles.order_price_info_box}>
                          <Row className={styles.order_price_info_title}>발주 금액</Row>
                          <Row className={styles.order_price_info_detail}>￦ {order.prices.order_fee}</Row>
                        </Row>
                        <Row className={styles.order_price_info_box}>
                          <Row className={styles.order_price_info_title}>예상 수수료</Row>
                          <Row className={styles.order_price_info_detail}>￦ {order.prices.estimated_fee}</Row>
                        </Row>
                        <Row className={styles.order_price_info_box}>
                          <Row className={styles.order_price_info_title}>배송 금액</Row>
                          <Row className={styles.order_price_info_detail}>￦ {order.prices.delivery_fee}</Row>
                        </Row>
                        <Row className={styles.order_price_info_box}>
                          <Row className={styles.order_price_info_title}>최종 금액</Row>
                          <Row className={styles.order_price_info_detail}>￦ {order.prices.total_fee}</Row>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col className={styles.order_list_item}>
                    <OrderStatus orderStatus={order.order_step} is_smt={order.is_smt} />
                  </Col>
                  <Col className={styles.order_list_item}>
                    <Row className={styles.order_detail_box}>
                      <Col className={styles.order_detail_item_title}>
                        <Row>배송지</Row>
                        <Row>결제 수단</Row>
                      </Col>
                      <Col className={styles.order_detail_item_content}>
                        <Row>{order.address_name}</Row>
                        <Row>{order.method}</Row>
                      </Col>
                      <Col className={styles.order_detail_item}>
                        <Row className={styles.detail_navigate_button}>
                          <BasicButton onClick={() => void router.push(`/ordermanage/id/?id=${order.seq_no}`)}>
                            Order Details
                          </BasicButton>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )
            })}
          </Space>
        </Col>
      </Row>
    </LayoutOrderManage>
  )
}
export default AuthHoc(OderManagePage)
