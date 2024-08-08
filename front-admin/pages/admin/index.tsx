import { useAsyncEffect } from "@/hooks"
import { PageFrame } from "@/components/layout"
import { Divider, Pagination } from "antd"
import { useState } from "react"
import { VALID, paginationSize } from "@/const"
import { NextPage } from "next"
import { AuthIndex, AuthIndexDetail, AuthIndexType } from "@/components/pages/admin/indexDesc"
import { BasicTable } from "@/components/Table"
import { apiManager } from "@/apis"
import styles from "@/pages/admin/admin.module.scss"
import { BasicCheckBox } from "@/components/Checkbox"
import { BasicButton } from "@/components/Button"
import { apiUtil } from "@/apis/api.util"
import { useRouter } from "next/router"
import { API_ERROR_MSG } from "@/const/api.error.const"
import dynamic from "next/dynamic"
const AdminNewModal = dynamic(() => import("@/components/modal/admin.new.modal"))

const AdminPage: NextPage = () => {
  //
  const router = useRouter()
  //------------------------------------------------------------------------------------------------------
  // [Data]
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])

  //
  const [editAdminDatas, setEditAdminDatas] = useState<AuthIndexType[]>([])
  const [newAdminDatas, setNewAdminDatas] = useState<AuthIndexType[]>([])

  const [deleteAdminIDs, setDeleteAdminIDs] = useState<number[]>([])

  const [CL_pagination, setCLPagination] = useState({
    current: 1,
    defaultPageSize: paginationSize,
    total: 1,
  })

  //------------------------------------------------------------------------------------------------------
  // 초기화
  useAsyncEffect(async () => {
    const authResponse = await apiManager.authApi.getAuthList()
    if (apiUtil.isErrorResponse(authResponse)) {
      if (apiUtil.signChecker(authResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(authResponse.message)
      return
    }

    const modifiedAdminDatas = await authResponse.map((item, index) => {
      return {
        key: item.auth_ID,
        ...item,
      }
    })

    setEditAdminDatas(modifiedAdminDatas)
  }, [])

  // tableData 변경시 -> pagination 정보 변경
  useAsyncEffect(async () => {
    const totalLength = editAdminDatas.length + newAdminDatas.length
    if (totalLength === 0) {
      setCLPagination({
        ...CL_pagination,
        current: 1,
        total: 1,
      })
    } else {
      setCLPagination({
        ...CL_pagination,
        current: (() => {
          if (CL_pagination.current > Math.ceil(totalLength / CL_pagination.defaultPageSize))
            return CL_pagination.current - 1 < 1 ? 1 : CL_pagination.current - 1
          return CL_pagination.current
        })(),
        total: totalLength,
      })
    }
  }, [editAdminDatas.length, newAdminDatas.length])

  //------------------------------------------------------------------------------------------------------
  // [Function]
  const deleteHandler = async () => {
    setDeleteAdminIDs([...deleteAdminIDs, ...selectedRowKeys.filter(item => item > 0)].sort())

    //console.log(deleteAdminIDs)

    setEditAdminDatas(editAdminDatas.filter(item => !selectedRowKeys.includes(item.auth_ID)))
    setNewAdminDatas(newAdminDatas.filter(item => !selectedRowKeys.includes(item.auth_ID)))

    setSelectedRowKeys([])
  }

  const saveHandler = async () => {
    // 1. 삭제
    console.log(deleteAdminIDs)
    const authDeleteRes = await apiManager.authApi.deleteAuth(deleteAdminIDs)
    if (apiUtil.isErrorResponse(authDeleteRes)) {
      if (apiUtil.signChecker(authDeleteRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(authDeleteRes.message)
      return
    }

    // 2. 수정
    for (const item of editAdminDatas.filter(item => item.auth_admin !== true)) {
      const { key, auth_ID, auth_admin, ...authEdit } = item

      console.log("authEdit", authEdit)
      const authEditRes = await apiManager.authApi.setAuthRange(authEdit)
      // const authEditRes = await apiManager.authApi.setAuthRange(auth_ID, authEdit)
      if (apiUtil.isErrorResponse(authEditRes)) {
        if (apiUtil.signChecker(authEditRes)) {
          alert(API_ERROR_MSG.NEEDLOGIN)
          apiUtil.removeUserData()
          void router.push("/signin")
          return
        }
        alert(authEditRes.message)
        return
      }
    }

    // 3. 추가
    for (const item of newAdminDatas) {
      const { key, auth_ID, auth_admin, ...authNew } = item

      console.log("authEdit", authNew)
      const authNewRes = await apiManager.authApi.createAuth(authNew)

      if (apiUtil.isErrorResponse(authNewRes)) {
        if (apiUtil.signChecker(authNewRes)) {
          alert(API_ERROR_MSG.NEEDLOGIN)
          apiUtil.removeUserData()
          void router.push("/signin")
          return
        }
        alert(authNewRes.message)
        return
      }
    }

    void router.reload()
  }

  const renderSetAdmin = (index, key, change) => {
    const editLength = editAdminDatas.length
    if (index < editLength) {
      setEditAdminDatas(
        (() => {
          const newEditAdminDatas = editAdminDatas.map((item, idx) => {
            if (index === idx) {
              return {
                ...item,
                [key]: change,
              }
            }
            return item
          })

          return newEditAdminDatas
        })(),
      )
    } else {
      const newIndex = index - editLength
      setNewAdminDatas(
        (() => {
          const newNewAdimnDatas = newAdminDatas.map((item, idx) => {
            if (newIndex === idx) {
              return {
                ...item,
                [key]: change,
              }
            }
            return item
          })

          return newNewAdimnDatas
        })(),
      )
    }
  }

  const adminIndexRender = ({ index, key, pm_value, record }) => {
    switch (key) {
      case "auth_user":
      case "auth_team":
      case "auth_project":
      case "auth_customblock":
      case "auth_part":
      case "auth_company":
      case "auth_order":
      case "auth_contact":
        return (
          <BasicCheckBox
            disabled={record.auth_admin}
            checked={pm_value}
            onChange={e => {
              renderSetAdmin(index, key, !pm_value)
            }}
          ></BasicCheckBox>
        )
      default:
        if (typeof pm_value === "object" && !Array.isArray(pm_value) && pm_value !== null)
          return <div>{JSON.stringify(pm_value)}</div>
        return <div>{pm_value}</div>
    }
  }

  return (
    <PageFrame titleKey={VALID}>
      <div className={styles.contatiner}>
        <div className={styles.tableHeader}>
          <h1>관리자 권한 설정</h1>
        </div>
        <Divider />
        <div className={styles.tableTopButton}>
          <BasicButton className={styles.deleteBtn} onClick={deleteHandler}>
            선택 삭제
          </BasicButton>
        </div>
        <div>
          <BasicTable
            option={"indexTable"}
            tableInfo={AuthIndex}
            tableDetails={AuthIndexDetail}
            render={adminIndexRender}
            dataSource={[...editAdminDatas, ...newAdminDatas]}
            rowSelection={{
              selectedRowKeys,
              getCheckboxProps: record => ({
                disabled: record.auth_admin === true,
              }),
              onChange: (newSelectedRowKeys: number[]) => {
                console.log("selectedRowKeys changed: ", newSelectedRowKeys)
                setSelectedRowKeys(newSelectedRowKeys)
              },
            }}
            pagination={{ ...CL_pagination, className: styles.tablePagination }}
          />
        </div>
        <div className={styles.tableBottomButton}>
          <div className={styles.bottomButton}>
            <AdminNewModal id={-newAdminDatas.length - 1} adminList={newAdminDatas} setAdminList={setNewAdminDatas} />
            <BasicButton className={styles.saveBtn} onClick={saveHandler}>
              저장
            </BasicButton>
          </div>
          <Pagination
            {...CL_pagination}
            className={styles.pagination_global}
            onChange={(page, pageSize) => {
              setCLPagination({
                ...CL_pagination,
                current: page,
              })
            }}
          ></Pagination>
        </div>
      </div>
    </PageFrame>
  )
}

export default AdminPage
