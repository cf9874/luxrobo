import { useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import { BasicModal } from "./modal.basic"
import { Col, Row } from "antd"
import modalStyles from "./modal.module.scss"
import styles from "./modal.spec.part.module.scss"
import { BasicButton } from "components/Button"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { BasicDropdown } from "components/Dropdown"

export const PartSpecModal = () => {
  const modalDispatch = useRedux(setModal)
  const onApply = () => {
    console.log(123)
  }

  return (
    <BasicModal
      header={"Parts Specification"}
      width={732}
      height={520}
      footer={
        <Row
          className={modalStyles.wide_modal_button_wrapper}
          justify={"center"}
          style={{
            gap: 12,
          }}
        >
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton onClick={onApply}>Apply</BasicButton>
        </Row>
      }
    >
      <Row className={styles.part_spec_wrapper}>
        <Row className={styles.part_spec_wrapper_nav_text} justify={"center"}>
          Parts의 스펙을 수정하거나 추가할 수 있습니다. 스펙을 추가하려면 +버튼을 누르세요.
        </Row>
        <div className={styles.divider} />
        <Row className={styles.add_part_spec_wrapper} justify={"center"}>
          <BasicDropdown
            options={[{ label: "Text", value: "Text" }]}
            style={{
              width: 500,
            }}
            defaultValue={{ label: "Text", value: "Text" }}
          />
          <PlusOutlined className={styles.add_spec_button} />
        </Row>
        <Row className={styles.part_spec_list}>
          <Row className={styles.part_spec_list_list_item}>
            <Col className={styles.part_spec_list_name}>제품 유형</Col>
            <Col className={styles.part_spec_list_info_box}>
              <Col className={styles.part_spec_list_value}>Value</Col>
              <Col className={styles.part_spec_list_option}>
                <BasicDropdown
                  options={[
                    {
                      label: "SOC",
                      value: "SOC",
                    },
                  ]}
                  defaultValue={{
                    label: "SOC",
                    value: "SOC",
                  }}
                  style={{
                    width: 140,
                  }}
                />
              </Col>
            </Col>
            <Col className={styles.part_spec_list_info_box}>
              <Col className={styles.part_spec_list_value}>Unit</Col>
              <Col className={styles.part_spec_list_option}>
                <BasicDropdown
                  options={[
                    {
                      label: "-",
                      value: "-",
                    },
                  ]}
                  defaultValue={{
                    label: "-",
                    value: "-",
                  }}
                  style={{
                    width: 120,
                  }}
                />
              </Col>
            </Col>

            <Col className={styles.part_spec_list_delete_icon}>
              <DeleteOutlined />
            </Col>
          </Row>
        </Row>
      </Row>
    </BasicModal>
  )
}
