import { Col, Row } from "antd"
import styles from "./orderstatus.module.scss"
import { DETAIL_ORDERSTATUS, DETAIL_ORDERSTATUS_TITLE, ORDER_STATUS } from "@const/order.status.const"

// orderStatus
// 1 2 3 : 부품 준비
// 4 5 6 7 : 회로 제작
// 8 9 : 작동 검사
// 10 11 12 : 제품 배송

export const OrderStatus = ({ orderStatus, is_smt }: { orderStatus: DETAIL_ORDERSTATUS; is_smt: boolean }) => {
  console.log("orderStatus : ", orderStatus)
  const orderInfo = getOrderStatus(orderStatus, is_smt)
  return (
    <>
      <Row className={styles.order_status_title} justify={"center"}>
        {orderInfo.statusTitle}
      </Row>
      <Row className={styles.order_status_box}>
        <Col className={styles.order_bar_wrapper}>
          {orderInfo.statusDetail.map((order, index) => (
            <Row key={index} className={styles.order_status_progress_box}>
              <Col
                className={
                  order.status < orderStatus || orderStatus === DETAIL_ORDERSTATUS.COMPLETE_DELEVERY
                    ? styles.order_status_icon_done
                    : order.status === orderStatus
                    ? styles.order_status_icon_in_progress
                    : styles.order_status_icon_wait
                }
              />
              {index !== orderInfo.statusDetail.length - 1 ? (
                <Col className={styles.order_status_icon_ready_bar} />
              ) : null}
            </Row>
          ))}
        </Col>
        <Col>
          {orderInfo.statusDetail.map((order, index) => (
            <Row key={index} className={styles.order_status_desc_box}>
              <Col
                className={
                  // orderStatus : 현재 order 상태
                  // order.status : order 하나
                  order.status < orderStatus || orderStatus === DETAIL_ORDERSTATUS.COMPLETE_DELEVERY
                    ? styles.order_status_desc_done
                    : order.status === orderStatus
                    ? styles.order_status_desc_in_progress
                    : styles.order_status_desc_wait
                }
              >
                {order.title}
              </Col>
              <Col></Col>
            </Row>
          ))}
        </Col>
      </Row>
    </>
  )
}

const getOrderStatus = (status: DETAIL_ORDERSTATUS, is_smt: boolean) => {
  const order: {
    statusTitle: ORDER_STATUS | ""
    statusDetail: { title: DETAIL_ORDERSTATUS_TITLE; status: DETAIL_ORDERSTATUS }[]
  } = {
    statusTitle: "",
    statusDetail: [],
  }

  if (
    status === DETAIL_ORDERSTATUS.ORDER_PART ||
    status === DETAIL_ORDERSTATUS.DELIEVER_PART ||
    status === DETAIL_ORDERSTATUS.ARRIVE_PART
  ) {
    order.statusTitle = ORDER_STATUS.PREPATE_PART
    order.statusDetail = [
      { title: DETAIL_ORDERSTATUS_TITLE.ORDER_PART, status: DETAIL_ORDERSTATUS.ORDER_PART },
      { title: DETAIL_ORDERSTATUS_TITLE.DELIEVER_PART, status: DETAIL_ORDERSTATUS.DELIEVER_PART },
      { title: DETAIL_ORDERSTATUS_TITLE.ARRIVE_PART, status: DETAIL_ORDERSTATUS.ARRIVE_PART },
    ]
  } else if (
    status === DETAIL_ORDERSTATUS.ORDER_CIRCUIT ||
    status === DETAIL_ORDERSTATUS.MAKE_CIRCUIT ||
    status === DETAIL_ORDERSTATUS.SMT ||
    status === DETAIL_ORDERSTATUS.ARRIVE_CIRCUIT
  ) {
    // return ORDER_STATUS.MAKE_CIRCUIT
    order.statusTitle = ORDER_STATUS.MAKE_CIRCUIT

    order.statusDetail = is_smt
      ? [
          { title: DETAIL_ORDERSTATUS_TITLE.ORDER_CIRCUIT, status: DETAIL_ORDERSTATUS.ORDER_CIRCUIT },
          { title: DETAIL_ORDERSTATUS_TITLE.MAKE_CIRCUIT, status: DETAIL_ORDERSTATUS.MAKE_CIRCUIT },
          { title: DETAIL_ORDERSTATUS_TITLE.SMT, status: DETAIL_ORDERSTATUS.SMT },
          { title: DETAIL_ORDERSTATUS_TITLE.ARRIVE_CIRCUIT, status: DETAIL_ORDERSTATUS.ARRIVE_CIRCUIT },
        ]
      : [
          { title: DETAIL_ORDERSTATUS_TITLE.ORDER_CIRCUIT, status: DETAIL_ORDERSTATUS.ORDER_CIRCUIT },
          { title: DETAIL_ORDERSTATUS_TITLE.MAKE_CIRCUIT, status: DETAIL_ORDERSTATUS.MAKE_CIRCUIT },
          { title: DETAIL_ORDERSTATUS_TITLE.ARRIVE_CIRCUIT, status: DETAIL_ORDERSTATUS.ARRIVE_CIRCUIT },
        ]
  } else if (status === DETAIL_ORDERSTATUS.INSPECT_PRODUCT || status === DETAIL_ORDERSTATUS.COMPLETE_INSPECTING) {
    order.statusTitle = ORDER_STATUS.INSPECT_PRODUCT
    order.statusDetail = [
      { title: DETAIL_ORDERSTATUS_TITLE.INSPECT_PRODUCT, status: DETAIL_ORDERSTATUS.INSPECT_PRODUCT },
      { title: DETAIL_ORDERSTATUS_TITLE.COMPLETE_INSPECTING, status: DETAIL_ORDERSTATUS.COMPLETE_INSPECTING },
    ]
  } else {
    // return ORDER_STATUS.DELIVER_PRODUCT
    order.statusTitle = ORDER_STATUS.DELIVER_PRODUCT
    order.statusDetail = [
      { title: DETAIL_ORDERSTATUS_TITLE.PREPARE_DELIVERY, status: DETAIL_ORDERSTATUS.PREPARE_DELIVERY },
      { title: DETAIL_ORDERSTATUS_TITLE.DELIVERING, status: DETAIL_ORDERSTATUS.DELIVERING },
      { title: DETAIL_ORDERSTATUS_TITLE.COMPLETE_DELEVERY, status: DETAIL_ORDERSTATUS.COMPLETE_DELEVERY },
    ]
  }
  return order
}
