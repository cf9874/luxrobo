import { SelectProps } from "antd"

export const OrderValues = {
  boardType: ["Single Pieces", "Panel by Customer", "Panel by ***"] as const,
  thickness: [0.6, 0.8, (1).toFixed(1), 1.6, (2).toFixed(1), 2.4, (3).toFixed(1)] as const,
  solderMask: ["Green", "Red", "Yellow", "Blue", "White", "Black", "Matt Black"] as const,
  silkScreens: ["White", "Black"] as const,
  surfaceFinish: ["HASL", "Lead free HASL", "ENIG", "OSP"] as const,
  viaProcess: ["Tenting Vias", "Vias not covered", "Plugged vias with solder mask", "Plugged vias with resin"] as const,
  finishedCopper: ["1 oz", "2 oz"] as const,
  minHollSize: ["0.15mm", "0.2mm", "0.25mm", "0.3mm", "0.8mm", "1mm"] as const,
  minTrackSpacing: ["3/3mil", "4/4mil", "5/5mil", "6/6mil", "8/8mil", "10/10mil"] as const,
}

export type BoardType = (typeof OrderValues.boardType)[number]
export type Thickness = (typeof OrderValues.thickness)[number]
export type SolderMask = (typeof OrderValues.solderMask)[number]
export type SilkScreens = (typeof OrderValues.silkScreens)[number]
export type SurfaceFinish = (typeof OrderValues.surfaceFinish)[number]
export type ViaProcess = (typeof OrderValues.viaProcess)[number]
export type FinishedCopper = (typeof OrderValues.finishedCopper)[number]
export type MinHollSize = (typeof OrderValues.minHollSize)[number]
export type MinTrackSpacing = (typeof OrderValues.minTrackSpacing)[number]

export const purchaseBoardTypeOptions: SelectProps["options"] = OrderValues.boardType.map(item => {
  return {
    value: item,
    label: <div>{item}</div>,
  }
})

export const purchaseThicknessOptions: SelectProps["options"] = OrderValues.thickness.map(item => {
  return {
    value: item,
    label: <div>{item}</div>,
  }
})

export const purchaseSolderMaskOptions: SelectProps["options"] = OrderValues.solderMask.map(item => {
  return {
    value: item,
    label: <div>{item}</div>,
  }
})

export const purchaseSilkScreensOptions: SelectProps["options"] = OrderValues.silkScreens.map(item => {
  return {
    value: item,
    label: <div>{item}</div>,
  }
})

export const purchaseSurfaceFinishOptions: SelectProps["options"] = OrderValues.surfaceFinish.map(item => {
  return {
    value: item,
    label: <div>{item}</div>,
  }
})

export const purchaseViaProcessOptions: SelectProps["options"] = OrderValues.viaProcess.map(item => {
  return {
    value: item,
    label: <div>{item}</div>,
  }
})

export const purchaseFinishedCopperOptions: SelectProps["options"] = OrderValues.finishedCopper.map(item => {
  return {
    value: item,
    label: <div>{item}</div>,
  }
})

export const purchaseMinHollSizeOptions: SelectProps["options"] = OrderValues.minHollSize.map(item => {
  return {
    value: item,
    label: <div>{item}</div>,
  }
})

export const purchaseMinTrackSpacingOptions: SelectProps["options"] = OrderValues.minTrackSpacing.map(item => {
  return {
    value: item,
    label: <div>{item}</div>,
  }
})

export default purchaseBoardTypeOptions
