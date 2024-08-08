import { PartBlockDto } from "apis/dto"
import { plainToInstance } from "class-transformer"

export const mappingPartList = (list: PartBlockDto[]) => {
  const mappedList = list.reduce((acc: PartBlockDto[], cur) => {
    const findPart = acc.find(part => part.part_info.part_name === cur.part_info.part_name)
    if (findPart) {
      if (!findPart.count) {
        findPart.count = 1
      } else {
        findPart.count += 1
      }
    } else {
      acc.push(plainToInstance(PartBlockDto, { ...cur, count: 1 }).toJson<PartBlockDto>())
    }
    return acc
  }, [])

  const { partList, totalPrice, bulkPrice } = getTotalPrice(mappedList)

  return { partList, totalPrice, bulkPrice }
}

export const getTotalPrice = (list: PartBlockDto[]) => {
  const result = list.map(part => {
    const price =
      part.part_info.quantity_prices.find(v => v.quantity >= (part.count ?? 1))?.price ??
      part.part_info.quantity_prices[0]?.price
    return { ...part, totalPrice: (part.count ?? 1) * (price ?? 0) }
  })
  const resultForBulk = list.map(part => {
    const price = part.part_info.quantity_prices.at(-1)?.price
    return { ...part, totalPrice: (part.count ?? 1) * (price ?? 0) }
  })

  let totalPrice = 0
  let bulkPrice = 0
  for (let index = 0; index < result.length; index++) {
    totalPrice += result[index].totalPrice ?? 0
  }
  for (let index = 0; index < resultForBulk.length; index++) {
    bulkPrice += resultForBulk[index].totalPrice ?? 0
  }
  return {
    partList: result,
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    bulkPrice: parseFloat(bulkPrice.toFixed(2)),
  }
}
