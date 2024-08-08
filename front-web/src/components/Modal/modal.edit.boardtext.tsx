import { useEffect, useState } from "react"
import styles from "./texteditor.module.scss"
import { IDiagLayoutTextModValues, IDiagLayoutTextModifier } from "components/Diagram/Widgets/LayoutText";

export interface IEditBoardTextModalProps {

  target: IDiagLayoutTextModValues;
  onChnage: (modifier: IDiagLayoutTextModifier) => void;
}

export const EditBoardTextModal = (props: IEditBoardTextModalProps) => {

  const [size, setSize] = useState(12);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [string, setString] = useState('Text');

  useEffect(() => {

    props.onChnage({
      size,
      bold,
      italic,
      underline,
      string
    });

  }, [size, bold, italic, underline, string]);

  useEffect(() => {

    setSize(props.target.size);
    setString(props.target.string);

  }, [props.target]);

  return (
    <div className={styles.container}>
      <div className={styles.select_wrapper}>
        <select className={styles.select_font}>
          <option value="Arial">Arial</option>
        </select>
        <select className={styles.select_font_size} value={size} onChange={ (e) => { setSize(Number(e.target.value)); } }>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
          <option value={11}>11</option>
          <option value={12}>12</option>
          <option value={14}>14</option>
          <option value={16}>16</option>
          <option value={18}>18</option>          
          <option value={20}>20</option>
          <option value={24}>24</option>
        </select>
      </div>
      <div className={styles.button_wrapper}>
        <button
          className={(bold) ? (styles.bold_select) : (styles.bold)}
          onClick={() => {
            setBold(!bold);
          }}
        >
          B
        </button>
        <button
          className={(italic) ? (styles.italic_select) : (styles.italic)}
          onClick={() => {
            setItalic(!italic);
          }}
        >
          B
        </button>
        <button
          className={(underline) ? (styles.underline_select) : (styles.underline)}
          onClick={() => {
            setUnderline(!underline);
          }}
        >
          B
        </button>
      </div>
      <div>
        <input className={styles.textarea} value={string} onChange={(e) => { setString(e.target.value); }}></input>
        {/* <textarea className={styles.textarea} /> */}
      </div>
    </div>
  )
}
