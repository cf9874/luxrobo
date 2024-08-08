import { useRouter } from "next/router"
import styles from "./sigiinin.module.scss"
import { Row, Space } from "antd"
import { useInputs, useRedux } from "@/hooks"
import { BasicInput, PasswordInput } from "@/components/Input"
import { BasicButton } from "@/components/Button"
import { apiUtil } from "@/apis/api.util"
import { setCookie } from "nookies"
import { COOKIE_KEY } from "@/const/cookie.const"
import { NextPage } from "next"
import { apiManager } from "@/apis"
import { updateProfile } from "@/redux/reducers/profile"

//------------------------------------------------------------------------------------------------------
// [Main]
const Sign: NextPage = () => {
  const router = useRouter()
  const updateProfileRdx = useRedux(updateProfile)

  //

  //------------------------------------------------------------------------------------------------------
  // [Data]

  // (관리자 프로필 - 미구현)
  //  : 필요 작업 - 백엔드 api 요청(관리자 정보 호출 "/profile")
  //                / 관리자 프로필 Redux 구현
  // const initProfileDis = useRedux(initProfile)
  //

  // const [loginData, setLoginData] = useState({
  //   accountID: "",
  //   password: "",
  // })
  //->
  const idInput = useInputs({ value: "" })
  const pwdInput = useInputs({ value: "" })

  //------------------------------------------------------------------------------------------------------
  // handler
  const loginHandler = async () => {
    // const data = await axios.post("/api/login", {
    //   id: idInput.value,
    //   pwd: pwdInput.value,
    // })

    const response = await apiManager.adminsApi.signIn({
      AccountID: idInput.value,
      password: pwdInput.value,
    })

    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)

      return
    }

    const adminInfo = await apiManager.authApi.getDetailAccount()

    if (apiUtil.isErrorResponse(adminInfo)) {
      alert(adminInfo.message)

      return
    }

    updateProfileRdx(adminInfo)

    setCookie(null, COOKIE_KEY.ACCESSTOKEN, response.access_token)

    setCookie(null, COOKIE_KEY.REFRESHETOKEN, response.refresh_token)

    void router.push("/home")
  }

  // [UI]
  return (
    <div>
      <main className={styles.container}>
        <div className={styles.title_container}>
          <div className={styles.sub_title}>LUXROBO IoT Platform</div>
          <div className={styles.main_title}>MODI EDA 관리자 페이지</div>
        </div>
        <div className={styles.login_container}>
          <Space direction="vertical" align="center" className={styles.login_box}>
            <Space direction="vertical" align="center" className={styles.login_box}>
              <Row className={styles.title}>LOG IN</Row>

              <Row justify={"space-between"} align="middle" className={styles.input_item}>
                <BasicInput placeholder="ID" value={idInput.value} onChange={idInput.onChange}></BasicInput>
              </Row>

              <Row justify={"space-between"} align="middle" className={styles.input_item}>
                <PasswordInput placeholder="PW" value={pwdInput.value} onChange={pwdInput.onChange}></PasswordInput>
              </Row>
            </Space>
            <Row>
              <BasicButton className={styles.login_btn} onClick={loginHandler}>
                Login
              </BasicButton>
            </Row>
          </Space>
        </div>
      </main>
    </div>
  )
}

export default Sign
