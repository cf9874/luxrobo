import { Expose, Transform } from "class-transformer"
import { BaseDto, BasicResponseDto } from "./base.dto"
import dayjs from "dayjs"
import { MODIFIED_STEP } from "@const/project.const"

// projects, projects/list
export class ProjectDto extends BaseDto {
  @Expose()
  projectID!: number

  @Expose()
  userID!: number

  @Expose()
  teamID!: number

  @Expose()
  title!: string

  @Expose()
  project_image!: string

  @Expose()
  owner!: string

  @Expose()
  checkpoint!: MODIFIED_STEP

  @Expose()
  last_modified_step!: MODIFIED_STEP

  @Expose()
  @Transform(v => dayjs(v.value as string).format("YYYY-MM-DD"))
  created_at!: string

  @Expose()
  @Transform(v => dayjs(v.value as string).format("YYYY-MM-DD"))
  updated_at!: string
}

// clone
export class ProjectClonedDto extends BaseDto {
  @Expose()
  clone_title!: string

  @Expose()
  @Transform(v => dayjs(v.value as string).format("YYYY-MM-DD"))
  created_at!: string

  @Expose()
  owner!: string

  @Expose()
  projectID!: number

  @Expose()
  project_image!: string

  @Expose()
  teamID!: number

  @Expose()
  @Transform(v => dayjs(v.value as string).format("YYYY-MM-DD"))
  updated_at!: string

  @Expose()
  userID!: number
}

// new, progress, remove, share, update
export class ProjectHandleDto extends BasicResponseDto {
  @Expose()
  projectID!: number
}
export class ProjectProgress extends BaseDto {
  @Expose()
  auto_placement!: {
    percent: number
    running_time: string
  }
  @Expose()
  auto_routing!: {
    percent: number
    running_time: string
  }
}
export class ProjectLastModifiedDto extends BaseDto {
  @Expose()
  projectID!: 138
  @Expose()
  updated_at!: string
  @Expose()
  last_modified_step!: MODIFIED_STEP
}
