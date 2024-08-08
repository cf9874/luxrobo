export const createFormData = (obj: { [key: string]: any }, formData = new FormData()) => {
  for (const key in obj) {
    formData.append(`${key}`, obj[key])
  }

  return formData
}

export const formDataToObject = (formData: FormData): { [key: string]: any } => {
  const object: { [key: string]: any } = {}

  formData.forEach((value, key) => {
    object[key] = value
  })

  return object
}
