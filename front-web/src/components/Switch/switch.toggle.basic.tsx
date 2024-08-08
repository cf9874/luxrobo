import { Switch } from "antd"
import styles from "./switch.module.scss"
import { ISwitchProps } from "type"

export const BasicToggleSwitch = ({
  onToggleChange,
  className = styles.switch_basic,
  unCheckedChildren = (
    <div className={styles.unchecked_basic}>
      <div>Default</div>
    </div>
  ),
  checkedChildren = (
    <div className={styles.checked_basic}>
      <div>Toggled</div>
    </div>
  ),
}: ISwitchProps) => {
  return (
    <Switch
      onChange={onToggleChange}
      className={className}
      unCheckedChildren={unCheckedChildren}
      checkedChildren={checkedChildren}
    />
  )
}
