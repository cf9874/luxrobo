export const NumberUtil = {
  roundToDecimalPlaces: (number: number, decimalPlaces = 0) => {
    if (decimalPlaces <= 0) {
      return Math.round(number)
    }

    const multiplier = Math.pow(10, decimalPlaces)
    const roundedNumber = Math.round(number * multiplier) / multiplier

    let roundedStr = roundedNumber.toString()
    if (roundedStr.indexOf(".") !== -1) {
      roundedStr = roundedStr.replace(/\.?0+$/, "")
    }

    return parseFloat(roundedStr)
  },

  priceFormula: (formula: string | undefined, X: number, Y: number, count: number | "") => {
    if (formula === undefined || count === "") {
      return 0
    }

    const evaluatedString = formula
      ?.replace(/"X"/g, `${X}`)
      .replace(/"Y"/g, `${Y}`)
      .replace(/"number"/g, `${count}`)
      .replace(/x/g, "*")
      .replace(/,/g, "")

    const result = evaluatedString ? (eval(evaluatedString) as number) : 0

    return result
  },
  getLayerFomular: (number: number | "", layer: { [key in string]: string } | undefined) => {
    if (number === "" || layer === undefined) {
      return ""
    }

    const ranges = Object.keys(layer)

    for (const range of ranges) {
      const max = parseInt(range)
      if (isNaN(max) || number <= max) {
        return layer[range]
      }
    }
  },
  formatPhoneNumber(phoneNumber: string | undefined) {
    if (!phoneNumber) {
      return ""
    }

    const digits = phoneNumber.replace(/\D/g, "")

    const formattedNumber = digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")

    return formattedNumber
  },
  calculateLayoutXY(shape: { x: number; y: number; r: number }[]) {
    let minX = Number.MAX_VALUE
    let maxX = Number.MIN_VALUE
    let minY = Number.MAX_VALUE
    let maxY = Number.MIN_VALUE

    shape.forEach(item => {
      minX = Math.min(minX, item.x)
      maxX = Math.max(maxX, item.x)
      minY = Math.min(minY, item.y)
      maxY = Math.max(maxY, item.y)
    })

    // 최종 X 및 Y 값 계산
    const finalX = maxX - minX
    const finalY = maxY - minY

    return { finalX, finalY }
  },
}
