import { ISelectProps } from "./select.type"
import { BasicSelect } from "./select.basic"
import {
  purchaseBoardTypeOptions,
  purchaseFinishedCopperOptions,
  purchaseMinHollSizeOptions,
  purchaseMinTrackSpacingOptions,
  purchaseSilkScreensOptions,
  purchaseSolderMaskOptions,
  purchaseSurfaceFinishOptions,
  purchaseThicknessOptions,
  purchaseViaProcessOptions,
} from "@/const"

export const PurchaseDetailSelection = (props: ISelectProps) => {
  // option === key
  switch (props.option) {
    case "board_type":
      return <BasicSelect options={purchaseBoardTypeOptions} {...props}></BasicSelect>
    case "thickness":
      return <BasicSelect options={purchaseThicknessOptions} {...props}></BasicSelect>
    case "solder_mask":
      return <BasicSelect options={purchaseSolderMaskOptions} {...props}></BasicSelect>
    case "silkscreen":
      return <BasicSelect options={purchaseSilkScreensOptions} {...props}></BasicSelect>
    case "surface_finish":
      return <BasicSelect options={purchaseSurfaceFinishOptions} {...props}></BasicSelect>
    case "via_process":
      return <BasicSelect options={purchaseViaProcessOptions} {...props}></BasicSelect>
    case "finished_copper":
      return <BasicSelect options={purchaseFinishedCopperOptions} {...props}></BasicSelect>
    case "min_holl_size":
      return <BasicSelect options={purchaseMinHollSizeOptions} {...props}></BasicSelect>
    case "min_track_spacing":
      return <BasicSelect options={purchaseMinTrackSpacingOptions} {...props}></BasicSelect>
    default:
      return <BasicSelect {...props}></BasicSelect>
  }
}
