import { Col, Row, SelectProps, Space } from "antd"
import styles from "./member.module.scss"

import { BasicInput } from "components/Input"
import { BasicDropdown } from "components/Dropdown"
import { BasicCheckBox } from "components/CheckBox"
import { LayoutWorkspace } from "Layout"
import { TeamDto, TeamMemberDto } from "apis/dto"
import { BasicButton } from "components/Button"
import { useAsyncEffect, useInputs, useRedux, useToggle } from "hooks"
import { setModal } from "redux/reducers/config"
// import { GetServerSideProps } from "next"
import { apiManager } from "apis"
import { useState } from "react"
import { Auth, teamAuth } from "@const/team.const"
import { apiUtil } from "apis/api.util"
import { InviteMemberModal } from "components/Modal/modal.invite.member"
import { useRouter } from "next/router"
import AuthHoc from "hoc/AuthHoc"

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const apiCaller = apiManager.updateContext(ctx)
//   const teamList = await apiCaller.userApi.getTeamList()
//   if (apiUtil.isErrorResponse(teamList)) {
//     return {
//       props: { teamList: [], myTeam: [], members: [], errorMsg: teamList.message },
//     }
//   }
//   const myTeam = teamList.find(team => team.teamID === Number(ctx.query.team)) ?? null
//   let members: TeamMemberDto[] = []
//   if (myTeam) {
//     const response = await apiCaller.teamApi.getMemberList(myTeam.teamID)
//     if (apiUtil.isErrorResponse(response)) {
//       return {
//         props: { teamList: [], myTeam: [], members: [], errorMsg: response.message },
//       }
//     }
//     members = response
//   }
//   return {
//     props: { teamList, myTeam, members, errorMsg: "" },
//   }
// }

//dropdown options
const roleOptions: SelectProps["options"] = [
  { value: 1, label: "Administrator" },
  { value: 2, label: "Team Member" },
]

