import { Expose, Type } from "class-transformer"
import { BaseDto } from "./base.dto"

export class ProjectDto {
  @Expose()
  active_user!: string

  @Expose()
  created_at!: string

  @Expose()
  owner!: string

  @Expose()
  pcb_board_file!: string

  @Expose()
  projectID!: number

  @Expose()
  // @Type(() => ProjectBlock)
  project_blocks!: ProjectBlock[]

  @Expose()
  project_file!: string

  @Expose()
  schematics_file!: string

  @Expose()
  teamID!: number

  @Expose()
  title!: string

  @Expose()
  updated_at!: string

  @Expose()
  userID!: number

  @Expose()
  workspace!: string
}

class ProjectBlock {
  @Expose()
  cost!: number

  @Expose()
  is_custom!: boolean

  @Expose()
  part_name!: string

  @Expose()
  type!: string

  @Expose()
  version!: string

  //
  @Expose()
  part_id!: number
}

export class SimpleProjectDto {
  @Expose()
  active_user!: string

  @Expose()
  owner!: string

  @Expose()
  projectID!: number

  @Expose()
  teamID!: number

  @Expose()
  title!: string

  @Expose()
  updated_at!: string

  @Expose()
  userID!: number

  @Expose()
  workspace!: string

  //
  @Expose()
  uuid!: string
}
