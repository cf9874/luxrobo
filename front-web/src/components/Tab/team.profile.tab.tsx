import { Col, ConfigProvider, Radio, Row, Space } from "antd"
import styles from "./tab.module.scss"
import { CameraOutlined } from "@ant-design/icons"
import { BasicButton, EditBtn } from "components/Button"
import { ChangeEvent, useState } from "react"
import { setModal } from "redux/reducers/config"
import { useInputs, useRedux } from "hooks"
import { DeleteTeamModal } from "components/Modal"
import { TeamDto, TeamProfileDto } from "apis/dto"
import { apiManager, apiUtil } from "apis"
import { createFormData } from "utils"
import Image from "next/image"
import router from "next/router"

export const TeamProfileTab = ({
  teamProfile,
  myTeam,
}: {
  myTeam: TeamDto | null
  teamProfile: TeamProfileDto | null
}) => {
  const modalDispatch = useRedux(setModal)

  const [profile] = useState(teamProfile)

  const nameInput = useInputs({ value: myTeam?.team_name })
  const emailInput = useInputs({ value: profile?.email })
  const phoneInput = useInputs({ value: profile?.phone_number })
  const [allowEmail, setAllowEmail] = useState(profile?.email_opt_in ? 1 : 2)
  const [allowPhone, setAllowPhone] = useState(profile?.phone_opt_in ? 1 : 2)

  const onNameEdit = async () => {
    const response = await apiManager.teamApi.editTeamProfile({
      teamID: Number(myTeam?.teamID),
      profile: createFormData({
        teamname: nameInput.value,
      }),
    })
    console.log(response)
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }

    void router.push(`/workspace/${Number(myTeam?.teamID)}/setting`)
  }
  const onEmailEdit = async () => {
    const response = await apiManager.teamApi.editTeamProfile({
      teamID: Number(myTeam?.teamID),
      profile: createFormData({
        email: emailInput.value,
        email_opt_in: allowEmail === 1 ? true : false,
      }),
    })
    console.log(response)
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }
  }
  const onPhoneEdit = async () => {
    const response = await apiManager.teamApi.editTeamProfile({
      teamID: Number(myTeam?.teamID),
      profile: createFormData({
        phone: phoneInput.value,
        phone_opt_in: allowPhone === 1 ? true : false,
      }),
    })
    console.log(response)
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }
  }

  const [selectedImage, setSelectedImage] = useState<string>("")

  const handleImageClick = () => {
    const inputElement = document.createElement("input")
    inputElement.type = "file"
    inputElement.accept = "image/*"
    inputElement.onchange = async e => {
      const file = (e as unknown as ChangeEvent<HTMLInputElement>).target.files?.[0]
      if (file) {
        const imageUrl = URL.createObjectURL(file)

        const response = await apiManager.teamApi.editTeamProfile({
          teamID: Number(myTeam?.teamID),
          profile: createFormData({
            profile_image: file,
          }),
        })

        if (apiUtil.isErrorResponse(response)) {
          alert(response.message)
          return
        }

        setSelectedImage(imageUrl)
      }
    }

    inputElement.click()
  }

  return (
    <Col>
      <Row className={styles.setting_title}>User Profile</Row>
      <Row className={styles.profile_img} justify={"center"} align={"middle"}>
        <Col className={styles.setting_profile_img} onClick={handleImageClick}>
          {selectedImage || teamProfile?.team_img ? (
            <div style={{ width: "153px", height: "153px", overflow: "hidden", borderRadius: "50%" }}>
              <Image
                src={
                  selectedImage ? selectedImage : (process.env.NEXT_PUBLIC_FGB_S3_URL as string) + teamProfile?.team_img
                }
                alt="Selected"
                width={153}
                height={153}
                layout="responsive"
                objectFit="cover"
                unoptimized={true}
              />
            </div>
          ) : (
            <CameraOutlined className={styles.empty_img} />
          )}
        </Col>
      </Row>
      <Row className={styles.setting_profile_data_container}>
        <Space direction="vertical">
          <Row className={styles.setting_profile_data_row}>
            <Col className={styles.setting_profile_data_title}>Teamname</Col>
            <Row>
              <input className={styles.setting_profile} value={nameInput.value} onChange={nameInput.onChange} />
              <EditBtn onClick={onNameEdit} />
            </Row>
          </Row>
          <Row className={styles.setting_profile_data_row}>
            <Col className={styles.setting_profile_data_title}>E-Mail</Col>
            <Space direction="vertical">
              <Row>
                <input
                  className={styles.setting_profile}
                  type="email"
                  value={emailInput.value}
                  onChange={emailInput.onChange}
                />
                <EditBtn onClick={onEmailEdit} />
              </Row>

              <Row>
                <Radio.Group onChange={e => setAllowEmail(e.target.value as number)} value={allowEmail}>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#45d6df",
                      },
                    }}
                  >
                    <Radio value={1}>수신 허용</Radio>
                  </ConfigProvider>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#45d6df",
                      },
                    }}
                  >
                    <Radio value={2}>수신 거부</Radio>
                  </ConfigProvider>
                </Radio.Group>
              </Row>
            </Space>
          </Row>
          <Row className={styles.setting_profile_data_row}>
            <Col className={styles.setting_profile_data_title}>Phone</Col>
            <Space direction="vertical">
              <Row>
                <input className={styles.setting_profile} value={phoneInput.value} onChange={phoneInput.onChange} />
                <EditBtn onClick={onPhoneEdit} />
              </Row>

              <Row>
                <Radio.Group onChange={e => setAllowPhone(e.target.value as number)} value={allowPhone}>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#45d6df",
                      },
                    }}
                  >
                    <Radio value={1}>수신 허용</Radio>
                  </ConfigProvider>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#45d6df",
                      },
                    }}
                  >
                    <Radio value={2}>수신 거부</Radio>
                  </ConfigProvider>
                </Radio.Group>
              </Row>
            </Space>
          </Row>
        </Space>
      </Row>
      <Row className={styles.setting_profile_delete_accout}>
        <Space direction="vertical" size={0}>
          <Col>
            <span className={styles.setting_profile_data_title}>Delete Team</span>
          </Col>
          <Col className={styles.delete_info}>All projects that you created will be permanently erased.</Col>
          <Col className={styles.delete_info}>
            You may want to save backups of these projects or export them before deleting.
          </Col>
          <BasicButton
            className={styles.button_delete_account}
            onClick={() =>
              modalDispatch({
                open: true,
                children: (
                  <DeleteTeamModal
                    onApply={async (title: string) => {
                      const response = await apiManager.teamApi.removeTeam({ teamID: Number(myTeam?.teamID), title })
                      if (apiUtil.isErrorResponse(response)) {
                        alert(response.message)
                        return
                      }

                      modalDispatch({ open: false })
                      void router.push("/workspace/personal")
                    }}
                  />
                ),
              })
            }
          >
            Delete Team
          </BasicButton>
        </Space>
      </Row>
    </Col>
  )
}
