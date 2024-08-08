import { Col, Row, Space } from "antd"
import styles from "./Layout.module.scss"
import { LeftOutlined, PlusCircleOutlined, RightOutlined } from "@ant-design/icons"
import { Dropmenu } from "components/Extras"
import { ILayoutWorkspaceProps } from "type"
import { useState } from "react"
import { Header } from "./Header.own"
import { teamAuth } from "@const/team.const"
import { CreateTeamModal } from "components/Modal/modal.create.team"
import { apiManager, apiUtil } from "apis"
import { useAppSelector, useRedux, useToast } from "hooks"
import { setLoading, setModal, setPause } from "redux/reducers/config"
import router from "next/router"
import { shallowEqual } from "react-redux"
import { createFormData } from "utils"
export const LayoutWorkspace = ({ teamList, children }: ILayoutWorkspaceProps) => {
  const modalDispatch = useRedux(setModal)
  const loadingDispatch = useRedux(setLoading)
  const pauseDispatch = useRedux(setPause)
  const teamToast = useToast()
  const { profile } = useAppSelector(state => state.profileReducer, shallowEqual)
  const [sideOpen, setSideOpen] = useState(true)
  return (
    <Col className={styles.layout_mine_container}>
      <>{teamToast.contextHolder}</>
      <Header pageTitle="Workspace" />
      <Row className={sideOpen ? styles.main_container : styles.main_container_side_close}>
        {sideOpen ? (
          <Col className={styles.side_menu_container}>
            <Row className={styles.side_menu_title} justify={"space-between"} align={"middle"}>
              <Col>WORKSPACE</Col>
              <Col>
                <LeftOutlined onClick={() => setSideOpen(state => !state)} className={styles.side_menu_icon} />
              </Col>
            </Row>

            <Space direction="vertical" size={0} className={styles.side_menu_list}>
              <Row className={styles.side_menu_nav_title} justify={"space-between"} align={"middle"}>
                <Col>TEAMS</Col>
                <Col>
                  <PlusCircleOutlined
                    onClick={() => {
                      modalDispatch({
                        open: true,
                        children: (
                          <CreateTeamModal
                            onApply={async (title: string) => {
                              loadingDispatch(true)

                              const response = await apiManager.teamApi.createTeam(
                                createFormData({
                                  name: title,
                                  email: profile.email,
                                  phone_number: profile.phone_number,
                                  email_opt_in: profile.email_opt_in,
                                  phone_opt_in: profile.phone_opt_in,
                                }),
                              )

                              if (apiUtil.isErrorResponse(response)) {
                                loadingDispatch(false)
                                pauseDispatch(true)
                                teamToast.onMessage({
                                  type: "error",
                                  content: response.message ?? "",
                                })
                                pauseDispatch(false)
                                return
                              }
                              loadingDispatch(false)
                              void router.push(`/workspace/${response.data.teamID}`)
                              modalDispatch({ open: false })
                            }}
                          />
                        ),
                      })
                    }}
                  />
                </Col>
              </Row>
              <Dropmenu title="Personal" teamList={["Projects", "Custom Blocks", "Setting"]} />
              {teamList?.map(team => {
                return (
                  <Dropmenu
                    key={team.teamID}
                    title={team.team_name}
                    id={team.teamID}
                    //  teamList={team.menu ?? []}
                    teamList={
                      team.role === teamAuth.Administrator
                        ? ["Projects", "Custom Blocks", "Members", "Setting"]
                        : ["Projects", "Custom Blocks", "Members"]
                    }
                  />
                )
              })}
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
