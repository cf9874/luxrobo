import dayjs from "dayjs"

export const DayUtil = {
  diff: (date: string) => {
    const now = dayjs()
    console.log(666, date)
    const targetDate = dayjs(date)
    const diff = now.diff(targetDate, "second")
    console.log("diff : ", diff)
    const seconds = diff
    const minuites = diff / 60
    console.log("minuites : ", minuites)
    const hours = minuites / 60
    console.log("hours : ", hours)

    if (hours > 1) {
      return `${parseInt(hours.toString())} hours ago`
    } else if (minuites > 1) {
      return `${parseInt(minuites.toString())} minutes ago`
    } else if (seconds < 60) {
      return `${parseInt(diff.toString())} seconds ago`
    } else {
      return date
    }
  },
}
