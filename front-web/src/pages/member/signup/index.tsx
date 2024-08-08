import type { NextPage } from "next"
import styles from "./signup.module.scss"
import router from "next/router"
import { Space, Row, Col } from "antd"
import { BasicButton } from "components/Button"
import { BasicCheckBox } from "components/CheckBox"
import { BasicInput } from "components/Input"
import { useInputs, useToggle } from "hooks"
import { apiUtil } from "apis/api.util"
import { apiManager } from "apis"
import { createFormData } from "utils"
import { useState } from "react"

const SignUp: NextPage = () => {
  const idInput = useInputs({ value: "" })
  const nameInput = useInputs({ value: "" })
  const pwdInput = useInputs({ value: "" })
  const cofirmPasswordInput = useInputs({ value: "" })
  const mailInput = useInputs({ value: "" })
  const phoneCountryInput = useInputs({ value: "" })
  const phoneInput = useInputs({ value: "" })
  const [smsAgree, smsAgreeToggle] = useToggle()
  const [showError, serShowError] = useState(false)
  const [confirmError, setConfirmError] = useState("")
  const [errorMsg, setErrorMsg] = useState<{ [key: string]: string }[] | string>()
  console.log(confirmError)
  const onCreate = async () => {
    if (pwdInput.value !== cofirmPasswordInput.value) {
      setConfirmError("Does not match the password.")
      serShowError(true)
      return
    } else if (cofirmPasswordInput.value === "") {
      setConfirmError("Enter your Confirm Password")
      serShowError(true)
      return
    } else {
      setConfirmError("")
      serShowError(true)
    }

    const isSuccess = await apiManager.userApi.signUp(
      createFormData({
        accountid: idInput.value,
        countrycode: phoneCountryInput.value,
        email: mailInput.value,
        name: nameInput.value,
        optin: smsAgree,
        password: pwdInput.value,
        phonenumber: phoneInput.value,
      }),
    )
    if (apiUtil.isErrorResponse(isSuccess)) {
      console.log(3535, isSuccess.message)
      // alert(isSuccess.message)
      setErrorMsg(isSuccess.message)
      serShowError(true)
      return
    }

    void router.push("/member/signin")
  }
  const getErrorText = (keyword: string) => {
    if (errorMsg !== undefined) {
      for (let index = 0; index < errorMsg.length; index++) {
        const keys = Object.keys(errorMsg[index] as { [key: string]: string })
        if (keys.includes(keyword)) {
          return errorMsg[index] as { [key: string]: string }
        }
      }
    }
  }
  return (
    <div>
      <main className={styles.container}>
        <div className={styles.title_container}>
          <div className={styles.main_title}>New Account</div>
        </div>
        <div className={styles.signup_container}>
          <Space direction="vertical" className={styles.login_box} size={12}>
            <Row justify="space-between" align="middle" className={styles.input_item}>
              <Row className={styles.input_title}>ID</Row>
              <BasicInput
                className={styles.signup_input}
                placeholder="ID"
                suffix={null}
                theme={{
                  colorPrimary: "#45d6df",
                  colorBorder: "#1b3852",
                }}
                value={idInput.value}
                onChange={idInput.onChange}
              />
              <Row className={styles.input_caution_text}>
                {/* This ID is already in use. */}
                {/* Enter your ID */}
                {showError ? getErrorText("id")?.id : null}
              </Row>
            </Row>
            <Row justify="space-between" align="middle" className={styles.input_item}>
              <Row className={styles.input_title}>Username</Row>
              <BasicInput
                className={styles.signup_input}
                placeholder="Username"
                suffix={null}
                theme={{
                  colorPrimary: "#45d6df",
                  colorBorder: "#1b3852",
                }}
                value={nameInput.value}
                onChange={nameInput.onChange}
              />
              <Row className={styles.input_caution_text}>
                {/* Enter your Username */}
                {showError ? getErrorText("username")?.username : null}
              </Row>
            </Row>
            <Row justify="space-between" align="middle" className={styles.input_item}>
              <Row className={styles.input_title}>Password</Row>
              <BasicInput
                className={styles.signup_input}
                placeholder="Password"
                type="password"
                suffix={null}
                theme={{
                  colorPrimary: "#45d6df",
                  colorBorder: "#1b3852",
                }}
                value={pwdInput.value}
                onChange={pwdInput.onChange}
              />
              <Row className={styles.input_caution_text}>
                {/* Password is too short. */}
                {/* Enter your Password */}
                {/* You can only use between 4~12 letters, number, and special characters. */}
                {showError ? getErrorText("password")?.password : null}
              </Row>
            </Row>
            <Row justify="space-between" align="middle" className={styles.input_item}>
              <Row className={styles.input_title}>Confirm Password</Row>
              <BasicInput
                className={styles.signup_input}
                placeholder="Confirm Password"
                type="password"
                suffix={null}
                theme={{
                  colorPrimary: "#45d6df",
                  colorBorder: "#1b3852",
                }}
                value={cofirmPasswordInput.value}
                onChange={cofirmPasswordInput.onChange}
              />
              <Row className={styles.input_caution_text}>
                {/* Password is too short. */}
                {/* Enter your Password */}
                {showError ? confirmError : null}
              </Row>
            </Row>
            <Row justify="space-between" align="middle" className={styles.input_item}>
              <Row className={styles.input_title}>E-Mail</Row>
              <BasicInput
                className={styles.signup_input}
                placeholder="E-Mail"
                suffix={null}
                theme={{
                  colorPrimary: "#45d6df",
                  colorBorder: "#1b3852",
                }}
                value={mailInput.value}
                onChange={mailInput.onChange}
              />
              <Row className={styles.input_caution_text}>
                {/* This E-Mail is already in use. */}
                {/* Enter your E-Mail */}
                {/* Wrong or Invalid email address, Please correct and try again. */}
                {showError ? getErrorText("email")?.email : null}
              </Row>
            </Row>
            <Row justify="space-between" align="middle" className={styles.input_item}>
              <Row className={styles.input_title}>Phone</Row>
            </Row>
            <Row justify="space-between">
              <BasicInput
                className={styles.signup_input_nation_code}
                placeholder="+82"
                suffix={null}
                theme={{
                  colorPrimary: "#45d6df",
                  colorBorder: "#1b3852",
                }}
                value={phoneCountryInput.value}
                onChange={phoneCountryInput.onChange}
              />
              <BasicInput
                className={styles.signup_input_phone}
                placeholder="000-0000-0000"
                suffix={null}
                theme={{
                  colorPrimary: "#45d6df",
                  colorBorder: "#1b3852",
                }}
                value={phoneInput.value}
                onChange={phoneInput.onChange}
              />
            </Row>
            <Row className={styles.input_caution_text}>
              {/* Enter your phone number */}
              {/* Wrong or Invalid phone number, Please correct and try again. */}
              {showError ? getErrorText("phone")?.phone : null}
            </Row>
            <Row className={styles.agree_recieve_info} align={"middle"}>
              <BasicCheckBox
                className={styles.agree_recieve_info_check}
                theme={{
                  controlInteractiveSize: 24,
                }}
                checked={smsAgree}
                onChange={smsAgreeToggle}
              />
              <Col className={styles.notice_info_text}>
                (Optional) I agree to receive email and SMS marke-ting information.
              </Col>
            </Row>
            <Row>
              <BasicButton className={styles.signup_btn} onClick={onCreate}>
                Create Account
              </BasicButton>
            </Row>
            <Row justify="space-between" align="middle" className={styles.notice_info}>
              <Col className={styles.notice_info_text}>
                By creating an account, you agree to Luxrobo’s Terms of Service and Privacy Policy.
              </Col>
            </Row>
          </Space>
        </div>
      </main>
    </div>
  )
}

export default SignUp
