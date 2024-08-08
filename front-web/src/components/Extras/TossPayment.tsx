import React, { useRef, useState } from "react"
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk"
import { useAppSelector, useAsyncEffect, useRedux } from "hooks"
import { shallowEqual } from "react-redux"
import { nanoid } from "nanoid"
// import { useRouter } from "next/router"
import { Row } from "antd"
import { BasicButton } from "components/Button"
import { modalStyles } from "components/Modal"
import { setModal } from "redux/reducers/config"
import { apiManager, apiUtil } from "apis"
import { BillingDto } from "apis/dto"
import router from "next/router"

export const TossPayments = ({ orderId, price, projectId }: { orderId: number; price: number; projectId: number }) => {
  const modalDispatch = useRedux(setModal)

  //   const router = useRouter()

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null)
  const [beginData, setBeginData] = useState<BillingDto | null>(null)
  //   const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance["renderPaymentMethods"]> | null>(null)

  const { profile } = useAppSelector(state => state.profileReducer, shallowEqual)

  const onError = (msg = "") => {
    modalDispatch({ open: false })
    alert(msg ? msg : "서버에 문제가 발생하였습니다.")
  }

  useAsyncEffect(async () => {
    const beginData = await apiManager.paymentApi.begin({ projectId, sheetSeq: orderId })

    if (apiUtil.isErrorResponse(beginData)) {
      onError(beginData.message)
      return
    }

    setBeginData(beginData)

    const paymentWidget = await loadPaymentWidget(
      `${process.env.NEXT_PUBLIC_TOSS_CLIENTKEY}`,
      `${beginData.customer_key ? beginData.customer_key : nanoid()}`,
    )

    // const paymentMethodsWidget = paymentWidget.renderPaymentMethods("#payment-widget", { value: PRICE })
    paymentWidget.renderPaymentMethods(
      "#payment-widget",
      {
        value: price,
        currency: "KRW",
        country: "KR",
      },
      { variantKey: "DEFAULT" },
    )

    paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" })

    paymentWidgetRef.current = paymentWidget // 결제 위젯 저장
    //paymentMethodsWidgetRef.current = paymentMethodsWidget  결제 방법 가져오기, 결제 수단을 커스텀용
  }, [])

  const onRequestPayment = async () => {
    // const successQuery = `price=${price}`
    // const successUrl = `${window.location.origin}/ordermanage`
    // const failUrl = `${window.location.origin}${router.asPath}`

    try {
      if (!beginData) {
        onError()
        return
      }

      const result = await paymentWidgetRef.current?.requestPayment({
        orderId: beginData.order_id,
        orderName: "부품 발주",
        customerEmail: profile.email,
        customerName: profile.username,
      })
      //   .then(data => {
      //     console.log(data)

      //     console.log(orderId)
      //     // 성공 처리: 결제 승인 API를 호출하세요
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })

      if (!result) {
        onError()
        return
      }

      console.log(result)

      // {paymentKey: 'pd12AjJexmnRQoOaPz8LLBO2WlLweN8y47BMw6vl0gkYqDNE',
      // orderId: 'fG7cAtAe02rBXdVVf7Z2S',
      // amount: 220000,
      // paymentType: 'NORMAL'}
      console.log(`sheetSeq ${orderId}`)
      console.log(projectId)
      console.log(`paymentSeq: ${beginData.seq_no}`)

      const endResult = await apiManager.paymentApi.end({
        beginSeq: beginData.seq_no,
        paymentKey: result.paymentKey,
        projectId,
        sayAmount: result.amount,
      })

      if (apiUtil.isErrorResponse(endResult)) {
        onError(endResult.message)
      }

      void router.push("/ordermanage")
      modalDispatch({ open: false })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // 에러 처리: 에러 목록을 확인하세요
      // https://docs.tosspayments.com/reference/error-codes#failurl로-전달되는-에러
      if (error?.code === "USER_CANCEL") {
        // 결제 고객이 결제창을 닫았을 때 에러 처리
      }
      //else if (error?.code === "INVALID_CARD_COMPANY") {
      // 유효하지 않은 카드 코드에 대한 에러 처리
      //}

      alert(error.message)
    }
  }

  return (
    <section style={{ width: " 500px" }}>
      <div id="payment-widget" />
      <div id="agreement" />
      <Row
        className={modalStyles.modal_button_wrapper}
        style={{
          marginBottom: 24,
        }}
      >
        <BasicButton
          onClick={() => {
            modalDispatch({ open: false })
          }}
          style={{
            width: 132,
          }}
        >
          취소
        </BasicButton>
        <BasicButton
          onClick={onRequestPayment}
          style={{
            width: 132,
          }}
        >
          결제
        </BasicButton>
      </Row>
    </section>
  )
}
