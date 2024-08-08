import { Expose } from "class-transformer"
import { BaseDto } from "./base.dto"

export class CompanyDto extends BaseDto {
  @Expose()
  companyID!: number

  @Expose()
  date!: {
    ["four_layer"]: { [key in string]: string }
  };

  @Expose()
  // eMail!: string
  ["e-mail"]!: string

  @Expose()
  image!: string

  @Expose()
  name!: string

  @Expose()
  number!: string

  @Expose()
  price!: {
    ["four_layer"]: { [key in string]: string }
  }

  @Expose()
  webpage!: string
}

export class SearchCompanyDto extends BaseDto {
  @Expose()
  companyID!: number;

  @Expose()
  // email!: string
  ["e-mail"]!: string

  @Expose()
  name!: string

  @Expose()
  number!: string

  @Expose()
  webpage!: string
}
