import { Col, ConfigProvider, Row, Tabs } from "antd"
import styles from "./setting.module.scss"
import { LayoutWorkspace } from "Layout"
import { TeamDto, TeamProfileDto } from "apis/dto"
// import { GetServerSideProps } from "next"
import { apiManager, apiUtil } from "apis"
import { PersonalAddressTab, PersonalBillingTab, TeamProfileTab } from "components/Tab"
import { AddressDto } from "apis/dto/common.dto"
import { useRouter } from "next/router"
import { useAsyncEffect } from "hooks"
import { useState } from "react"
import AuthHoc from "hoc/AuthHoc"

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const apiCaller = apiManager.updateContext(ctx)

//   const teamListRes = await apiCaller.userApi.getTeamList()
//   const addressRes = await apiCaller.teamApi.getTeamAddress(Number(ctx.query.team))
//   const teamProfileRes = await apiManager.teamApi.getTeamProfile(Number(ctx.query.team))

//   if (apiUtil.isErrorResponse(teamListRes)) {
//     return {
//       props: { teamList: [], addressList: [], teamProfile: null, errorMsg: teamListRes.message },
//     }
//   }

//   if (apiUtil.isErrorResponse(addressRes)) {
//     return {
//       props: { teamList: [], addressList: [], teamProfile: null, errorMsg: addressRes.message },
//     }
//   }

//   if (apiUtil.isErrorResponse(teamProfileRes)) {
//     return {
//       props: { teamList: [], addressList: [], teamProfile: null, errorMsg: teamProfileRes.message },
//     }
//   }

//   const myTeam = teamListRes.find(team => team.teamID === Number(ctx.query.team)) ?? null

//   return {
//     props: { teamList: teamListRes, teamProfile: teamProfileRes, addressList: addressRes, myTeam, errorMsg: "" },
//   }
// }

const SettingPage = () =>
  //   {
  //   teamList,
  //   addressList,
  //   myTeam,
  //   teamProfile,
  // }: {
  //   teamList: TeamDto[]
  //   addressList: AddressDto[]
  //   myTeam: TeamDto | null
  //   teamProfile: TeamProfileDto | null
  // }
  {
    const { query } = useRouter()
    const [teamList, setTeamList] = useState<TeamDto[]>([])
    const [addressList, setAddressList] = useState<AddressDto[]>([])
    const [teamProfile, setTeamProfile] = useState<TeamProfileDto | null>(null)
    const [myTeam, setMyTeam] = useState<TeamDto | null>(null)
    useAsyncEffect(async () => {
      const teamListRes = await apiManager.userApi.getTeamList()
      const addressRes = await apiManager.teamApi.getTeamAddress(Number(query.team))
      const teamProfileRes = await apiManager.teamApi.getTeamProfile(Number(query.team))

      console.error(teamProfileRes)

      if (apiUtil.isErrorResponse(teamListRes)) {
        alert(teamListRes.message)
        return
      } else {
        setTeamList(teamListRes)
        const myTeam = teamListRes.find(team => team.teamID === Number(query.team)) ?? null
        setMyTeam(myTeam)
      }
      if (apiUtil.isErrorResponse(addressRes)) {
        alert(addressRes.message)
        return
      } else {
        setAddressList(addressRes)
      }
      if (apiUtil.isErrorResponse(teamProfileRes)) {
        alert(teamProfileRes.message)
        return
      } else {
        setTeamProfile(teamProfileRes)
      }
    }, [query.id])
    const tabItems = [
      {
        key: "1",
        label: "Profile",
        children: <TeamProfileTab teamProfile={teamProfile} myTeam={myTeam} key={Number(query.team)} />,
      },
      {
        key: "2",
        label: "Address",
        children: (
          <PersonalAddressTab
            addressList={addressList}
            createApi={(dto: FormData) =>
              apiManager.teamApi.createTeamAddress({ teamId: myTeam?.teamID ?? 0, address: dto })
            }
            editApi={(dto: FormData) =>
              apiManager.teamApi.editTeamAddress({ teamId: myTeam?.teamID ?? 0, address: dto })
            }
            removeApi={(id: number) =>
              apiManager.teamApi.removeTeamAddress({ addressID: id, teamID: myTeam?.teamID ?? 0 })
            }
            key={Number(query.team)}
          />
        ),
      },
      {
        key: "3",
        label: "Billing",
        children: <PersonalBillingTab key={Number(query.team)} />,
      },
    ]
    return (
      <LayoutWorkspace teamList={teamList} key={teamList.length}>
        <Row className={styles.main_container}>
          <Col className={styles.contents_container}>
            <Row className={styles.content_main_title} align={"bottom"}>
              <Col>{myTeam?.team_name}</Col>
              <Col>/ Setting</Col>
            </Row>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#1b3852",
                },
              }}
            >
              <Tabs
                defaultActiveKey="1"
                items={tabItems}
                className={styles.setting_tabs}
                size="large"
                tabBarStyle={{
                  paddingLeft: 20,
                  borderBottom: "1px solid #1b3852",
                }}
              />
            </ConfigProvider>
          </Col>
        </Row>
      </LayoutWorkspace>
    )
  }

export default AuthHoc(SettingPage)
