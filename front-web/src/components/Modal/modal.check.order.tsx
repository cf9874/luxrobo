import { BasicModal } from "./modal.basic"
import modalStyles from "./modal.module.scss"
import styles from "./modal.check.order.module.scss"
import { Col, Row } from "antd"
import { BasicButton } from "components/Button"
// import { ICommonModalProps } from "type"
import { useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
// import { BasicDropdown } from "components/Dropdown"
import { HomeOutlined } from "@ant-design/icons"
import { AddressDto } from "apis/dto/common.dto"
import { NumberUtil } from "utils"
import { TossPayments } from "components/Extras"
import { apiManager, apiUtil } from "apis"

const PRICE = 500

export const CheckOrderModal = (props: {
  address: AddressDto | undefined
  partPrice: number
  estimatedCommissionValue: number
  orderAmountValue: number
  deliveryAmountValue: number
  finalPrice: number
  projectId: number
  companyId: string
  optionInspection: boolean
  optionSmt: boolean
  amount: number
  productionPrice: number
  option: {
    boardType: string
    thickness: string
    solderMask: string
    silkscreen: string
    surface: string
    processes: string
    finishedCopper: string
    minHollSize: string
    minTrackSpacing: string
    [key: string]: string
  }
  projectTitle: string
}) => {
  const modalDispatch = useRedux(setModal)

  const onApply = async () => {
    const res = await apiManager.orderApi.createSheet({
      projectId: props.projectId,
      orderSheetData: {
        address_seq: Number(props.address?.addressID),
        amount: props.amount,
        company_id: props.companyId,
        is_motion: props.optionInspection,
        is_smt: props.optionSmt,
        options: {
          board_type: props.option.boardType,
          finished_copper: props.option.finishedCopper,
          min_holl_size: props.option.minHollSize,
          min_track_spacing: props.option.minTrackSpacing,
          silkscreen: props.option.silkscreen,
          solder_mask: props.option.solderMask,
          surface_finish: props.option.surface,
          thickness: props.option.thickness,
          via_process: props.option.processes,
        },
        prices: {
          delivery_fee: props.deliveryAmountValue,
          estimated_fee: props.estimatedCommissionValue,
          order_fee: props.orderAmountValue,
          part_fee: props.partPrice === 0 ? PRICE : props.partPrice,
          total_fee: props.finalPrice,
          made_fee: props.productionPrice,
        },
      },
    })

    if (apiUtil.isErrorResponse(res)) {
      modalDispatch({ open: false })
      alert(res.message)
      return
    }

    modalDispatch({
      open: true,
      children: <TossPayments projectId={props.projectId} orderId={res.seq_no} price={props.finalPrice} />,
    })
  }

  return (
    <BasicModal
      header="결제 정보 확인"
      width={1000}
      height={796}
      footer={
        <Row
          className={modalStyles.modal_button_wrapper}
          style={{
            justifyContent: "flex-end",
            marginRight: 24,
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
            Cancel
          </BasicButton>
          <BasicButton
            onClick={onApply}
            style={{
              width: 132,
            }}
          >
            Order
          </BasicButton>
        </Row>
      }
    >
      <Col className={modalStyles.wide_modal_container}>
        <Row className={styles.title_container}>
          <Col className={styles.title_wrapper}>
            <Row className={styles.title_nav_text}>Project Name</Row>
            <Row className={styles.project_title}>{props.projectTitle}</Row>
          </Col>
          <div className={styles.section_divider} />
        </Row>
        <Row className={styles.price_container}>
          <Col className={styles.price_wrapper}>
            <Row className={styles.price_title}>Price</Row>
            <Row className={styles.price_box}>
              <Col className={styles.price_amount}>
                <Row>부품 전체 금액(단가)</Row>
                <Row className={styles.price}>￦ {props.partPrice.toLocaleString()}</Row>
              </Col>
              <Col className={styles.price_symbol}>+</Col>
              <Col className={styles.price_amount}>
                <Row className={styles.price_nav_text}>발주 금액</Row>
                <Row className={styles.price}>￦ {props.orderAmountValue.toLocaleString()}</Row>
              </Col>
              <Col className={styles.price_symbol}>+</Col>
              <Col className={styles.price_amount}>
                <Row className={styles.price_nav_text}>예상 수수료</Row>
                <Row className={styles.price}>￦ {props.estimatedCommissionValue.toLocaleString()}</Row>
              </Col>
              <Col className={styles.price_symbol}>+</Col>
              <Col className={styles.price_amount}>
                <Row className={styles.price_nav_text}>배송 금액</Row>
                <Row className={styles.price}>￦ {props.deliveryAmountValue.toLocaleString()}</Row>
              </Col>
              <Col className={styles.price_symbol}>+</Col>
            </Row>
            <Row className={styles.price_box} style={{ marginTop: 20 }}>
              <Col className={styles.price_amount} style={{ minWidth: 148 }}>
                <Row className={styles.price_nav_text}>제작 단가</Row>
                <Row className={styles.price}>￦ {props.productionPrice.toLocaleString()}</Row>
              </Col>
              <Col className={styles.price_symbol}>+</Col>
              <Col className={styles.price_amount} style={{ width: 200 }}>
                <Row className={styles.price_nav_text}>최종 금액</Row>
                <Row className={styles.price_total}>￦ {props.finalPrice.toLocaleString()}</Row>
              </Col>
            </Row>
          </Col>
          <div className={styles.section_divider} />
        </Row>
        <Row className={styles.address_container}>
          <Col className={styles.address_select}>
            <Row className={styles.address_title}>Address</Row>
            <Row>
              {/* <BasicDropdown
                style={{
                  width: 200,
                }}
                size="small"
                options={[
                  {
                    label: "회사",
                    value: "회사",
                  },
                ]}
                defaultValue={{
                  label: "회사",
                  value: "회사",
                }}
              /> */}
            </Row>
          </Col>
          <Row className={styles.address_box} align={"top"}>
            <HomeOutlined className={styles.address_icon} />
            <Col className={styles.adress_data}>
              <Row className={styles.address_name_box}>
                <Col className={styles.address_name}>
                  {props.address?.receiver}({props.address?.address_name})
                </Col>
                <Col className={styles.address_tel}>{NumberUtil.formatPhoneNumber(props.address?.phone_number)}</Col>
              </Row>
              <Row className={styles.address_text}>
                {props.address?.address_json_string}({props.address?.postal_code})
              </Row>
            </Col>
          </Row>
          <div className={styles.section_divider} />
        </Row>
        {/* <Row className={styles.payment_container}>
          <Col className={styles.payment_select}>
            <Row className={styles.payment_title}>Payment Card</Row>
            <Row>
              <BasicDropdown
                style={{
                  width: 200,
                }}
                size="small"
                options={[
                  {
                    label: "UserCard1",
                    value: "UserCard1",
                  },
                ]}
                defaultValue={{
                  label: "UserCard1",
                  value: "UserCard1",
                }}
              />
            </Row>
          </Col>
          <Row className={styles.payment_box} align={"top"}>
            <Row className={styles.payment_data}>
              <Col className={styles.payment_img}></Col>
              <Col>
                <Row className={styles.card_company}>Master card</Row>
                <Row className={styles.payment_card_name}>
                  Team Card 1<EditOutlined />
                </Row>
              </Col>
            </Row>
            <Col className={styles.payment_number}>**** **** **** 1720 | 12 / 28</Col>
          </Row>
        </Row> */}
      </Col>
    </BasicModal>
  )
}
