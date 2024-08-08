import {
  CUSTOM_OPTIONS,
  MODAL_OPTIONS,
  ORDER_OPTIONS,
  PROJECT_OPTIONS,
  PURCHASE_OPTIONS,
  QUESTION_OPTIONS,
  SHIPMENT_OPTIONS,
  TEAM_OPTIONS,
  TOOL_OPTIONS,
  USER_OPTIONS,
} from "@/const/searchConst"
import { useRouter } from "next/router"

const dataOptionHandler = () => {
  const { pathname } = useRouter()

  if (pathname === "/user") {
    return USER_OPTIONS
  }
  if (pathname === "/team") {
    return TEAM_OPTIONS
  }
  if (pathname === "/project") {
    return PROJECT_OPTIONS
  }
  if (pathname === "/custom") {
    return CUSTOM_OPTIONS
  }
  if (pathname === "/tool") {
    return TOOL_OPTIONS
  }
  if (pathname === "/order") {
    return ORDER_OPTIONS
  }
  if (pathname === "/purchase") {
    return PURCHASE_OPTIONS
  }
  if (pathname === "/shipment") {
    return SHIPMENT_OPTIONS
  }
  if (pathname === "/question") {
    return QUESTION_OPTIONS
  } else {
    return MODAL_OPTIONS
  }
}

export default dataOptionHandler