const MemberPage = () =>
  //   {
  //   teamList,
  // myTeam,
  // members,
  // }
  // : {
  //   teamList: TeamDto[]
  //   myTeam: TeamDto
  //   members: TeamMemberDto[]
  // }
  {
    const router = useRouter()
    const modalDispatch = useRedux(setModal)
    const [selectMembers, setSelectMembers] = useState<number[]>([])
    const [memberState, setMemberState] = useState<TeamMemberDto[]>([])
    const [searchMemberState, setSearchMemberState] = useState<TeamMemberDto[]>([])
    const [myTeam, setMyTeam] = useState<TeamDto | null>(null)
    const [teamList, setTeamList] = useState<TeamDto[]>([])
    const [sortKey, setSortKey] = useState<"no" | "user" | "email" | "role">("no")
    const [isSort, setIsSort] = useState<boolean>(false)
    const [toggle, setToggle] = useToggle()

    const sortedMembers = (array: TeamMemberDto[], key: string) => {
      const newArray = array.sort((a, b) => {
        switch (key) {
          case "user":
            if (b.nickname < a.nickname) return 1
            if (b.nickname > a.nickname) return -1
            return 0
          case "role": {
            return a.role - b.role
          }
          case "email":
            if (b.user_email < a.user_email) return 1
            if (b.user_email > a.user_email) return -1
            return 0
          default:
            return -1
        }
      })
      return isSort ? newArray : newArray.reverse()
    }
    const teamId = router.query.team
    useAsyncEffect(async () => {
      const teamListRes = await apiManager.userApi.getTeamList()
      const memberListRes = await apiManager.teamApi.getMemberList(Number(teamId))
      if (apiUtil.isErrorResponse(teamListRes) || apiUtil.isErrorResponse(memberListRes)) {
        return
      } else {
        setTeamList(teamListRes)
        const myTeam = teamListRes.find(team => team.teamID === Number(teamId)) ?? null
        setMyTeam(myTeam)
        setMemberState(memberListRes)
        setSearchMemberState(memberListRes)
      }
    }, [teamId, toggle])

    const onSelectMember = (userId: number) => {
      const members1 = [...selectMembers]
      const isSelect = members1.includes(userId)

      if (!isSelect) {
        members1.push(userId)
        setSelectMembers(members1)
        return
      } else {
        const newMembers = members1.filter(id => id !== userId)
        setSelectMembers(newMembers)
        return
      }
    }
    const searchInput = useInputs({ value: "" })

    return (
      <LayoutWorkspace teamList={teamList}>
        <Row className={styles.main_container}>
          <Col className={styles.contents_container}>
            <Row className={styles.content_main_title} align={"bottom"}>
              <Col>{myTeam?.team_name}</Col>
              <Col>/ Members</Col>
            </Row>
            <Row className={styles.setting_detail_title} align={"middle"}>
              <Col>Members </Col>
            </Row>
            <Row className={styles.member_control_button_group} justify={"space-between"}>
              <Col>
                <BasicButton
                  disabled={myTeam?.role !== teamAuth.Administrator}
                  onClick={() => {
                    modalDispatch({
                      open: true,
                      children: <InviteMemberModal teamId={Number(teamId)} />,
                    })
                  }}
                >
                  Invite Member
                </BasicButton>
                <BasicButton
                  disabled={myTeam?.role !== teamAuth.Administrator}
                  onClick={async () => {
                    console.log("try to batch remove ")

                    const response = await apiManager.teamApi.removeTeamMember({
                      teamId: Number(teamId),
                      members: { deleteID: selectMembers },
                    })
                    if (apiUtil.isErrorResponse(response)) {
                      alert(response.message)
                      return
                    }
                    setSelectMembers([])
                    setToggle()
                  }}
                >
                  Batch Remove
                </BasicButton>
              </Col>
              <Col>
                <BasicInput
                  style={{ width: 600 }}
                  value={searchInput.value}
                  onChange={searchInput.onChange}
                  onKeyDown={event => {
                    if (event.key === "Enter") {
                      setSearchMemberState(() =>
                        memberState.filter(member => member.nickname.includes(searchInput.value)),
                      )
                    }
                  }}
                  theme={{
                    colorPrimary: "#45d6df",
                    borderRadius: 20,
                    colorBorder: "#1b3852",
                  }}
                />
              </Col>
            </Row>
            <Row className={styles.member_list_nav}>
              <Col className={styles.member_list_nav_item}>No.</Col>
              <Col className={styles.member_list_nav_item}>
                User
                <span
                  className={styles.row_sort}
                  onClick={() => {
                    setSortKey("user")
                    setIsSort(state => !state)
                  }}
                >
                  ↑↓
                </span>
              </Col>
              <Col className={styles.member_list_nav_item}>
                Email
                <span
                  className={styles.row_sort}
                  onClick={() => {
                    setSortKey("email")
                    setIsSort(state => !state)
                  }}
                >
                  ↑↓
                </span>
              </Col>
              <Col className={styles.member_list_nav_item}>
                Role
                <span
                  className={styles.row_sort}
                  onClick={() => {
                    setSortKey("role")
                    setIsSort(state => !state)
                  }}
                >
                  ↑↓
                </span>
              </Col>
            </Row>
            <Space direction="vertical" size={12} className={styles.member_list_wrapper}>
              {sortedMembers(searchMemberState, sortKey).map((member, index) => {
                return (
                  <Row key={index} className={styles.member_list} justify={"center"} align={"middle"}>
                    <Col className={styles.member_list_item}>
                      <BasicCheckBox
                        disabled={myTeam?.role !== teamAuth.Administrator}
                        style={{
                          border: "none",
                        }}
                        checked={selectMembers.includes(member.userID)}
                        onClick={() => onSelectMember(member.userID)}
                      />
                      {index + 1}
                    </Col>
                    <Col className={styles.member_list_item}>{member.nickname}</Col>
                    <Col className={styles.member_list_item}>{member.user_email}</Col>
                    <Col className={styles.member_list_item}>
                      <BasicDropdown
                        style={{
                          width: 150,
                        }}
                        value={Auth[member.role - 1]}
                        options={roleOptions}
                        disabled={myTeam?.role !== teamAuth.Administrator}
                        onChange={async (e: number) => {
                          const response = await apiManager.teamApi.editMemberAuth({
                            teamId: Number(teamId),
                            auth: {
                              userId: member.userID,
                              role: Auth.indexOf(teamAuth[e]) + 1,
                            },
                          })
                          setToggle()
                          if (apiUtil.isErrorResponse(response)) {
                            alert(response.message)
                          }
                        }}
                      />
                    </Col>
                  </Row>
                )
              })}
            </Space>
          </Col>
        </Row>
      </LayoutWorkspace>
    )
  }

export default AuthHoc(MemberPage)
