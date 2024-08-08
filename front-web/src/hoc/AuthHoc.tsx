import React, { useState } from "react"
import { useRouter } from "next/router"
import { apiManager, apiUtil } from "apis"
import { useAsyncEffect } from "hooks"

const AuthHoc = (Component: React.FC) => {
  const AuthenticateCheck = () => {
    const router = useRouter()

    const [isLogin, setisLogin] = useState(false)

    useAsyncEffect(async () => {
      const result = await apiManager.userApi.getProfileInfo()

      if (apiUtil.isErrorResponse(result)) {
        alert("다시 로그인해주세요.")
        apiUtil.removeUserData()
        void router.replace("/member/signin")
      } else {
        setisLogin(true)
      }
    }, [])

    if (isLogin) return <Component />
    else return null
  }

  return AuthenticateCheck
}

export default AuthHoc
