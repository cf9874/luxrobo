import { Col, ConfigProvider, Row, Tabs } from "antd"
import styles from "./setting.module.scss"
import { LayoutWorkspace } from "Layout"
import { TeamDto } from "apis/dto"
import { PersonalProfileTab, PersonalAddressTab, PersonalBillingTab, PersonalTeamsTab } from "components/Tab"
// import { GetServerSideProps } from "next"
import { apiManager, apiUtil } from "apis"
import { AddressDto } from "apis/dto/common.dto"
import { useAsyncEffect } from "hooks"
import { useState } from "react"
import AuthHoc from "hoc/AuthHoc"

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const apiCaller = apiManager.updateContext(ctx)

//   const teamListRes = await apiCaller.userApi.getTeamList()
//   const addressRes = await apiCaller.userApi.getAddress()

//   if (apiUtil.isErrorResponse(teamListRes)) {
//     return {
//       props: { teamList: [], addressList: [], errorMsg: teamListRes.message },
//     }
//   }

//   if (apiUtil.isErrorResponse(addressRes)) {
//     return {
//       props: { teamList: [], addressList: [], errorMsg: addressRes.message },
//     }
//   }

//   return {
//     props: { teamList: teamListRes, addressList: addressRes, errorMsg: "" },
//   }
// }

const SettingPage = () => {
  const [teamList, setTeamList] = useState<TeamDto[]>([])
  const [addressList, setAddressList] = useState<AddressDto[]>([])
  useAsyncEffect(async () => {
    const teamListRes = await apiManager.userApi.getTeamList()
    const addressListRes = await apiManager.userApi.getAddress()
    if (apiUtil.isErrorResponse(teamListRes)) {
      alert(teamListRes.message)
      return
    } else {
      setTeamList(teamListRes)
    }
    if (apiUtil.isErrorResponse(addressListRes)) {
      alert(addressListRes.message)
      return
    } else {
      setAddressList(addressListRes)
    }
  }, [])

  return (
    <LayoutWorkspace teamList={teamList}>
      <Row className={styles.main_container}>
        <Col className={styles.contents_container}>
          <Row className={styles.content_main_title} align={"bottom"}>
            <Col>Personal</Col>
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
              items={[
                {
                  key: "1",
                  label: "Profile",
                  children: <PersonalProfileTab />,
                },
                {
                  key: "2",
                  label: "Address",
                  children: (
                    <PersonalAddressTab
                      addressList={addressList}
                      createApi={(dto: FormData) => apiManager.userApi.createAddress(dto)}
                      editApi={(dto: FormData) => apiManager.userApi.editAddress(dto)}
                      removeApi={(id: number) => apiManager.userApi.removeAddress(id)}
                    />
                  ),
                },
                {
                  key: "3",
                  label: "Billing",
                  children: <PersonalBillingTab />,
                },
                {
                  key: "4",
                  label: "Teams",
                  children: <PersonalTeamsTab teamList={teamList} setTeamList={setTeamList} />,
                },
              ]}
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
