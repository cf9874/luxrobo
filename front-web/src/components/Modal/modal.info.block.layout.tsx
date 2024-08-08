import { Col, Row } from "antd"
import styles from "./modal.info.block.module.scss"
import { CloseOutlined } from "@ant-design/icons"
import { PartBlock } from "components/Extras"
import { CATEGORY_COLOR } from "@const/block.const"
import { LogicCustomInitDto } from "apis/dto"
import { Dispatch, SetStateAction } from "react"
import { useInputs } from "hooks"
import Image from "next/image"

export const BlockInfoLayoutModal = ({
  blockInfo,
  setOpenInfo,
}: {
  blockInfo: LogicCustomInitDto | null
  setOpenInfo: Dispatch<SetStateAction<boolean>>
}) => {
  const partNameInput = useInputs({ value: "" })
  const category = blockInfo?.category as keyof typeof CATEGORY_COLOR
  return (
    <Col>
      <Row className={styles.title_wrapper}>
        <Col className={styles.title}>Block Infomation</Col>
        <Col className={styles.close_button} onClick={() => setOpenInfo(false)}>
          <CloseOutlined />
        </Col>
      </Row>
      <Row className={styles.block_info_wrapper}>
        <Col className={styles.img_wrapper}>
          <PartBlock
            src={process.env.NEXT_PUBLIC_S3_URL + (blockInfo?.icon ?? "")}
            activeColor={blockInfo?.color === "" ? CATEGORY_COLOR[category] : blockInfo?.color}
          >
            <div>{blockInfo?.type}</div>
          </PartBlock>
        </Col>
        <Col className={styles.name_input_wrapper}>
          <Col className={styles.input_label}>Name</Col>
          {/* <input
            className={styles.part_name_input}
            value={partNameInput.value === "" ? blockInfo?.part_name : partNameInput.value}
            onChange={partNameInput.onChange}
          /> */}
          <Col className={styles.option_value}>{blockInfo?.part_name}</Col>
        </Col>
      </Row>
      <Col className={styles.block_option_info_wrapper}>
        <Row className={styles.info_row}>
          <Col className={styles.option_name}>Type</Col>
          <Col className={styles.option_value}>{blockInfo?.type}</Col>
        </Row>
        <Row className={styles.info_row}>
          <Col className={styles.option_name}>Part #</Col>
          <Col className={styles.option_value}>{blockInfo?.part_name}</Col>
        </Row>
        {Object.entries(blockInfo?.option_names ?? {}).map(([key, value]) => (
          <Row key={key} className={styles.info_row}>
            <Col className={styles.option_name}>{key}</Col>
            <Col className={styles.option_value}>{value}</Col>
          </Row>
        ))}

        <div className={styles.divider} />
        <Row className={styles.option_image_box}>
          <Row className={styles.option_image_title}>Symbol & Footprint</Row>
          <Row className={styles.option_images}>
            <Col className={styles.option_image}>
              <Image unoptimized={true} src={blockInfo?.part_image ?? ""} alt="part_image" width={89} height={89} />
            </Col>
            <Col className={styles.option_image}>
              <Image unoptimized={true} src={blockInfo?.symbol_image ?? ""} alt="symbol_image" width={89} height={89} />
            </Col>

            <Col className={styles.option_image}>
              <Image
                unoptimized={true}
                src={blockInfo?.footprint_image ?? ""}
                alt="footprint_image"
                width={89}
                height={89}
              />
            </Col>
          </Row>
        </Row>
      </Col>
    </Col>
  )
}
