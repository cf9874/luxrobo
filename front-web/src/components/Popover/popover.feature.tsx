import { useState } from "react"
import { IPopoverProps, Placement } from "type"
import styles from "./popover.module.scss"
import { CloseOutlined } from "@ant-design/icons"

export const FeaturePopover = (props: IPopoverProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div
        onClick={() => {
          if (open) return
          setOpen(true)
          setTimeout(() => {
            setOpen(false)
          }, 5000)
        }}
        className={styles.children}
      >
        {props.children}
      </div>
      {open ? (
        <div className={styles.container}>
          <div
            className={props.placement === Placement.left ? styles.arrow_box_top_left_feature : styles.arrow_box}
            style={{
              width: props.width,
              height: props.height,
            }}
          >
            <div className={styles.title_box}>
              {props.title ? <div className={styles.popover_title}>{props.title}</div> : null}
              {props.showClose ? (
                <div className={styles.close_btn}>
                  <CloseOutlined onClick={() => setOpen(false)} />
                </div>
              ) : null}
            </div>
            <div className={styles.popover_text}>{props.text}</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
