import styles from "./switch.module.scss"
import { ISwitchProps } from "type"
import { BasicToggleSwitch } from "./switch.toggle.basic"

export const TopToBottomToggleSwitch = (props: ISwitchProps) => {
  return (
    <BasicToggleSwitch
      onToggleChange={props.onToggleChange}
      className={styles.switch_top_to_bottom}
      unCheckedChildren={
        <div className={styles.unchecked_top_to_bottom}>
          <div>Top</div>
        </div>
      }
      checkedChildren={
        <div className={styles.checked_top_to_bottom}>
          <div>Bottom</div>
        </div>
      }
    />
  )
}
