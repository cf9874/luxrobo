import { Col, Row } from "antd"
import styles from "./modal.contextmenu.module.scss"
import { imgAsset } from "@assets/image"
import { Dispatch, SetStateAction } from "react"
import Image from "next/image"
export const LogicContextMenu = ({
  onCloneBlock,
  position,
  onZoomIn,
  onZoomout,
  onResetView,
  setOpenCustom,
}: {
  onCloneBlock: () => Promise<void>
  position: {
    x: number
    y: number
  }
  onZoomIn: () => void
  onZoomout: () => void
  onResetView: () => void
  setOpenCustom: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <Col
      className={styles.menu_container}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
      }}
    >
      <Row className={styles.menu_row} onClick={onCloneBlock}>
        <Col>
          <Image src={imgAsset.copyIcon} width={24} height={24} alt="Paste" />
        </Col>
        <Col className={styles.menu_title}>Paste</Col>
      </Row>
      <Row
        className={styles.menu_row}
        onClick={() => {
          onZoomIn()
        }}
      >
        <Col>
          <Image src={imgAsset.zoomIn} width={24} height={24} alt="Zoom In" />
        </Col>
        <Col className={styles.menu_title}> Zoom In</Col>
      </Row>
      <Row
        className={styles.menu_row}
        onClick={() => {
          onZoomout()
        }}
      >
        <Col>
          <Image src={imgAsset.zoomOut} width={24} height={24} alt="Paste" />
        </Col>
        <Col className={styles.menu_title}>Zoom Out</Col>
      </Row>
      <Row
        className={styles.menu_row}
        onClick={() => {
          onResetView()
        }}
      >
        <Col>
          <Image src={imgAsset.fitWindow} width={24} height={24} alt="Fit in window" />
        </Col>
        <Col className={styles.menu_title}> Fit in window</Col>
      </Row>
      <Row
        className={styles.menu_row}
        onClick={() => {
          setOpenCustom(true)
        }}
      >
        <Col>
          <Image src={imgAsset.addBlock} width={24} height={24} alt="New block" />
        </Col>
        <Col className={styles.menu_title}>New Block</Col>
      </Row>
    </Col>
  )
}
