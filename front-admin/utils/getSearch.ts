const getSearch = (result: any[], selectedDataOption: string, selectedWordOption: string, isSearch: string): any[] => {
  // 전체
  if (selectedDataOption === "all") {
    const filterFunction = item => {
      const keys = Object.keys(item)

      if (selectedWordOption === "포함") {
        return keys.some(key => {
          const value = item[key]
          return typeof value === "string" || typeof value === "number" ? String(value).includes(isSearch) : false
        })
      } else if (selectedWordOption === "일치") {
        return keys.some(key => String(item[key]) === isSearch)
      }
    }

    const foundItem = result.filter(filterFunction)

    return foundItem
  } else {
    const Item = result.filter(item => {
      const keys = Object.keys(item)

      if (selectedWordOption === "포함") {
        return keys.some(key => {
          if ((typeof item[key] === "string" || typeof item[key] === "number") && selectedDataOption === key) {
            console.log(isSearch)

            return String(item[key]).includes(isSearch)
          }
        })
      } else if (selectedWordOption === "일치") {
        return keys.some(key => String(item[key]) === isSearch)
      }
    })

    return Item
  }
}

export default getSearch
