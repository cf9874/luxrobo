import { Expose } from "class-transformer"
import { BaseDto } from "./base.dto"

// /api/v1/result/3dmodel
export class ResultModelDto extends BaseDto {
  @Expose()
  model_image!: string
}

// /api/v1/result/pcb
export class ResultPcbDto extends BaseDto {
  @Expose()
  board_image!: string
}

// /api/v1/result/bom
export class ResultBOMDto extends BaseDto {
  @Expose()
  bom_image!: string
}

// /api/v1/result/schema
export class ResultSchemDto extends BaseDto {
  @Expose()
  schematics_image!: string
}
