/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export const ArrayUtils = {
  merge: <A extends any[]>(acc: A, curr: A, shouldMerge: (item: any, obj: any) => boolean) => {
    return acc.map(item => {
      const matchingObject = curr.find(obj => shouldMerge(item, obj))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return matchingObject || item
    }) as A
  },

  uniq: <L extends any[]>(list: L, isdup = (a: any, c: any) => a === c) => {
    return list.filter((curr, i, arr) => arr.findIndex(acc => isdup(acc, curr)) === i) as L
  },

  removeLast: <L extends any[]>(arr: L) => {
    if (arr.length === 0) {
      return arr
    }

    arr.pop()

    return arr
  },

  getDataByIdx: <L extends any[]>(arr: L, index: number) => {
    if (index >= 0 && index < arr.length) {
      return arr[index] as L[number]
    } else if (index < 0 && Math.abs(index) <= arr.length) {
      return arr[arr.length + index] as L[number]
    } else {
      return undefined
    }
  },
}
