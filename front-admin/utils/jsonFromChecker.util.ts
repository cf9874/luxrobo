export const JSONFormChecker = <T>(objString: string) => {
  try {
    JSON.parse(objString)
    return true
  } catch (error) {
    return false
  }
}
