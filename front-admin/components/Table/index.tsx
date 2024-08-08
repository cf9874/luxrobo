export * from "./table.basic"
export * from "./table.type"

export const sortfunc = key => {
  return {
    compare: (a, b) => {
      if (typeof a[key] === "number" || typeof b[key] === "number") {
        return b[key] - a[key]
      }
      return a[key]?.localeCompare(b[key])
    },
    multiple: 1,
  }
}
