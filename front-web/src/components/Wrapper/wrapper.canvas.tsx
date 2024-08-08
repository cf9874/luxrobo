import styles from "./wrapper.module.scss"
import { PlusOutlined } from "@ant-design/icons"
import { Dispatch, ReactNode, SetStateAction } from "react"

export const CanvasWrapper = ({
  Switch,
  children,
  flag,
  isLogic,
  setOpenCustom,
  onAddCustomBlock,
  onAddPowerNet,
  setContextMenuPositon,
}: {
  Switch: ReactNode
  children: ReactNode
  onOpenMenu?: () => void
  flag?: boolean
  isLogic?: boolean
  setOpenCustom?: Dispatch<SetStateAction<boolean>>
  onAddPowerNet?: () => void
  onAddCustomBlock?: () => Promise<void>
  setContextMenuPositon?: Dispatch<
    SetStateAction<{
      x: number
      y: number
    }>
  >
}) => {
  return (
    <div
      className={styles.container}
      onContextMenu={e => {
        e.preventDefault()
        console.log(e)
        setContextMenuPositon &&
          setContextMenuPositon({
            x: e.clientX,
            y: e.clientY,
          })
      }}
    >
      <div className={flag ? styles.button_container_logic : styles.button_container_layout}>
        {Switch}
        {flag ? (
          <button
            className={styles.add_custom_button}
            onClick={async () => {
              if (isLogic) {
                onAddCustomBlock && (await onAddCustomBlock())
              } else {
                onAddPowerNet && onAddPowerNet()
              }
            }}
          >
            <PlusOutlined />
          </button>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  )
}
