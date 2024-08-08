import { COOKIE_KEY } from "@const/cookie.const"
import { GetServerSidePropsContext, PreviewData } from "next"
import { destroyCookie } from "nookies"
import { ParsedUrlQuery } from "querystring"

export const apiUtil = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isErrorResponse(obj: any): obj is { message: string | undefined } {
    return "message" in obj && obj.message !== "success"
  },

  removeUserData: (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null) => {
    destroyCookie(ctx, COOKIE_KEY.ACCESSTOKEN)
    destroyCookie(ctx, COOKIE_KEY.REFRESHETOKEN)
    destroyCookie(ctx, COOKIE_KEY.EXPIRETIME)
  },
}
