import { GetServerSidePropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import { destroyCookie } from "nookies"
import { COOKIE_KEY } from "@/const/cookie.const"
import { API_ERROR_MSG } from "@/const/api.error.const"

export const apiUtil = {
  // isErrorResponse(obj: any): obj is { message: string | undefined } {
  isErrorResponse(obj: any): obj is { [key in string]: string | undefined } {
    return "message" in obj && obj.message !== "success"
  },

  signChecker(obj: any): obj is boolean {
    return (
      "message" in obj &&
      (obj.message === API_ERROR_MSG.ACCESS || obj.message === "Unauthorized-you are not admin user")
    )
  },

  removeUserData: (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null) => {
    destroyCookie(ctx, COOKIE_KEY.ACCESSTOKEN)
    destroyCookie(ctx, COOKIE_KEY.REFRESHETOKEN)
    destroyCookie(ctx, COOKIE_KEY.EXPIRETIME)
  },
}
