import { API_ERROR_MSG } from "const/api.error.const"
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { parseCookies, setCookie } from "nookies"
import createAuthRefreshInterceptor from "axios-auth-refresh"
import { COOKIE_KEY } from "const"
import router from "next/router"
import { GetServerSidePropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import dayjs from "dayjs"
import { IWrapperData } from "./api.controller"
import { apiUtil } from "./api.util"
import nookies from "nookies"

export const createAxiosInstance = (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null) => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "content-type": "application/json",
      "Cache-Control": "no-cache, must-revalidate",
    },
  })

  const shouldRefresh = (error: AxiosError<{ message: API_ERROR_MSG }>) => {
    return error.response?.status === 401 && error.response?.data.message === API_ERROR_MSG.ACCESS
  }

  const refreshAuthLogic = (failedRequest: { response: AxiosResponse } & AxiosRequestConfig) => {
    // const cookies = parseCookies({ req: failedRequest.response.request })
    const cookies = typeof window === "undefined" ? parseCookies(ctx) : nookies.get(ctx)

    return axiosInstance
      .post<IWrapperData<{ access_token: string }>>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/accounts/access-token`,
        {
          token: cookies[COOKIE_KEY.REFRESHETOKEN],
        },
      )
      .then(res => {
        setCookie(ctx, COOKIE_KEY.ACCESSTOKEN, res.data.data.access_token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        })

        failedRequest.response.config.headers["Authorization"] = "Bearer " + res.data.data.access_token

        return Promise.resolve()
      })
      .catch(error => {
        console.error(error)

        // 에러 처리
        // alert("토큰 갱신 중 오류가 발생했습니다. 다시 로그인해주세요.")
        apiUtil.removeUserData(ctx)
        // void router.push("/member/signin")
        void router.push("/signin")

        // return Promise.reject(new CustomError(API_ERROR_MSG.TOKENUPADTE))
        return Promise.reject(new CustomError(API_ERROR_MSG.NEEDLOGIN))
      })
  }
  createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
    // statusCodes: [401],
    shouldRefresh: shouldRefresh,
  })

  axiosInstance.interceptors.request.use(request => {
    // const token = Cookies.get("accessToken")
    // if (token) {
    //   request.headers["Authorization"] = "Bearer " + token
    // }

    const cookies = parseCookies(ctx)
    const expireTime = cookies[COOKIE_KEY.EXPIRETIME]

    if (expireTime) {
      const isExpired = dayjs().isAfter(dayjs(expireTime))

      if (isExpired) {
        apiUtil.removeUserData(ctx)

        // void router.push("/member/signin")
        void router.push("/signin")
        return Promise.reject(new CustomError(API_ERROR_MSG.TOKENEXPIRE))
      }
    }

    return request
  })

  axiosInstance.interceptors.response.use(
    response => response,
    error => Promise.reject(error),
  )

  return axiosInstance
}

class CustomError extends Error {
  response: { data: { message: string } }
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    this.response = { data: { message } }
  }
}
