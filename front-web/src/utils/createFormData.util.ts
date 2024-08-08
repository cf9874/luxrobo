/* eslint-disable @typescript-eslint/no-unsafe-argument */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createFormData = (obj: { [key: string]: any } = {}, formdata = new FormData()) => {
  for (const key in obj) {
    formdata.append(`${key}`, obj[key])
  }

  // const formdata = setFormData({
  //   key1: data1,
  //   key2: data2,
  //   key3: data3,
  // })

  return formdata
}
