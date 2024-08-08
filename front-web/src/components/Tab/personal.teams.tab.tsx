import { Col, Row } from "antd"
import styles from "./tab.module.scss"
import { BasicButton } from "components/Button"
import router from "next/router"
import { IPersonalTeamsTab } from "type"
import { Auth } from "@const/index"
import { apiManager, apiUtil } from "apis"

export const PersonalTeamsTab = ({ teamList, setTeamList }: IPersonalTeamsTab) => {
  const onLeave = (teamId: number) => async () => {
    const data = await apiManager.teamApi.leave(teamId)

    console.log(data)

    if (apiUtil.isErrorResponse(data)) {
      alert(data.message)
      return
    }
    const tealList = await apiManager.userApi.getTeamList()

    if (apiUtil.isErrorResponse(tealList)) {
      alert(tealList.message)
      return
    }
    setTeamList(tealList)
    void router.push("/workspace/personal/setting")
  }

  return (
    <Col>
      <Row className={styles.setting_title}>Teams</Row>
      <Row className={styles.teams_table_nav}>
        <Col className={styles.teams_table_nav_item}>No</Col>
        <Col className={styles.teams_table_nav_item}>Name</Col>
        <Col className={styles.teams_table_nav_item}>Role</Col>
        <Col className={styles.teams_table_nav_item}>Actions</Col>
      </Row>
      {teamList.map((item, index) => {
        return (
          <Row key={item.teamID} className={styles.teams_table_list}>
            <Col className={styles.teams_table_list_item}>{index + 1}</Col>
            <Col className={styles.teams_table_list_item}>{item.team_name}</Col>
            <Col className={styles.teams_table_list_item}>{Auth[Number(item.role)]}</Col>
            <Col className={styles.teams_table_button_wrapper}>
              {item.role ? (
                <Col />
              ) : (
                <BasicButton onClick={() => void router.push(`/workspace/${item.teamID}/setting`)}>Setting</BasicButton>
              )}
              <BasicButton onClick={onLeave(item.teamID)}>Leave</BasicButton>
            </Col>
          </Row>
        )
      })}
    </Col>
  )
}
