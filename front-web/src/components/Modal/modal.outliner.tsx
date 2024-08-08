import { imgAsset } from "@assets/image"
import Image from "next/image"
import styles from "./modal.outliner.module.scss"
import { useEffect, useState } from "react"
import { ILayoutDiagPos } from "components/Diagram/Models/Block"

export interface IOutLinerModalProps {
  shape: ILayoutDiagPos[]
  onChange: (shape: ILayoutDiagPos[]) => void

  onImport: () => void
}

let shapeProps: ILayoutDiagPos[] = []

export const OutLinerModal = (props: IOutLinerModalProps) => {
  const [open, setOpen] = useState(true)
  const [buttonClick, setButtonClick] = useState(false)

  const [shape, setShape] = useState([] as ILayoutDiagPos[])

  useEffect(() => {
    shapeProps = props.shape
    setShape([...props.shape])
  }, [props.shape])

  const onChangeValues = (i: number, x: number, y: number, r: number) => {
    if (shape.length > i) {
      shapeProps[i] = { x, y, r }
      props.onChange(shapeProps)
    }
  }
  const numberLimit = (value: string) => {
    return value.split(".")[0] + "." + (value.split(".")[1]?.slice(0, 2) ?? "0")
  }
  return (
    <div className={styles.container}>
      <div>
        <div className={open ? styles.title_wrapper : styles.title_wrapper_close}>
          <div className={styles.title}>Outline Points</div>
          <span className={styles.collapse_wrapper} onClick={() => setOpen(state => !state)}>
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                  <path d="M0 0h24v24H0z" />
                  <rect width="16" height="1.5" rx=".75" transform="translate(4 11.25)" fill="#FFF" />
                </g>
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className={styles.collapse_img}
              >
                <defs>
                  <path id="10zyv0z82a" d="M0 0h16v5.57H0z" />
                </defs>
                <g fill="none" fill-rule="evenodd">
                  <path d="M0 0h24v24H0z" />
                  <g transform="translate(4 9.21)">
                    <mask id="yhvyb3k8hb" fill="#fff">
                      <use xlinkHref="#10zyv0z82a" />
                    </mask>
                    <path
                      d="M15.9.375A.75.75 0 0 0 14.874.1L8.25 3.925a.497.497 0 0 1-.5 0L1.125.1a.75.75 0 0 0-.75 1.3L6.5 4.936l.75.433a1.5 1.5 0 0 0 1.5 0l.75-.433L15.625 1.4A.751.751 0 0 0 15.9.375"
                      mask="url(#yhvyb3k8hb)"
                      fill="#FFF"
                      className={styles.collapse_path}
                    />
                  </g>
                </g>
              </svg>
            )}
          </span>
        </div>
      </div>
      {open ? (
        <div className={styles.content_wrapper}>
          <div className={styles.content_nav}>
            <span className={styles.nav_item} style={{ marginLeft: "5px" }}>
              No.
            </span>
            <span className={styles.nav_item} style={{ marginLeft: "40px" }}>
              X
            </span>
            <span className={styles.nav_item} style={{ marginLeft: "70px" }}>
              Y
            </span>
            <span className={styles.nav_item} style={{ marginLeft: "75px" }}>
              R
            </span>
          </div>
          {/* {Array(10)
            .fill(0)
            .map((_, i) => {
              return (
                <div key={i} className={styles.content_row}>
                  <div className={styles.row_index}>{i + 1}</div>
                  <input type={"number"} step={0.01} style={{}} className={styles.row_input} onChange={(e) => {}} />
                  <input type={"number"} step={0.01} className={styles.row_input} onChange={(e) => {}} />
                  <input type={"number"} step={0.01} className={styles.row_input} onChange={(e) => {}} />
                </div>
              )
            })} */}
          {props.shape.map((v, i) => (
            <div key={i} className={styles.content_row}>
              <div className={styles.row_index}>{i + 1}</div>
              <input
                type={"number"}
                step={0.01}
                maxLength={2}
                value={v.x}
                style={{}}
                className={styles.row_input}
                onChange={e => {
                  onChangeValues(i, Number(numberLimit(e.target.value)), v.y, v.r)
                }}
              />
              <input
                type={"number"}
                step={0.01}
                value={v.y}
                className={styles.row_input}
                onChange={e => {
                  onChangeValues(i, v.x, Number(numberLimit(e.target.value)), v.r)
                }}
              />
              <input
                type={"number"}
                step={0.01}
                value={v.r}
                className={styles.row_input}
                onChange={e => {
                  onChangeValues(i, v.x, v.y, Number(numberLimit(e.target.value)))
                }}
              />
            </div>
          ))}
          <hr className={styles.hr} />
          <div
            className={styles.import_button}
            onClick={props.onImport}
            // for icon
            onMouseDown={() => {
              setButtonClick(state => !state)
            }}
            onMouseUp={() => {
              setButtonClick(state => !state)
            }}
          >
            {buttonClick ? (
              <Image src={imgAsset.dxfImgActive} alt="dxf" width={"40px"} height={"40px"} />
            ) : (
              <Image src={imgAsset.dxfImg} alt="dxf" width={"40px"} height={"40px"} />
            )}
            <p
              style={{
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              Import DXF
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
