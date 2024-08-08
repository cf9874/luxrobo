import styles from "./switch.module.scss"
import { ISwitchProps } from "type/switch.type"
import { BasicToggleSwitch } from "./switch.toggle.basic"

export const PowerToLogicToggleSwitch = (props: ISwitchProps) => {
  return (
    <BasicToggleSwitch
      onToggleChange={props.onToggleChange}
      className={styles.switch_power_to_logic}
      unCheckedChildren={
        <div className={styles.unchecked_power_to_logic}>
          <div>Logic</div>
        </div>
      }
      checkedChildren={
        <div className={styles.checked_power_to_logic}>
          <div>Power</div>
        </div>
      }
    />
  )
}
