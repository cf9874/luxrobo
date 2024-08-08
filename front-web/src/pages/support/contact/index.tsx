import { Col, Row, SelectProps, Space } from "antd"
import styles from "./contact.module.scss"
import { BasicDropdown } from "components/Dropdown"
import { useState } from "react"
import { LayoutSupport } from "Layout"
import { BasicButton } from "components/Button"
import { contactMenuJson } from "json"
import { CONTACT_TYPE } from "@const/support.const"
import { apiManager, apiUtil } from "apis"
import { useInputs, useToast } from "hooks"
import AuthHoc from "hoc/AuthHoc"
// import { useRedux } from "hooks"
// import { setModal } from "redux/reducers/config"

const ContactPage = () => {
  // const modalDispatch = useRedux(setModal)
  const [canClick, setCanClick] = useState(true)
  const [selectCategory, setSelectCategory] = useState(0)
  const dropdownOptions: SelectProps["options"] = contactMenuJson.map(v => ({
    value: CONTACT_TYPE[v.key as keyof typeof CONTACT_TYPE],
    label: (
      <Space>
        <span className={styles.dropdown_value}>{v.title}</span>
      </Space>
    ),
  }))
  const contactToast = useToast()
  const handleChange = (value: number) => {
    console.log(value)
    setSelectCategory(value)
  }
  const titleInput = useInputs({ value: "" })
  const writerInput = useInputs({ value: "" })
  const phoneInput = useInputs({ value: "" })
  const contentInput = useInputs({ value: "" })
  return (
    <LayoutSupport>
      <>{contactToast.contextHolder}</>
      <Row className={styles.main_container}>
        <Col className={styles.contents_container}>
          <Row className={styles.content_main_title_box} align={"bottom"}>
            <Col className={styles.content_main_title}>Contact</Col>
          </Row>
          <Row className={styles.contact_wrapper}>
            <Space direction="vertical" className={styles.contact_box} size={0}>
              <Col className={styles.contact_title}>문의 제목</Col>
              <input
                className={styles.contact_input}
                placeholder="제목"
                value={titleInput.value}
                onChange={titleInput.onChange}
              />
            </Space>
            <Space direction="vertical" className={styles.contact_box} size={0}>
              <Col className={styles.contact_title}>작성자</Col>
              <input
                className={styles.contact_input}
                placeholder="ex) 홍길동"
                value={writerInput.value}
                onChange={writerInput.onChange}
              />
            </Space>
            <Space direction="vertical" className={styles.contact_box} size={0}>
              <Col className={styles.contact_title}>연락처</Col>
              <input
                className={styles.contact_input}
                placeholder="'-'없이 입력해주세요"
                value={phoneInput.value}
                onChange={phoneInput.onChange}
              />
            </Space>
            <Space direction="vertical" className={styles.contact_box} size={0}>
              <Col className={styles.contact_title}>분류</Col>
              <BasicDropdown
                onChange={handleChange}
                defaultValue={{
                  value: "선택해주세요",
                  label: (
                    <Space>
                      <span className={styles.dropdown_default}>선택해주세요</span>
                    </Space>
                  ),
                }}
                value={selectCategory}
                options={dropdownOptions}
                className={styles.contact_dropdown}
                theme={{
                  colorBorder: "#1b3852",
                  borderRadius: 5,
                  colorPrimary: "#45d6df",
                  colorText: "#1b3852",
                }}
                dropdownStyle={{
                  color: "red",
                  fontSize: 50,
                }}
                size="large"
              />
            </Space>

            <Space direction="vertical" className={styles.contact_box} size={0}>
              <Col className={styles.contact_title}>문의 내용</Col>
              <textarea
                className={styles.contac_input_content}
                placeholder="내용을 자세히 입력해주세요"
                value={contentInput.value}
                onChange={contentInput.onChange}
              />
            </Space>
            <BasicButton
              className={styles.contact_button}
              onClick={async () => {
                if (canClick) {
                  if (selectCategory === 0) {
                    setCanClick(false)
                    contactToast.onMessage({
                      type: "error",
                      content: "카테고리를 다시 선택해주세요.",
                    })
                    setCanClick(true)
                    return
                  }
                  const response = await apiManager.contactApi.create({
                    title: titleInput.value,
                    writer: writerInput.value,
                    phone_number: phoneInput.value,
                    tag: selectCategory,
                    content: contentInput.value,
                  })

                  if (apiUtil.isErrorResponse(response)) {
                    alert(response.message)
                    return
                  }
                  setCanClick(false)
                  contactToast.onMessage({
                    type: "success",
                    content: "문의가 등록되었습니다.",
                  })
                  setCanClick(true)
                  titleInput.onClear()
                  writerInput.onClear()
                  phoneInput.onClear()
                  contentInput.onClear()
                  setSelectCategory(1)
                  // modalDispatch({ open: false })
                }
              }}
            >
              Contact
            </BasicButton>
          </Row>
        </Col>
      </Row>
    </LayoutSupport>
  )
}
export default AuthHoc(ContactPage)
