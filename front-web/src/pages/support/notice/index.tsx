import { LayoutSupport } from "Layout"
import { Col, Row, Space } from "antd"
import { BasicInput } from "components/Input"
import styles from "./notice.module.scss"
import { NoticeDto } from "apis/dto"
// import { GetServerSideProps } from "next"
import { apiManager, apiUtil } from "apis"
import { useAsyncEffect, useInputs } from "hooks"
import { useState } from "react"
import { plainToInstance } from "class-transformer"
import AuthHoc from "hoc/AuthHoc"

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const response = await apiManager.updateContext(ctx).noticeApi.getList()

//   if (apiUtil.isErrorResponse(response)) {
//     return {
//       props: { fqaList: [], errorMsg: response.message },
//     }
//   }
//   return {
//     props: { noticeList: response },
//   }
// }
const NoticePage = () => {
  const [noticeListState, setNoticeListState] = useState<NoticeDto[]>([])
  const [searchNoticeListState, setSearchNoticeListState] = useState<NoticeDto[]>([])
  useAsyncEffect(async () => {
    const response = await apiManager.noticeApi.getList()
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
    } else {
      setNoticeListState(response)
      setSearchNoticeListState(response)
    }
  }, [])
  const searchInput = useInputs({ value: "" })
  return (
    <LayoutSupport>
      <Row className={styles.main_container}>
        <Col className={styles.contents_container}>
          <Row className={styles.content_main_title_box} align={"bottom"}>
            <Col className={styles.content_main_title}>Notice</Col>
          </Row>
          <Row className={styles.subtitle_wrapper} justify={"end"} align={"middle"}>
            <BasicInput
              style={{ width: 600 }}
              onChange={searchInput.onChange}
              value={searchInput.value}
              onKeyDown={event => {
                if (event.key === "Enter") {
                  setSearchNoticeListState(() =>
                    noticeListState.filter(notice => notice.title.includes(searchInput.value)),
                  )
                }
              }}
              onClick={() => {
                setSearchNoticeListState(() =>
                  noticeListState.filter(notice => notice.title.includes(searchInput.value)),
                )
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
            {searchNoticeListState
              .map(item => {
                const notice = plainToInstance(NoticeDto, item)
                return (
                  <Row key={notice.noticeID} className={styles.notice_list}>
                    <Col className={styles.notice_list_item}>{notice.noticeID}</Col>
                    <Col className={styles.notice_list_item_title_wrapper}>
                      <Space size={0}>
                        {notice.isNew() ? (
                          <Col className={styles.newIcon}>N</Col>
                        ) : (
                          <Col className={styles.blank_icon} />
                        )}
                        <Col className={styles.notice_title}>{notice.title}</Col>
                      </Space>
                    </Col>
                    <Col className={styles.notice_list_item_author}>{notice.writer}</Col>
                    <Col className={styles.notice_list_item_date}>{notice.created_at}</Col>
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
export default AuthHoc(NoticePage)
