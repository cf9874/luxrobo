import { Expose } from "class-transformer"

export class DefaultDataDtoRes {
  [key: string | number]: any
}

export class DefaultColumnDtoRes {
  @Expose()
  key!: string
  @Expose()
  title!: string
  @Expose()
  dataIndex!: string
  align?: string
  type?: string
  sort?: boolean
  input?: string
}

export function compareElement(a: React.Key | String, b: React.Key | String) {
  const valueA = a.toString()
  const valueB = b.toString()

  return valueA.localeCompare(valueB)
}
