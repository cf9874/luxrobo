import { MODIFIED_STEP } from "@const/project.const"

export const getCheckPoint = ({
  current,
  checkPoint,
}: {
  current: keyof typeof MODIFIED_STEP
  checkPoint: MODIFIED_STEP
}) => {
  if (MODIFIED_STEP[current] > checkPoint) {
    return false
  } else {
    return true
  }
}
