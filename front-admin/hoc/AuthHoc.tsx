import React, { ComponentType, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSelector, shallowEqual } from "react-redux"
import { apiManager, apiUtil } from "@/apis"
import { useAsyncEffect } from "@/hooks"

const AuthHoc = (Component: React.FC) => {
  const AuthenticateCheck = () => {
    const router = useRouter()

    const [isLogin, setisLogin] = useState(false)

    useAsyncEffect(async () => {
      const result = await apiManager.authApi.getDetailAccount()

      if (apiUtil.isErrorResponse(result)) {
        router.replace("/signin")
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
