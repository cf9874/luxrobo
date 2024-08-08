import { DownOutlined, RightOutlined } from "@ant-design/icons"
import { Col, Row } from "antd"
import { useState } from "react"
import styles from "./dropmenu.module.scss"
import { useRouter } from "next/router"

interface IDropmenuProps {
  title: string
  teamList?: string[]
  id?: number
}

export const Dropmenu = ({ title, teamList, id }: IDropmenuProps) => {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(true)

  const teamName = router.query.team ?? "personal"
  const subMenu = router.asPath.split("/").at(-1)

  return (
    <>
      <Row
        className={title.toLocaleLowerCase() === subMenu ? styles.side_main_menu_active : styles.side_main_menu}
        onClick={() => {
          if (id === undefined) {
            void router.push(`/workspace/${title.toLocaleLowerCase()}`)
          } else {
            void router.push(`/workspace/team?team=${`${id}`.toLocaleLowerCase()}`)
          }
        }}
      >
        <Col
          className={styles.side_main_menu_collapse}
          onClick={() => {
            setMenuOpen(state => !state)
          }}
        >
          {menuOpen ? <DownOutlined /> : <RightOutlined />}
        </Col>
        <Col>{title}</Col>
      </Row>
      <div
        style={{
          width: "100%",
        }}
      >
        {menuOpen ? (
          teamList?.map(item => {
            const menu = item.replace(" ", "").toLowerCase()
            return (
              <Row
                key={item}
                onClick={() => {
                  if (id === undefined) {
                    void router.push(`/workspace/${title.toLocaleLowerCase()}`)
                  } else {
                    void router.push(`/workspace/team/${menu}?team=${`${id}`.toLocaleLowerCase()}`)
                  }
                }}
                className={
                  title.toLocaleLowerCase() === teamName && subMenu === menu
                    ? styles.side_sub_menu_active
                    : styles.side_sub_menu_inactive
                }
              >
                {item}
              </Row>
            )
          })
        ) : (
          <div className={styles.side_sub_menu_blank} />
        )}
      </div>
    </>
  )
}
