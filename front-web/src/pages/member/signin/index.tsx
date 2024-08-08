import type { NextPage } from "next"
import styles from "./sign.module.scss"
// import { useAsyncEffect, useInputs, useToggle } from "hooks"
// import { UserDtoRes } from "apis/dto/user.dto.res"
// import { plainToClass } from "class-transformer"
import router from "next/router"
import { Input, Space, Row, Col, Button, Checkbox } from "antd"
import { BasicButton } from "components/Button"
import { useInputs, useRedux, useToggle } from "hooks"
import { apiUtil } from "apis/api.util"
import { setCookie } from "nookies"
import { COOKIE_KEY } from "@const/cookie.const"
import { initProfile } from "redux/reducers/profile"
import { apiManager } from "apis"
import { useState } from "react"
import { API_ERROR_MSG } from "@const/api.error.const"
import Image from "next/image"
import { imgAsset } from "@assets/image"

const Sign: NextPage = () => {
  // useAsyncEffect(async () => {
  //   // const a = await apiInstance.get<UserDtoRes>("todos/1")
  //   apiConnector.setAuthorizationToken("new token")

  //   const user = plainToClass(UserDtoRes, data)
  //   // const b = await apiInstance.get("posts")

  //   console.log(user)
  // }, [])

  const initProfileDis = useRedux(initProfile)

  const idInput = useInputs({ value: "" })
  const pwdInput = useInputs({ value: "" })
  const emailInput = useInputs({ value: "", validCheck: () => console.log(123) })

  const [openCert, setOpenCert] = useState(false)

  const [rememberFlag, rememberToggle] = useToggle()

  const onLogin = async () => {
    if (idInput.value === "") {
      alert("아이디를 입력해주세요.")
      return
    } else if (pwdInput.value === "") {
      alert("비밀번호를 입력해주세요.")
      return
    }

    const data = await apiManager.userApi.signIn({
      accountid: idInput.value,
      password: pwdInput.value,
    })

    if (apiUtil.isErrorResponse(data)) {
      if (data.message === API_ERROR_MSG.NOT_CERTIFY_USER) {
        setOpenCert(true)
        return
      } else if (data.message === API_ERROR_MSG.NOT_MATCHED_PASSWORD) {
        alert("비밀번호를 확인해주세요.")
        return
      } else if (data.message === API_ERROR_MSG.NOT_FOUND_USER || data.message === API_ERROR_MSG.DELETED_USER) {
        alert("아이디를 확인해주세요.")
        return
      }
    }

    if (data && !apiUtil.isErrorResponse(data)) {
      const maxAge = rememberFlag ? 7 * 24 * 60 * 60 : 24 * 60 * 60

      const cookieOptions = {
        maxAge: maxAge,
        httpOnly: false,
        // secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict" as const,
      }

      setCookie(null, COOKIE_KEY.ACCESSTOKEN, data.access_token, cookieOptions)

      setCookie(null, COOKIE_KEY.REFRESHETOKEN, data.refresh_token, cookieOptions)

      const userInfo = await apiManager.userApi.getProfileInfo()

      if (!apiUtil.isErrorResponse(userInfo)) {
        initProfileDis(userInfo)
      }
      void router.push("/workspace/personal")
    }
  }

  const onCert = async ({ accountid, email }: { accountid: string; email: string }) => {
    const response = await apiManager.userApi.sendMail({ accountid, email })
    if (apiUtil.isErrorResponse(response)) {
      if (response.message === API_ERROR_MSG.BAD_PARAMETER || response.message === API_ERROR_MSG.INVALID_PARAMETER) {
        alert("정보를 다시입력해주세요.")
        return
      }
    }
    alert("이메일이 발송되었습니다.")
    setOpenCert(false)
  }
  return (
    <div>
      <main className={styles.container}>
        {openCert ? (
          <div className={styles.cert_wrapper}>
            <Row className={styles.cert_nav_box}>
              <Row>이메일 인증이 완료되지 않아 로그인이 불가합니다.</Row>
              <Row>로그인 하시려면 가입시에 사용한 이메일로 인증을 진행해주세요</Row>
              <Row>
                <Col className={styles.certify_label}> ID </Col>
                <Input
                  placeholder="ID"
                  value={idInput.value}
                  onChange={idInput.onChange}
                  className={styles.certify_input}
                />
              </Row>
              <Row>
                <Col className={styles.certify_label}> E-mail </Col>
                <Input
                  placeholder="E-Mail"
                  value={emailInput.value}
                  onChange={emailInput.onChange}
                  className={styles.certify_input}
                />
              </Row>
            </Row>
            <Row>
              <BasicButton
                className={styles.cert_btn}
                onClick={() => onCert({ accountid: idInput.value, email: emailInput.value })}
              >
                인증메일 요청하기
              </BasicButton>
              <BasicButton className={styles.cert_btn} onClick={() => setOpenCert(false)}>
                닫기
              </BasicButton>
            </Row>
          </div>
        ) : null}

        <div className={styles.title_container}>
          <div className={styles.sub_title} onClick={() => setOpenCert(state => !state)}>
            LUXROBO IoT Platform
          </div>
          <div className={styles.main_title}>
            <Image src={imgAsset.modiLogo} width={354} height={60} alt="logo" />
          </div>
          <div className={styles.description}>
            MODI EDA는 전문적인 지식 없이도 높은 수준의 PCB를 설계하여 <br />
            발주, 프로그래밍 할 수 있는 One-Stop 개발 도구입니다.
          </div>
        </div>
        <div className={styles.login_container}>
          <Space direction="vertical" align="center" className={styles.login_box}>
            <Row className={styles.title}>LOG IN</Row>
            <Row justify="space-between" align="middle" className={styles.input_item}>
              <Input placeholder="ID" value={idInput.value} onChange={idInput.onChange} />
            </Row>
            <Row justify="space-between" align="middle" className={styles.input_item}>
              <Input placeholder="PW" type="password" value={pwdInput.value} onChange={pwdInput.onChange} />
            </Row>
            <Row justify="space-between" align="middle" className={styles.find_info}>
              <Checkbox checked={rememberFlag} onChange={() => rememberToggle()}>
                Remember me
              </Checkbox>
              <Button type="link">Forgot your Password?</Button>
            </Row>
            <Row>
              <BasicButton className={styles.login_btn} onClick={onLogin}>
                Log in
              </BasicButton>
            </Row>
            <Row justify="space-between" align="middle" className={styles.find_info}>
              <Col>
                Don’t have an account?
                <span className={styles.link_to_new_account} onClick={() => void router.push("/member/signup")}>
                  Create a new account
                </span>
              </Col>
            </Row>
          </Space>
        </div>
        <Col className={styles.link_to_LUXWEB} onClick={() => window.open("http://luxrobo.com/")}>
          Go to LUXROBO website →
        </Col>
      </main>
    </div>
  )
}

export default Sign
