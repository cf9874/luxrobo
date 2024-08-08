import { IDiagVec2 } from "components/Diagram/Utils/Common";
import styles from "./modal.set.diameter.module.scss"
import { useEffect, useState } from "react";

export interface IDiagHoleUiTargetProps {

  pos: IDiagVec2;
  diameter: number;
}

export interface ISettingDiameterModalProps {

  target: IDiagHoleUiTargetProps;
  onChange: (diameter: number) => void;
}


export const SettingDiameterModal = (props: ISettingDiameterModalProps) => {

  const [diameter, setDiameter] = useState(props.target.diameter);

  useEffect(() => {

    props.onChange(diameter);

  }, [diameter]);

  return (
    <div className={styles.container}>
      <div className={styles.input_wrapper}>
        <span>Diameter : </span>
        <input type={'number'} value={diameter} className={styles.diameter_input} onChange={(e) => { setDiameter(Number(e.target.value)) }} />
      </div>
    </div>
  )
}
