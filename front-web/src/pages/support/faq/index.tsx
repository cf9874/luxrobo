import { LayoutSupport } from "Layout"
import { Col, Row, Space } from "antd"
import { BasicInput } from "components/Input"
import styles from "./faq.module.scss"
import { MailOutlined, PhoneOutlined } from "@ant-design/icons"
import { FaqDto } from "apis/dto"
// import { GetServerSideProps } from "next"
import { apiManager, apiUtil } from "apis"
import { plainToInstance } from "class-transformer"
import { useAsyncEffect, useInputs } from "hooks"
import { useState } from "react"
import AuthHoc from "hoc/AuthHoc"

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const response = await apiManager.updateContext(ctx).faqApi.getList()

//   if (apiUtil.isErrorResponse(response)) {
//     return {
//       props: { fqaList: [], errorMsg: response.message },
//     }
//   }

//   return {
//     props: { faqList: response },
//   }
// }

const FaqPage = () => {
  const [faqListState, setFaqListState] = useState<FaqDto[]>([])
  const [searchFaqListState, setSearchFaqListState] = useState<FaqDto[]>([])
  useAsyncEffect(async () => {
    const response = await apiManager.faqApi.getList()
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
    } else {
      setFaqListState(response)
      setSearchFaqListState(response)
    }
  }, [])
  const searchInput = useInputs({ value: "" })

  return (
    <LayoutSupport>
      <Row className={styles.main_container}>
        <Col className={styles.contents_container}>
          <Row className={styles.content_main_title_box} align={"bottom"}>
            <Col className={styles.content_main_title}>Faq</Col>
          </Row>
          <Row className={styles.subtitle_wrapper} justify={"space-between"} align={"middle"}>
            <Space size={0} className={styles.contact_wrapper}>
              <Col className={styles.contact_box}>
                <Col className={styles.contact_icon}>
                  <PhoneOutlined />
                </Col>
                <Col className={styles.contact_item}>1544-8260</Col>
              </Col>
              <Col className={styles.contact_box}>
                <Col className={styles.contact_icon}>
                  <MailOutlined />
                </Col>
                <Col className={styles.contact_item}>connect@luxrobo.com</Col>
              </Col>
            </Space>
            <BasicInput
              style={{ width: 600 }}
              onChange={searchInput.onChange}
              value={searchInput.value}
              onKeyDown={event => {
                if (event.key === "Enter") {
                  setSearchFaqListState(() => faqListState?.filter(faq => faq.title.includes(searchInput.value)))
                }
              }}
              theme={{
                colorPrimary: "#45d6df",
                borderRadius: 20,
                colorBorder: "#1b3852",
              }}
            />
          </Row>
          <Space direction="vertical" className={styles.notice_list_wrapper}>
            <Row className={styles.notice_list_nav}>
              <Col className={styles.notice_list_nav_item}>No.</Col>
              <Col className={styles.notice_list_nav_item}>Title</Col>
              <Col className={styles.notice_list_nav_item}>Writer</Col>
              <Col className={styles.notice_list_nav_item}>Date</Col>
            </Row>
            {searchFaqListState
              ?.map(item => {
                const faq = plainToInstance(FaqDto, item)
                return (
                  <Row key={faq.faqID} className={styles.notice_list}>
                    <Col className={styles.notice_list_item}>{faq.faqID}</Col>
                    <Col className={styles.notice_list_item_title_wrapper}>
                      <Space size={0}>
                        {faq.isNew() ? <Col className={styles.newIcon}>N</Col> : <Col className={styles.blank_icon} />}
                        <Col className={styles.notice_title}>{faq.title}</Col>
                      </Space>
                    </Col>
                    <Col className={styles.notice_list_item_author}>{faq.writer}</Col>
                    <Col className={styles.notice_list_item_date}>{faq.created_at}</Col>
                  </Row>
                )
              })
              .reverse()}
          </Space>
        </Col>
      </Row>
    </LayoutSupport>
  )
}
export default AuthHoc(FaqPage)
