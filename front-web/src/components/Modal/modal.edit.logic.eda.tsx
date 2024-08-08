import { BasicModal } from "./modal.basic"
import { Col, Row } from "antd"
import modalStyles from "./modal.module.scss"
import styles from "./modal.edit.logic.eda.module.scss"
import { BasicButton } from "components/Button"
import { CloudUploadOutlined, DownloadOutlined } from "@ant-design/icons"

export const EditLogicEda = () => {
  const onDownload = () => {
    console.log("Download")
  }
  const onUpload = () => {
    console.log("Upload")
  }
  const onApply = () => {
    console.log("Apply")
  }
  return (
    <BasicModal
      header="Edit"
      width={1812}
      height={892}
      footer={
        <Row justify={"space-between"} className={modalStyles.wide_modal_button_wrapper}>
          <BasicButton
            onClick={() => console.log("mini map")}
            style={{
              width: 40,
              borderRadius: 20,
            }}
          ></BasicButton>
          <Col className={styles.edit_logic_button_wrapper}>
            <BasicButton onClick={onDownload}>
              <DownloadOutlined /> Download
            </BasicButton>
            <BasicButton onClick={onUpload}>
              <CloudUploadOutlined /> Upload
            </BasicButton>
            <BasicButton onClick={onApply}>Apply</BasicButton>
          </Col>
        </Row>
      }
    >
      {""}
    </BasicModal>
  )
}
