import styles from "./orderDetail.module.scss"
import { Divider, RadioChangeEvent } from "antd"
import { NextPage } from "next"
import { apiManager, apiUtil } from "@/apis"
import { PageFrameFooter } from "@/components/layout"
import { OrderAddressInfo, OrderDesc, OrderDescDetail } from "@/components/pages/order/orderDesc"
import { ObjectDescription } from "@/components/Description"
import { ORDERDETAIL } from "@/const"
import { useRouter } from "next/router"
import { useAsyncEffect } from "@/hooks"
import { BasicButton } from "@/components/Button"
import { useState } from "react"
import { BasicInput } from "@/components/Input"
import { PurchaseDetailSelection } from "@/components/Select"
import { BooleanRadioGroup } from "@/components/Radio"
import dynamic from "next/dynamic"
import { OrderDto } from "@/apis/dto/order.dto"
import { API_ERROR_MSG } from "@/const/api.error.const"
const OrderReceiptModal = dynamic(() => import("@/components/modal/order.receipt.modal"))
//------------------------------------------------------------------------------------------------------
const OrderDetail: NextPage = () => {
  const router = useRouter()
  //-------------------------------------------------------------------------
  // [Datas]
  const [orderID, setOrderID] = useState<number>(undefined)

  const [orderInfo, setOrderInfo] = useState<OrderDto>(undefined)

  const [orderAddressInfo, setOrderAddressInfo] = useState<OrderAddressInfo>(undefined)

  // [초기화]
  useAsyncEffect(async () => {
    if (!router.query.id) return

    //[set OrderID]
    setOrderID(Number(router.query.id))

    // [set OrderInfo]
    const orderResponse = await apiManager.orderApi.getOrderInfo(Number(router.query.id).toString())
    if (apiUtil.isErrorResponse(orderResponse)) {
      if (apiUtil.signChecker(orderResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(orderResponse.message)
      return
    }

    setOrderInfo(orderResponse)
    const { address_json_string, ...addressInfo } = orderResponse.address_info

    const splitAddress = address_json_string.split("(")
    setOrderAddressInfo({
      ...addressInfo,
      address: splitAddress.slice(1).join().slice(0, -1),
      detailAddress: splitAddress[0],
    })
  }, [router.query.id])

  //------------------------------------------------------------------------------------------------------
  // [footer Handler]
  const saveHandler = async () => {
    console.log("Save: Purchase")

    // 1. Order 수정
    const orderEdit = {
      // descB - amount, smt, motion
      amount: orderInfo.amount,
      is_smt: orderInfo.is_smt,
      is_motion: orderInfo.is_motion,
      // descC - option
      board_type: orderInfo.options.board_type,
      thickness: orderInfo.options.thickness,
      solder_mask: orderInfo.options.solder_mask,
      silkscreen: orderInfo.options.silkscreen,
      surface_finish: orderInfo.options.surface_finish,
      via_process: orderInfo.options.via_process,
      finished_copper: orderInfo.options.finished_copper,
      min_holl_size: orderInfo.options.min_holl_size,
      min_track_spacing: orderInfo.options.min_track_spacing,
      // descE - 배송지
      address_json_string: `${orderAddressInfo.detailAddress}(${orderAddressInfo.address})`,
      address_name: orderAddressInfo.address_name,
      phone_number: orderAddressInfo.phone_number,
      postal_code: orderAddressInfo.postal_code,
      receiver: orderAddressInfo.receiver,
    }

    console.log("orderEdit", orderEdit)
    const orderEditRes = await apiManager.orderApi.editOrderInfo(orderID.toString(), orderEdit)
    if (apiUtil.isErrorResponse(orderEditRes)) {
      if (apiUtil.signChecker(orderEditRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(orderEditRes.message)
      return
    }

    router.push("/order")
  }

  const cancelHandler = () => {
    console.log("Cancel: Purchase")
    router.push("/order")
  }
  //-------------------------------------------------------------------------
  // [Content Render]
  const OrderRender = ({ index, key, pm_value }) => {
    switch (key) {
      // desc A:
      case "user_seq":
        return (
          <div className={styles.desc_move_button_wrapper}>
            <p>{orderInfo.user_name}</p>
            <BasicButton
              className={styles.desc_move_button}
              onClick={() => {
                router.push(`/user/${pm_value}`)
              }}
            >
              이동
            </BasicButton>
          </div>
        )
      case "project_seq":
        return (
          <div className={styles.desc_move_button_wrapper}>
            <p>{orderInfo.project_name}</p>
            <BasicButton
              className={styles.desc_move_button}
              onClick={() => {
                router.push(`/project/${pm_value}`)
              }}
            >
              이동
            </BasicButton>
          </div>
        )
      case "seq_no":
        return (
          <div className={styles.desc_move_button_wrapper}>
            <BasicButton
              className={styles.desc_move_button_full}
              onClick={() => {
                router.push(`/shipping/${pm_value}`)
              }}
            >
              배송 정보로 이동
            </BasicButton>
          </div>
        )
      // desc B
      case "company_id":
        return (
          <div className={styles.desc_move_button_wrapper}>
            <p>{orderInfo.company_data.name}</p>
            <BasicButton
              className={styles.desc_move_button}
              onClick={() => {
                router.push(`/company/${pm_value}`)
              }}
            >
              이동
            </BasicButton>
          </div>
        )
      case "amount":
        return (
          <div className={styles.descB_amount_input_wrapper}>
            <BasicInput
              className={styles.descB_amount_input}
              value={pm_value}
              onChange={e => setOrderInfo({ ...orderInfo, [key]: e.target.value })}
            ></BasicInput>
            <span>pcs</span>
          </div>
        )
      case "is_smt":
      case "is_motion":
        return (
          <div>
            <BooleanRadioGroup
              option={"KR"}
              value={pm_value}
              onChange={({ target: { value } }: RadioChangeEvent) => {
                setOrderInfo({ ...orderInfo, [key]: value })
              }}
            ></BooleanRadioGroup>
          </div>
        )
      // desc C
      case "board_type":
      case "thickness":
      case "solder_mask":
      case "silkscreen":
      case "surface_finish":
      case "via_process":
      case "finished_copper":
      case "min_holl_size":
      case "min_track_spacing":
        return (
          <div>
            <PurchaseDetailSelection
              option={key}
              value={pm_value}
              onChange={change =>
                setOrderInfo({
                  ...orderInfo,
                  options: {
                    ...orderInfo.options,
                    [key]: change,
                  },
                })
              }
            ></PurchaseDetailSelection>
          </div>
        )
      // desc E
      case "addressID":
        return <div></div>
      case "address_name":
      case "receiver":
      case "phone_number":
      case "address":
      case "postal_code":
      case "detailAddress":
        return (
          <div>
            <BasicInput
              value={pm_value}
              onChange={e => setOrderAddressInfo({ ...orderAddressInfo, [key]: e.target.value })}
            ></BasicInput>
          </div>
        )
      // desc F
      case "receipt":
        return <OrderReceiptModal url={pm_value}></OrderReceiptModal>
      default:
        if (typeof pm_value === "object" && !Array.isArray(pm_value) && pm_value !== null)
          return <div>{JSON.stringify(pm_value)}</div>
        return <div>{pm_value}</div>
    }
  }

  //-------------------------------------------------------------------------
  // [UI 출력]
  return (
    <PageFrameFooter
      titleKey={ORDERDETAIL}
      handler={{
        saveHandler: saveHandler,
        cancelHandler: cancelHandler,
      }}
    >
      <div className={styles.container}>
        <ObjectDescription
          descInfo={OrderDesc.descA}
          descDetails={OrderDescDetail}
          data={orderInfo}
          render={OrderRender}
        ></ObjectDescription>
        <Divider></Divider>
        <ObjectDescription
          descInfo={OrderDesc.descB}
          descDetails={OrderDescDetail}
          data={orderInfo}
          render={OrderRender}
        ></ObjectDescription>
        <Divider></Divider>
        <ObjectDescription
          descInfo={OrderDesc.descC}
          descDetails={OrderDescDetail}
          data={orderInfo ? orderInfo.options : undefined}
          render={OrderRender}
        ></ObjectDescription>
        <Divider></Divider>
        <ObjectDescription
          descInfo={OrderDesc.descD}
          descDetails={OrderDescDetail}
          data={orderInfo ? orderInfo.prices : undefined}
          render={OrderRender}
        ></ObjectDescription>
        <Divider></Divider>
        <ObjectDescription
          descInfo={OrderDesc.descE}
          descDetails={OrderDescDetail}
          data={orderAddressInfo}
          render={OrderRender}
        ></ObjectDescription>
        <Divider></Divider>
        <ObjectDescription
          descInfo={OrderDesc.descF}
          descDetails={OrderDescDetail}
          data={orderInfo}
          render={OrderRender}
        ></ObjectDescription>
      </div>
    </PageFrameFooter>
  )
}

export default OrderDetail
