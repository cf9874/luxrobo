import { Col, Row, Space } from "antd"
import styles from "./Layout.module.scss"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { ILayoutSupportProps } from "type"
import { useRouter } from "next/router"
import { useState } from "react"
import { Header } from "./Header.own"

export const LayoutSupport = ({ children }: ILayoutSupportProps) => {
  const router = useRouter()
  const pathname = router.pathname.split("/").at(-1)

  const [sideOpen, setSideOpen] = useState(true)

  return (
    <Col className={styles.layout_mine_container}>
      <Header pageTitle="Support" />

      <Row className={sideOpen ? styles.main_container : styles.main_container_side_close}>
        {sideOpen ? (
          <Col className={styles.side_menu_container}>
            <Row className={styles.side_menu_title} justify={"space-between"} align={"middle"}>
              <Col>SUPPORT</Col>
              <Col>
                <LeftOutlined onClick={() => setSideOpen(state => !state)} className={styles.side_menu_icon} />
              </Col>
            </Row>
            <Space direction="vertical" size={0} className={styles.support_side_menu_list}>
              <Row
                onClick={() => {
                  void router.push(`/support/notice`)
                }}
                className={pathname === "notice" ? styles.side_sub_menu_active : styles.side_sub_menu_inactive}
              >
                Notice
              </Row>
              <Row
                onClick={() => {
                  void router.push(`/support/faq`)
                }}
                className={pathname === "faq" ? styles.side_sub_menu_active : styles.side_sub_menu_inactive}
              >
                Faq
              </Row>
              <Row
                onClick={() => {
                  void router.push(`/support/contact`)
                }}
                className={pathname === "contact" ? styles.side_sub_menu_active : styles.side_sub_menu_inactive}
              >
                Contact
              </Row>
            </Space>
          </Col>
        ) : (
          <Space className={styles.side_menu_container_side_close}>
            <RightOutlined onClick={() => setSideOpen(state => !state)} className={styles.side_menu_icon} />
          </Space>
        )}
        <Col>{children}</Col>
      </Row>
    </Col>
  )
}
