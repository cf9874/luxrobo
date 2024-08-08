// import { IsBoolean, IsInt, IsString } from "class-validator"
import { Expose } from "class-transformer"

export class CompanyListDtoRes {
  @Expose()
  seq!: number

  @Expose()
  companyName!: string
  @Expose()
  companyInfo!: {
    adress: string
    tel: string
    mail: string
    link: string
  }
  @Expose()
  price!: {
    count: number
    price: number
    period: number[]
  }[]
}
