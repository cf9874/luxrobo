import { Col, ConfigProvider, Radio, Row, Space } from "antd"
import styles from "./tab.module.scss"
import { CameraOutlined } from "@ant-design/icons"
import { BasicButton, EditBtn } from "components/Button"
import { ChangePasswordModal, DeleteAccountModal } from "components/Modal"
import { ChangeEvent, useState } from "react"
import { setModal } from "redux/reducers/config"
import { useAppSelector, useInputs, useRedux } from "hooks"
import { shallowEqual } from "react-redux"
import { apiManager, apiUtil } from "apis"
import { createFormData } from "utils"
import { updateProfile } from "redux/reducers/profile"
import Image from "next/image"
export const PersonalProfileTab = () => {
  const modalDispatch = useRedux(setModal)

  const { profile } = useAppSelector(state => state.profileReducer, shallowEqual)

  console.log(profile.profile_image)

  const [allowEmail, setAllowEmail] = useState(profile.email_opt_in ? 1 : 2)
  const [allowPhone, setAllowPhone] = useState(profile.phone_opt_in ? 1 : 2)

  const nickNameInput = useInputs({ value: profile.nickname })
  const emailInput = useInputs({ value: profile.email })
  const phoneInput = useInputs({ value: profile.phone_number })

  const updateProfileRdx = useRedux(updateProfile)

  const onNickEditBtn = async () => {
    const response = await apiManager.userApi.editProfileInfo(
      createFormData({
        nickname: nickNameInput.value,
      }),
    )

    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }

    updateProfileRdx({ nickname: nickNameInput.value })
  }
  const onEmailEditBtn = async () => {
    const response = await apiManager.userApi.editProfileInfo(
      createFormData({
        email: emailInput.value,
        email_opt_in: allowEmail === 1 ? true : false,
      }),
    )
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }

    updateProfileRdx({
      email: emailInput.value,
      email_opt_in: allowEmail === 1 ? true : false,
    })
  }
  const onPhoneEditBtn = async () => {
    const response = await apiManager.userApi.editProfileInfo(
      createFormData({
        phone: phoneInput.value,
        phone_opt_in: allowPhone === 1 ? true : false,
      }),
    )
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }

    updateProfileRdx({
      phone_number: phoneInput.value,
      phone_opt_in: allowPhone === 1 ? true : false,
    })
  }

  const changePwd = async (oldPwd: string, newPwd: string) => {
    const response = await apiManager.userApi.editPassword({ change_password: newPwd, original_password: oldPwd })

    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
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

        const response = await apiManager.userApi.editProfileInfo(
          createFormData({
            profile_image: file,
          }),
        )

        console.log(response)

        if (apiUtil.isErrorResponse(response)) {
          alert(response.message)
          return
        }

        const profileRes = await apiManager.userApi.getProfileInfo()

        if (apiUtil.isErrorResponse(profileRes)) {
          alert(profileRes.message)
          return
        }

        setSelectedImage(imageUrl)
        updateProfileRdx(profileRes)
      }
    }

    inputElement.click()
  }
  console.log(profile.profile_image)

  return (
    <Col>
      <Row className={styles.setting_title}>User Profile</Row>
      <Row className={styles.profile_img} justify={"center"} align={"middle"}>
        <Col className={styles.setting_profile_img} onClick={handleImageClick} style={{ cursor: "pointer" }}>
          {selectedImage || profile.profile_image ? (
            <div style={{ width: "153px", height: "153px", overflow: "hidden", borderRadius: "50%" }}>
              <Image
                unoptimized={true}
                src={selectedImage ? selectedImage : process.env.NEXT_PUBLIC_FGB_S3_URL + profile.profile_image}
                alt="Selected"
                width={153}
                height={153}
                layout="responsive"
                objectFit="cover"
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
            <Col className={styles.setting_profile_data_title}>ID</Col>
            <input className={styles.non_edit_input} disabled={true} value={profile.accountID} />
          </Row>
          <Row className={styles.setting_profile_data_row}>
            <Col className={styles.setting_profile_data_title}>Username</Col>
            <input className={styles.non_edit_input} disabled={true} value={profile.username} />
          </Row>
          <Row className={styles.setting_profile_data_row}>
            <Col className={styles.setting_profile_data_title}>Nickname</Col>
            <Row>
              <input className={styles.setting_profile} value={nickNameInput.value} onChange={nickNameInput.onChange} />
              <EditBtn onClick={onNickEditBtn} />
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
                <EditBtn onClick={onEmailEditBtn} />
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
                <input
                  className={styles.setting_profile}
                  type="tel"
                  value={phoneInput.value}
                  onChange={phoneInput.onChange}
                />
                <EditBtn onClick={onPhoneEditBtn} />
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
      <Row className={styles.setting_profile_password}>
        <Row className={styles.setting_profile_data_row} align={"middle"}>
          <Col className={styles.setting_profile_data_title}>Password</Col>
          <BasicButton
            className={styles.button_change_password}
            onClick={() =>
              modalDispatch({
                open: true,
                children: <ChangePasswordModal onApply={changePwd} />,
              })
            }
          >
            Change Password
          </BasicButton>
        </Row>
      </Row>
      <Row className={styles.setting_profile_delete_accout}>
        <Space direction="vertical" size={0}>
          <Col>
            <span className={styles.setting_profile_data_title}>Delete Account</span>
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
                children: <DeleteAccountModal />,
              })
            }
          >
            Delete Account
          </BasicButton>
        </Space>
      </Row>
    </Col>
  )
}
