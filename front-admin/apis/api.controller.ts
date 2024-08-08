import { AxiosError, AxiosRequestConfig } from "axios"
import { createAxiosInstance } from "./axios.instance"

import { COOKIE_KEY } from "const"
import { GetServerSidePropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import { parseCookies } from "nookies"
import nookies from "nookies"

// import Cookies from "js-cookie"
// import { COOKIE_KEY } from "@const/cookie.const"
// import { API_ERROR_MSG } from "@const/api.error.const"

type IAxiosParams = { url?: string; options?: AxiosRequestConfig; body?: unknown }

export interface IWrapperData<T> {
  data: T
  now: number
}

export class AxiosController {
  private axiosInstance = createAxiosInstance(null)

  updateBaseURL(newURL: string) {
    this.axiosInstance.defaults.baseURL = newURL
  }

  private mergeHeaders(customHeaders = {}) {
    const Auth =
      typeof window === "undefined" ? {} : { Authorization: `Bearer ${nookies.get(null)[COOKIE_KEY.ACCESSTOKEN]}` }

    return {
      ...this.axiosInstance.defaults.headers,
      ...customHeaders,
      ...Auth,
    } as AxiosRequestConfig["headers"]
  }

  updateAxios(ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null) {
    //typeof window !== 'undefined' 이면 clientside

    const cookies = parseCookies(ctx)

    if (typeof window === "undefined") {
      this.axiosInstance = createAxiosInstance(ctx)
      this.updateToken(cookies[COOKIE_KEY.ACCESSTOKEN] ?? "")
    }

    return this
  }

  updateToken(token = "") {
    this.axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`
  }

  private onError({ response }: AxiosError<{ message: string }>) {
    console.error(`status ${response?.status}\nmessage ${response?.data?.message}`)
    if (typeof response?.data.message === "object") {
      console.error(response?.data?.message)
    }
    return { message: response?.data?.message }
  }

  // private checkServerError<D>(data: AxiosResponse<D>) {
  //   // if (data.data.message === API_ERROR_MSG.REFRESHE) {
  //   //   console.log("refresh")
  //   // } else if (data.data.message === API_ERROR_MSG.ACCESS) {
  //   //   console.log("access")
  //   // }

  //   if (data.status !== 200) {
  //     console.error("ServerError", data.status)

  //     return errorData
  //   }

  //   return data.data
  // }

  async get<D>({ url = "/", options = {} }: IAxiosParams) {
    try {
      const data = await this.axiosInstance.get<D>(url, {
        ...options,
        headers: this.mergeHeaders(options.headers),
      })

      return data.data
      // return this.checkServerError(data)
    } catch (error) {
      return this.onError(error as AxiosError<{ message: string }>)
    }
  }

  async post<D>({ url = "/", body = {}, options = {} }: IAxiosParams) {
    try {
      const data = await this.axiosInstance.post<D>(url, body, {
        ...options,
        headers: this.mergeHeaders(options.headers),
      })

      return data.data
    } catch (error) {
      console.error(error)

      return this.onError(error as AxiosError<{ message: string }>)
    }
  }

  async patch<D>({ url = "/", body = {}, options = {} }: IAxiosParams) {
    try {
      const data = await this.axiosInstance.patch<D>(url, body, {
        ...options,
        headers: this.mergeHeaders(options.headers),
      })

      return data.data
    } catch (error) {
      return this.onError(error as AxiosError<{ message: string }>)
    }
  }

  async put<D>({ url = "/", body = {}, options = {} }: IAxiosParams) {
    try {
      const data = await this.axiosInstance.put<D>(url, body, {
        ...options,
        headers: this.mergeHeaders(options.headers),
      })

      return data.data
    } catch (error) {
      return this.onError(error as AxiosError<{ message: string }>)
    }
  }

  async delete<D>({ url = "/", options = {} }: IAxiosParams) {
    try {
      const data = await this.axiosInstance.delete<D>(url, {
        ...options,
        headers: this.mergeHeaders(options.headers),
      })

      return data.data
    } catch (error) {
      return this.onError(error as AxiosError<{ message: string }>)
    }
  }
}

// export const apiConnector = ApiConnector.instance
