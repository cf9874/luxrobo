import { Col, ConfigProvider, Radio, Row, Space } from "antd"
import styles from "./tab.module.scss"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { BasicButton } from "components/Button"
import { useState } from "react"
import { setModal } from "redux/reducers/config"
import { useRedux } from "hooks"
import { DeletePaymentModal } from "components/Modal"

export const PersonalBillingTab = () => {
  const modalDispatch = useRedux(setModal)

  const [cardType, setCardType] = useState(0)
  const [openAddCard, setOpenAddCard] = useState(false)
  return (
    <Col>
      <Row className={styles.billing_summary_container}>
        <Col className={styles.setting_title}>Billing Summary</Col>
        <Space className={styles.billing_summary_wrapper} size={24}>
          <Row className={styles.monthly_bill_box} justify={"space-between"} align={"middle"}>
            <Col className={styles.current_bill_title}>Current monthly bill</Col>
            <Col className={styles.current_bill_amount}>$0</Col>
          </Row>
          <Row className={styles.monthly_bill_box} justify={"space-between"} align={"middle"}>
            <Col className={styles.next_bill_title}>Next monthly bill</Col>
            <Col className={styles.next_bill_amount}>$0</Col>
          </Row>
        </Space>
      </Row>
      <Row className={styles.payment_cards_container}>
        <Col className={styles.setting_title}>Payment Cards</Col>
        <Space className={styles.payment_card_list} direction="vertical" size={20}>
          {[1, 2].map((item, index) => {
            return (
              <Row key={index} className={styles.payment_card_container}>
                <Space className={styles.payment_card} size={0}>
                  <Row align={"middle"} className={styles.payment_card_name_wrapper}>
                    <Col className={styles.payment_card_img}>카드 img</Col>
                    <Col className={styles.payment_card_name_box}>
                      <Row className={styles.card_company}>Master Card</Row>
                      <Row>
                        <Col className={styles.card_name}>User Card 1</Col>
                        <EditOutlined
                          className={styles.card_name}
                          onClick={() => {
                            console.log("edit card name")
                          }}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Row className={styles.billing_card_number}>**** **** **** 1720 | 12 / 28</Row>
                  <Row justify={"end"}>
                    <DeleteOutlined
                      className={styles.delete_card}
                      onClick={() => {
                        modalDispatch({
                          open: true,
                          children: <DeletePaymentModal onApply={() => console.log("Remove")} />,
                        })
                      }}
                    />
                  </Row>
                </Space>
              </Row>
            )
          })}
          <Row>
            {!openAddCard ? (
              <BasicButton
                className={styles.add_card_button}
                onClick={() => {
                  setOpenAddCard(true)
                  console.log("add card")
                }}
              >
                <PlusOutlined /> Add Card
              </BasicButton>
            ) : (
              <Col className={styles.new_card}>
                <Row className={styles.add_card_title}>Credit Card</Row>
                <Row className={styles.card_type_list}>
                  <Col>visa</Col>
                  <Col>maste</Col>
                  <Col>american</Col>
                  <Col>jcb</Col>
                  <Col>union</Col>
                </Row>
                <Row className={styles.add_card_title}>Payment details</Row>
                <Space direction="vertical" className={styles.add_address_input_container} size={0}>
                  <Col className={styles.add_card_input_wrapper}>
                    <Col className={styles.add_card_input_label}>Card Name</Col>
                    <input placeholder="Card Name" className={styles.add_card_input} />
                  </Col>
                  <Col className={styles.add_card_input_wrapper}>
                    <Col className={styles.add_card_input_label}>Card Number</Col>
                    <input placeholder="0000 0000 0000 0000" className={styles.add_card_input} />
                  </Col>
                  <Col className={styles.add_card_input_wrapper}>
                    <Row justify={"space-between"}>
                      <Col>
                        <Col className={styles.add_address_input_label}>Expiry Date</Col>
                        <input placeholder="MM / YY" className={styles.add_card_input_short} />
                      </Col>
                      <Col>
                        <Col className={styles.add_address_input_label}>Security Code</Col>
                        <input placeholder="Code" className={styles.add_card_input_short} />
                      </Col>
                    </Row>
                  </Col>
                  <Radio.Group
                    value={cardType}
                    onChange={e => {
                      setCardType(e.target.value as number)
                    }}
                    className={styles.select_card_type_radio_group}
                  >
                    <ConfigProvider
                      theme={{
                        token: {
                          colorPrimary: "#45d6df",
                        },
                      }}
                    >
                      <Radio value={1}>Personal Card</Radio>
                    </ConfigProvider>
                    <ConfigProvider
                      theme={{
                        token: {
                          colorPrimary: "#45d6df",
                        },
                      }}
                    >
                      <Radio value={2}>Corporate Card</Radio>
                    </ConfigProvider>
                  </Radio.Group>
                  <Col className={styles.add_card_input_wrapper}>
                    <Row justify={"space-between"}>
                      <Col>
                        <Col className={styles.add_card_input_label}>Date of Birth</Col>
                        <input placeholder="YY / MM / DD" className={styles.add_card_input_short} />
                      </Col>
                      <Col>
                        <Col className={styles.add_card_input_label}>Payment Password</Col>
                        <input placeholder="Password" className={styles.add_card_input_short} />
                      </Col>
                    </Row>
                  </Col>
                  {/* <input
                      type="radio"
                      checked={defaultAddress}
                      className={styles.set_default_address}
                      onClick={() => {
                        setDefaultAddress(state => !state)
                      }}
                    /> */}
                </Space>
                <Row className={styles.card_button_wrapper}>
                  <BasicButton
                    className={styles.add_card_cancel_button}
                    onClick={() => {
                      setOpenAddCard(false)
                    }}
                  >
                    Cancel
                  </BasicButton>
                  <BasicButton
                    className={styles.add_card_save_button}
                    onClick={() => {
                      setOpenAddCard(false)
                    }}
                  >
                    Save
                  </BasicButton>
                </Row>
              </Col>
            )}
          </Row>
        </Space>
      </Row>
    </Col>
  )
}
