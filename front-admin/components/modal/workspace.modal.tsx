import { useAsyncEffect, useChanges, useInputs } from "@/hooks"
import { Modal, Pagination } from "antd"
import { useState } from "react"
import styles from "./workspaceModal.module.scss"
import { NewSearchBar } from "../search"
import { PROJECTWORKSPACEMODAL } from "@/const"
import { BasicButton } from "../Button"
import { BasicTable } from "../Table"
import { BasicCheckBox } from "../Checkbox"
import { searchAccountDto } from "@/apis/dto/admins.dto"
import { apiManager, apiUtil } from "@/apis"
import { API_ERROR_MSG } from "@/const/api.error.const"
import { useRouter } from "next/router"

export const WorkspaceModalIndex = {
  keys: ["index", "accountID", "name", "email", "phone_number"],
}

export const WorkSpaceModalIndexDetail = {
  index: { label: "No.", sorter: true },
  accountID: { label: "아이디", sorter: true },
  name: { label: "이름", sorter: true },
  email: { label: "이메일", sorter: true },
  phone_number: { label: "핸드폰", sorter: true },
}

export class WorkSpaceType extends searchAccountDto {
  key: React.Key
  index: number
}

// const WorkSpaceModal = ({ text }: { text?: string }) => {
const WorkSpaceModal = ({
  workspace,
  userID,
  teamID,
  movingHandler,
  cloneHandler,
}: {
  workspace: string
  userID: number
  teamID: number
  movingHandler
  cloneHandler?: any
}) => {
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [currentSpaceKey, setCurrentSpaceKey] = useState<React.Key>(undefined)

  // (Searching Data)
  const searchIsMatch = useChanges({ value: true })
  const searchRange = useChanges({ value: 1 })
  const searchKeywordInput = useInputs({ value: "" })

  // (row Select)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // (TableData)
  const [workspaceTable, setWorkSpaceTable] = useState<WorkSpaceType[]>([] as WorkSpaceType[])

  const [workspacePagination, setWorkSpacePagination] = useState({
    current: 1,
    defaultPageSize: 5,
    total: 1,
  })

  //------------------------------------------------------------------------------------------------------
  // 초기화
  useAsyncEffect(async () => {
    if (userID !== 0) setCurrentSpaceKey(`user/${userID}`)
    else if (teamID !== 0) setCurrentSpaceKey(`team/${teamID}`)
    else setCurrentSpaceKey(undefined)

    const workspaceResponse = await apiManager.authApi.searchWorkspaces("", { is_match: true, range: 1 })
    if (apiUtil.isErrorResponse(workspaceResponse)) {
      if (apiUtil.signChecker(workspaceResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
      }
      alert(workspaceResponse.message)
      return
    }

    setWorkSpaceTable(
      workspaceResponse.map((item, index) => ({
        ...item,
        index: index + 1,
        key: item.userID !== 0 ? `user/${item.userID}` : `team/${item.teamID}`,
      })),
    )
  }, [])

  useAsyncEffect(async () => {
    // console.log(workspaceTable)
    if (!workspaceTable || workspaceTable.length === 0) {
      setWorkSpacePagination({
        ...workspacePagination,
        current: 1,
        total: 1,
      })
    } else {
      setWorkSpacePagination({
        ...workspacePagination,
        current: 1,
        total: workspaceTable.length,
      })
    }
  }, [workspaceTable])

  //------------------------------------------------------------------------------------------------------
  // [function]
  const searchHandler = async () => {
    // console.log(searchKeywordInput.value)
    // console.log(searchIsMatch.value)
    // console.log(searchRange.value)

    const res = await apiManager.authApi.searchWorkspaces(searchKeywordInput.value, {
      is_match: searchIsMatch.value,
      range: searchRange.value,
    })
    if (apiUtil.isErrorResponse(res)) {
      if (apiUtil.signChecker(res)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(res.message)
      return
    }

    setWorkSpaceTable(
      res.map((item, index) => ({
        index: index + 1,
        key: item.userID !== 0 ? `user/${item.userID}` : `team/${item.teamID}`,
        ...item,
      })),
    )

    setWorkSpacePagination({ ...workspacePagination, current: 1, total: res.length })
    setSelectedRowKeys([])
  }

  const resetHandler = async () => {
    searchKeywordInput.onClear()
    searchIsMatch.onClear()
    searchRange.onClear()

    const res = await apiManager.authApi.searchWorkspaces("", {
      is_match: true,
      range: 1,
    })
    if (apiUtil.isErrorResponse(res)) {
      if (apiUtil.signChecker(res)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(res.message)
      return
    }

    setWorkSpaceTable(
      res.map((item, index) => ({
        index: index + 1,
        key: item.userID !== 0 ? `user/${item.userID}` : `team/${item.teamID}`,
        ...item,
      })),
    )

    setWorkSpacePagination({ ...workspacePagination, current: 1, total: res.length })
    setSelectedRowKeys([])
  }

  const showModal = async () => {
    resetHandler()
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div onClick={showModal} className={styles.modalOpenText}>
        {workspace ? workspace : "..."}
      </div>
      <Modal
        width={800}
        open={isModalOpen}
        title="프로젝트 작업 공간 변경"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={_ => (
          <div className={styles.workspace_footer}>
            <BasicButton key="cancel" className={styles.workspace_footer_button} onClick={handleCancel}>
              취소
            </BasicButton>
            <BasicButton
              className={styles.workspace_footer_button}
              disabled={!(selectedRowKeys.length === 1)}
              onClick={e => {
                const goto = selectedRowKeys[0].toString().split("/")

                if (goto[0] === "user")
                  movingHandler(
                    Number(goto[1]),
                    0,
                    workspaceTable.filter(item => item.key === selectedRowKeys[0])[0].accountID,
                  )
                else
                  movingHandler(
                    0,
                    Number(goto[1]),
                    workspaceTable.filter(item => item.key === selectedRowKeys[0])[0].name,
                  )
                handleCancel()
              }}
            >
              이동
            </BasicButton>
            {cloneHandler ? (
              <BasicButton
                className={styles.workspace_footer_button}
                disabled={!(selectedRowKeys.length === 1)}
                onClick={e => {
                  const goto = selectedRowKeys[0].toString().split("/")

                  if (goto[0] === "user") cloneHandler(Number(goto[1]), 0)
                  else cloneHandler(0, Number(goto[1]))
                  handleCancel()
                }}
              >
                복제
              </BasicButton>
            ) : (
              <></>
            )}
          </div>
        )}
      >
        <div className={styles.workspace_searchBar}>
          <NewSearchBar
            className={styles.index_searchBar_global}
            pageKey={PROJECTWORKSPACEMODAL}
            keyword={{ value: searchKeywordInput.value, onChange: searchKeywordInput.onChange }}
            is_match={{
              value: searchIsMatch.value,
              onChange: change => {
                searchIsMatch.onChange(change)
              },
            }}
            range={{
              value: searchRange.value,
              onChange: change => {
                searchRange.onChange(change)
              },
            }}
            searchHandler={searchHandler}
            resetHandler={resetHandler}
          ></NewSearchBar>
        </div>
        <div className={styles.workspace_tableWrapper}>
          <BasicTable
            option={"indexTable"}
            tableInfo={WorkspaceModalIndex}
            tableDetails={WorkSpaceModalIndexDetail}
            dataSource={workspaceTable}
            rowSelection={{
              columnTitle: (() => <BasicCheckBox disabled={true} />)(),
              selectedRowKeys,
              getCheckboxProps: record => ({
                disabled: record.key === currentSpaceKey,
              }),
              onChange: (newSelectedRowKeys: React.Key[]) => {
                console.log("selectedRowKeys changed: ", newSelectedRowKeys)
                setSelectedRowKeys(newSelectedRowKeys.slice(-1))
              },
            }}
            pagination={{
              ...workspacePagination,
              className: styles.tablePagination,
            }}
          ></BasicTable>
        </div>
        <div className={styles.workspace_pagination}>
          <Pagination
            {...workspacePagination}
            className={styles.pagination_global}
            onChange={(page, pageSize) => {
              setWorkSpacePagination({
                ...workspacePagination,
                current: page,
              })
            }}
          ></Pagination>
        </div>
      </Modal>
    </>
  )
}
export default WorkSpaceModal
