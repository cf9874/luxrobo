import { BasicModal } from "./modal.basic"
import { Col, ConfigProvider, Radio, Row } from "antd"
import modalStyles from "./modal.module.scss"
import styles from "./modal.import.file.module.scss"
import { BasicButton } from "components/Button"
import { FilePdfOutlined } from "@ant-design/icons"
import { BasicDropdown } from "components/Dropdown"
import { useState } from "react"
import { useInputs } from "hooks"

export const ImportDxfModal = () => {
  //Upper Left : 1
  //Center : 2
  const [origin, setOrigin] = useState(1)

  const fileSizeLengthinput = useInputs({ value: "" })
  const fileSizeWidthinput = useInputs({ value: "" })
  const applySizeLengthinput = useInputs({ value: "" })
  const applySizeWidthinput = useInputs({ value: "" })
  const positionXinput = useInputs({ value: "0" })
  const positionYinput = useInputs({ value: "0" })

  const onApply = () => {
    console.log(origin)
    console.log("apply")
  }
  const onImport = () => {
    console.log("import")
  }
  return (
    <BasicModal
      header="Import Image"
      width={1200}
      height={796}
      footer={
        <Row justify={"end"} className={modalStyles.wide_modal_button_wrapper}>
          <BasicButton onClick={onApply}>Apply</BasicButton>
        </Row>
      }
    >
      <Col className={styles.import_dwg_container}>
        <Col className={styles.dwg_sheet}></Col>
        <Col className={styles.import_img_menu}>
          <Row className={styles.import_dwg_button_wrapper}>
            <BasicButton className={styles.import_dwg_button} onClick={onImport}>
              <FilePdfOutlined /> Select DXF File...
            </BasicButton>
          </Row>
          <div className={styles.divider} />
          <Row>
            <Row className={styles.menu_title}>File Information</Row>
            <Row align={"middle"}>
              <Col className={styles.size_title}>Size</Col>
              <input
                className={styles.size_menu_input}
                placeholder={"Length"}
                value={fileSizeLengthinput.value}
                onChange={fileSizeLengthinput.onChange}
              />
              <Col className={styles.times_text}>X</Col>
              <input
                className={styles.size_menu_input}
                placeholder={"Width"}
                value={fileSizeWidthinput.value}
                onChange={fileSizeWidthinput.onChange}
              />
              <div className={styles.unit_box}>mm</div>
            </Row>
          </Row>
          <div className={styles.divider} />
          <Row>
            <Row className={styles.menu_title}>Apply Information</Row>
            <Row align={"middle"}>
              <Col className={styles.size_title}>Size</Col>
              <input
                className={styles.size_menu_input}
                placeholder={"Length"}
                value={applySizeLengthinput.value}
                onChange={applySizeLengthinput.onChange}
              />
              <Col className={styles.times_text}>X</Col>
              <input
                className={styles.size_menu_input}
                placeholder={"Width"}
                value={applySizeWidthinput.value}
                onChange={applySizeWidthinput.onChange}
              />
              <BasicDropdown
                className={styles.unit_dropdown}
                options={[
                  { label: "mm", value: "mm" },
                  { label: "cm", value: "cm" },
                ]}
                defaultValue={{ label: "mm", value: "mm" }}
                size="small"
              />
            </Row>
            <Row
              align={"middle"}
              style={{
                marginTop: 24,
              }}
            >
              <Col className={styles.size_title}>Origin</Col>
              <Radio.Group onChange={e => setOrigin(e.target.value as number)} value={origin}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#45d6df",
                    },
                  }}
                >
                  <Radio value={1}>Upper Left</Radio>
                </ConfigProvider>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#45d6df",
                    },
                  }}
                >
                  <Radio value={2}>Center</Radio>
                </ConfigProvider>
              </Radio.Group>
            </Row>
          </Row>

          <div className={styles.divider} />
          <Row>
            <Row align={"middle"}>
              <Col className={styles.size_title}>Origin Position</Col>
              <input
                className={styles.position_menu_input}
                defaultValue={0}
                value={positionXinput.value}
                onChange={positionXinput.onChange}
              />
              <input
                className={styles.position_menu_input}
                defaultValue={0}
                value={positionYinput.value}
                onChange={positionYinput.onChange}
              />
            </Row>
          </Row>
        </Col>
      </Col>
    </BasicModal>
  )
}
