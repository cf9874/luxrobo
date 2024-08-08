import { FeatureBlockDto } from "apis/dto"

export interface IFeatureBlock {
  type: string
  category: string
  icon: string
  tags: string[]
}

export interface IFeaturePageProps {
  blockListProps: FeatureBlockDto[]
}
