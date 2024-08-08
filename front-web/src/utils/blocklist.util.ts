import { FeatureInitDto, LayoutBoardDto, LogicCustomInitDto, PartBlockDto } from "apis/dto"
import { plainToInstance } from "class-transformer"
import { EDiagCollisionDetectType, IDiagCollisionDetectResult, IDiagLayoutBlock } from "components/Diagram/Models/Block"

export const matchPartList = (list: LogicCustomInitDto[]) => {
  const indexMap: { [key: string]: number } = {}
  const result = list
    .map(part => {
      const { type } = part
      if (indexMap[type] === undefined) {
        indexMap[type] = 1
      } else {
        indexMap[type]++
      }
      return { ...part, index: indexMap[type] }
    })
    .map(part => plainToInstance(LogicCustomInitDto, part).toJson<LogicCustomInitDto>())
  return result
}
export const mappingBlockList = ({ blocks, parts }: { blocks: LogicCustomInitDto[]; parts: PartBlockDto[] }) => {
  const result = blocks.map(b => {
    const part = parts.find(p => p.BlockInfo.block_id === b.block_id)
    const is_updated = part?.BlockInfo.original_part_id !== part?.part_info.part_id || part?.BlockInfo.is_schema_changed
    // ||      JSON.stringify(part?.BlockInfo.original_selected_option) !== JSON.stringify(part?.BlockInfo.selected_option)
    return plainToInstance(LogicCustomInitDto, {
      ...b,
      is_updated,
    }).toJson<LogicCustomInitDto>()
  })
  console.log(result)
  return result
}

export const boardPlaceCheck = ({
  blocks,
  board,
}: {
  blocks: LogicCustomInitDto[]
  board: LayoutBoardDto | undefined
}) => {
  const result = matchPartList(blocks)
    .map(v => {
      const layoutInfo = board?.layout_blocks.find(e => e.block_id === v.block_id)
      if (layoutInfo?.is_placed)
        return {
          block_id: v.block_id,
          index: v.index.toString(),
          category: v.category,
          name: v.part_name,
          color: v.color,
          part_id: v.part_id,
          part_name: v.part_name,
          icon: v.icon,
          type: v.type,
          is_updated: v.is_updated,
          layoutInfo: layoutInfo,
        }
      else return
    })
    .filter(b => b !== undefined) as IDiagLayoutBlock[]
  return result
}
export const mappingAutoPlacement = ({
  boardValid,
  autoResponse,
}: {
  boardValid: IDiagCollisionDetectResult
  autoResponse: LayoutBoardDto
}) => {
  const error = Object.entries(boardValid)
    .filter(e => !e.includes("type"))
    .map(v => v[1] as string)
  if (boardValid.type === EDiagCollisionDetectType.Block) {
    const layout = autoResponse.layout_blocks.map(l => {
      if (error.includes(l.block_id)) {
        return {
          ...l,
          is_conflict: true,
        }
      } else
        return {
          ...l,
          is_conflict: false,
        }
    })
    return plainToInstance(LayoutBoardDto, {
      ...autoResponse,
      layout_blocks: layout,
    }).toJson<LayoutBoardDto>()
  } else if (boardValid.type === EDiagCollisionDetectType.Board) {
    const layout = autoResponse.layout_blocks.map(l => {
      if (error.includes(l.block_id)) {
        return {
          ...l,
          is_escape: true,
        }
      } else
        return {
          ...l,
          is_escape: false,
        }
    })
    return plainToInstance(LayoutBoardDto, {
      ...autoResponse,
      layout_blocks: layout,
    }).toJson<LayoutBoardDto>()
  } else {
    return autoResponse
  }
}
export const mappingFeatureIndex = (featureList: FeatureInitDto[]) => {
  const result = featureList.map((f, index) => {
    return plainToInstance(FeatureInitDto, {
      ...f,
      index,
    }).toJson<FeatureInitDto>()
  })
  return result
}
