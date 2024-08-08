import { useInputs, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import { BasicModal } from "./modal.basic"
import { Col, Row } from "antd"
import modalStyles from "./modal.module.scss"
import styles from "./modal.open.block.module.scss"
import { BasicButton } from "components/Button"
import { BasicInput } from "components/Input"
import { DeleteOutlined } from "@ant-design/icons"
import { CustomblockDto, LogicBlockInfoDto } from "apis/dto"
import { apiManager, apiUtil } from "apis"
import { Dispatch, SetStateAction, useState } from "react"
import { CATEGORY_COLOR } from "@const/block.const"

export const ImportCustomBlock = ({
  customList,
  setCustomList,
  setSpecState,
  setblockStyle,
  setSelectCustomBlock,
}: {
  customList: CustomblockDto[]
  setCustomList: Dispatch<SetStateAction<CustomblockDto[]>>
  setSelectCustomBlock: Dispatch<SetStateAction<CustomblockDto | undefined>>
  setSpecState: Dispatch<
    SetStateAction<{
      [key: string]: string
    }>
  >
  setblockStyle: Dispatch<
    SetStateAction<{
      icon: string
      activeColor: CATEGORY_COLOR | string
      type: string
      part_name?: string
      description?: string
    }>
  >
  setCustomBlock: Dispatch<SetStateAction<LogicBlockInfoDto | null>>
}) => {
  const modalDispatch = useRedux(setModal)
  const [customBlockState, setCustomBlockState] = useState<CustomblockDto>()
  const [customListState, setCustomListState] = useState(customList)
  const onApply = () => {
    setSelectCustomBlock(customBlockState)
    setSpecState(customBlockState?.specification ?? {})
    setblockStyle({
      activeColor: customBlockState?.color ?? "",
      icon: "/icons/" + customBlockState?.type.toLocaleLowerCase() + ".svg",
      type: customBlockState?.type ?? "",
      part_name: customBlockState?.name ?? "",
      description: customBlockState?.description ?? "",
    })
    modalDispatch({ open: false })
  }

  const searchInput = useInputs({ value: "" })

  return (
    <BasicModal
      header={"Open Custom Block"}
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
          <BasicButton
            onClick={() => {
              modalDispatch({ open: false })
            }}
          >
            Cancel
          </BasicButton>
          <BasicButton onClick={onApply}>Apply</BasicButton>
        </Row>
      }
    >
      <Row className={styles.open_custom_block_wrapper}>
        <Row className={styles.open_custom_block_wrapper_nav_text} justify={"center"}>
          클라우드에 저장된 Custom Block 목록입니다.
        </Row>
        <div className={styles.divider} />
        <Row className={styles.open_custom_block_wrapper_search_input_wrapper} justify={"center"}>
          <BasicInput
            style={{
              width: 532,
              height: 40,
              borderRadius: 20,
            }}
            onClick={() =>
              setCustomListState(() => customList.filter(block => block.name.includes(searchInput.value.toString())))
            }
            value={searchInput.value}
            onChange={searchInput.onChange}
            onKeyDown={event => {
              if (event.key === "Enter") {
                if (searchInput.value === "") {
                  setCustomListState(customList)
                } else {
                  // setCustomListState(() => blockList.filter(faq => faq.tags.includes(searchInput.value.toString())))
                  setCustomListState(() =>
                    customList.filter(block => block.name.includes(searchInput.value.toString())),
                  )
                }
              }
            }}
            className={styles.open_custom_block_wrapper_search_input}
          />
        </Row>
        <Row className={styles.custom_block_list}>
          {customListState?.map(v => {
            return (
              <Row
                key={v.customblockID}
                className={
                  v.customblockID === customBlockState?.customblockID
                    ? styles.custom_block_list_item_selected
                    : styles.custom_block_list_item
                }
                onClick={() => {
                  console.log(123, v)
                  setCustomBlockState(v)
                  setblockStyle({
                    activeColor: v.color,
                    type: v.type,
                    icon: "/icons/" + v.type.toLocaleLowerCase() + ".svg",
                    description: v.description,
                    part_name: v.name,
                  })
                  setSpecState(v.specification)
                }}
              >
                <Col className={styles.custom_block_name}>{v.name}</Col>
                <Col className={styles.custom_block_info_box}>
                  <Col className={styles.custom_block_info}>{v.description}</Col>
                  <Col className={styles.custom_block_delete_icon}>
                    <DeleteOutlined
                      onClick={async () => {
                        const response = await apiManager.blockApi.remove({
                          customblockID: v.customblockID,
                          blocks: { delete_name: v.name },
                        })

                        if (apiUtil.isErrorResponse(response)) {
                          alert(response.message)
                          return
                        }
                        console.log(response)
                        setCustomListState(list => list.filter(e => e.customblockID !== v.customblockID))
                        setCustomList(list => list.filter(e => e.customblockID !== v.customblockID))
                      }}
                    />
                  </Col>
                </Col>
              </Row>
            )
          })}
        </Row>
      </Row>
    </BasicModal>
  )
}
