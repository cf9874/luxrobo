export enum API_ERROR_MSG {
  REFRESHE = "Unauthorized-invalid or expired refresh token",
  ACCESS = "Unauthorized-invalid or expired jwt",
  LOGOUT = "다시 로그인해주세요.",
  DELETED_USER = "Not Found-deleted user",
  NOT_CERTIFY_USER = "Bad Request-not certificated",
  NOT_FOUND_USER = "Not Found-querying user",
  NOT_MATCHED_PASSWORD = "Bad Request-password not matched",
  INVALID_PARAMETER = "Bad Request-invalid parameter",
  BAD_PARAMETER = "Bad Request-bad parameter",
  MCU_PIN_OVER = "MCU pin is over",
}
